#!/usr/bin/env node

import { connectToDatabase } from '../lib/db'
import { K8S_ERRORS } from '../kubernetes/errors/k8s_errors'
import { HELM_ERRORS } from '../helm/errors/helm_errors'
import { KUBECTL_ERRORS } from '../kubectl/errors/kubectl_errors'
import { DOCKER_ERRORS } from '../docker/errors/docker_errors'
import { CNI_ERRORS } from '../cni/errors/cni_errors'
import { ErrorSchema } from '../lib/schema'
import { logger } from '../lib/logger'

// All datasets to seed
const ALL_DATASETS = [
  { tool: 'kubernetes', errors: K8S_ERRORS },
  { tool: 'helm', errors: HELM_ERRORS },
  { tool: 'kubectl', errors: KUBECTL_ERRORS },
  { tool: 'docker', errors: DOCKER_ERRORS },
  { tool: 'cni', errors: CNI_ERRORS }
]

interface SeedStats {
  inserted: number
  updated: number
  skipped: number
  errors: number
  totalProcessed: number
}

async function seedProduction() {
  logger.log('🚀 Starting production database seeding...')
  
  // Validate environment
  if (!process.env.MONGODB_URI) {
    logger.error('❌ MONGODB_URI environment variable is required')
    process.exit(1)
  }

  // Check SEED_LOCK to prevent accidental overwrites
  if (process.env.SEED_LOCK === 'true') {
    logger.error('❌ SEED_LOCK is enabled. Set SEED_LOCK=false to allow seeding')
    process.exit(1)
  }

  if (process.env.NODE_ENV !== 'production' && process.env.FORCE_SEED !== 'true') {
    logger.warn('⚠️  This script is intended for production use')
    logger.log('Set FORCE_SEED=true to run in non-production environments')
    process.exit(1)
  }

  const connection = await connectToDatabase()
  
  if (!connection) {
    logger.error('❌ Failed to connect to database')
    process.exit(1)
  }

  logger.log('✅ Database connection established')

  const errorsCollection = connection.db.collection('errors')
  const overallStats: SeedStats = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    totalProcessed: 0
  }

  // Process each dataset
  for (const dataset of ALL_DATASETS) {
    logger.log(`\n📦 Processing ${dataset.tool} errors...`)
    
    const toolStats = await seedToolDataset(errorsCollection, dataset.tool, dataset.errors)
    
    overallStats.inserted += toolStats.inserted
    overallStats.updated += toolStats.updated
    overallStats.skipped += toolStats.skipped
    overallStats.errors += toolStats.errors
    overallStats.totalProcessed += toolStats.totalProcessed

    logger.log(`   ✓ ${dataset.tool}: ${toolStats.inserted} inserted, ${toolStats.updated} updated, ${toolStats.skipped} skipped`)
    
    if (toolStats.errors > 0) {
      logger.warn(`   ⚠️  ${toolStats.errors} validation errors in ${dataset.tool}`)
    }
  }

  // Final statistics
  logger.log('\n📊 Seeding Summary:')
  logger.log(`   Total processed: ${overallStats.totalProcessed}`)
  logger.log(`   ✅ Inserted: ${overallStats.inserted}`)
  logger.log(`   📝 Updated: ${overallStats.updated}`)
  logger.log(`   ⏭️  Skipped: ${overallStats.skipped}`)
  logger.log(`   ❌ Errors: ${overallStats.errors}`)

  // Verify collection state
  const finalCount = await errorsCollection.countDocuments()
  logger.log(`\n🎯 Final database state: ${finalCount} total errors`)

  // Tool breakdown
  const toolBreakdown = await errorsCollection.aggregate([
    { $group: { _id: '$tool', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).toArray()

  logger.log('\n📈 Tool breakdown:')
  for (const tool of toolBreakdown) {
    logger.log(`   ${tool._id}: ${tool.count} errors`)
  }

  logger.log('\n🎉 Production seeding completed successfully!')
  process.exit(0)
}

async function seedToolDataset(collection: any, tool: string, errors: any[]): Promise<SeedStats> {
  const stats: SeedStats = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    totalProcessed: 0
  }

  for (const error of errors) {
    stats.totalProcessed++

    try {
      // Validate against schema
      const validError = ErrorSchema.parse(error)

      // Check if error already exists
      const existing = await collection.findOne({
        tool: validError.tool,
        canonical_slug: validError.canonical_slug
      })

      // Add timestamps
      const now = new Date().toISOString()
      if (!validError.created_at) {
        validError.created_at = now
      }
      validError.updated_at = now

      if (existing) {
        // Only update if the existing error is older or missing fields
        const existingDate = existing.updated_at || existing.created_at || '2024-01-01'
        const shouldUpdate = validError.updated_at > existingDate || 
                           !existing.summary || 
                           existing.summary.length < 10

        if (shouldUpdate) {
          await collection.replaceOne(
            { _id: existing._id },
            validError
          )
          stats.updated++
        } else {
          stats.skipped++
        }
      } else {
        // Insert new error
        await collection.insertOne(validError)
        stats.inserted++
      }

    } catch (validationError) {
      logger.error(`❌ Validation failed for ${error.canonical_slug}:`, validationError instanceof Error ? validationError.message : 'Unknown error')
      stats.errors++
    }
  }

  return stats
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.log('\n⏸️  Seeding interrupted by user')
  process.exit(1)
})

process.on('SIGTERM', () => {
  logger.log('\n⏸️  Seeding terminated')
  process.exit(1)
})

// Run the seeding
if (require.main === module) {
  seedProduction().catch((error) => {
    logger.error('💥 Seeding failed:', error)
    process.exit(1)
  })
}
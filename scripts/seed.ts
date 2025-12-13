import { readFileSync } from 'fs'
import { join } from 'path'
import clientPromise from '../lib/mongodb.js'
import { ErrorSchema } from '../lib/schema.js'

async function seed() {
  try {
    // Read seed data
    const seedPath = join(process.cwd(), 'seed', 'kubernetes.errors.seed.json')
    const seedData = JSON.parse(readFileSync(seedPath, 'utf8'))
    
    // Validate each error against schema
    const validErrors = []
    for (const error of seedData) {
      try {
        const validError = ErrorSchema.parse(error)
        validErrors.push(validError)
      } catch (validationError) {
        console.error(`Validation failed for error ${error.canonical_slug}:`, validationError)
        process.exit(1)
      }
    }
    
    console.log(`✓ All ${validErrors.length} errors passed validation`)
    
    // Connect to database
    const client = await clientPromise
    const db = client.db()
    const errorsCollection = db.collection('errors')
    
    // Upsert each error by canonical_slug and tool
    let insertedCount = 0
    let updatedCount = 0
    
    for (const error of validErrors) {
      // Add timestamps if missing
      const now = new Date().toISOString()
      if (!error.created_at) error.created_at = now
      error.updated_at = now
      
      const result = await errorsCollection.replaceOne(
        { tool: error.tool, canonical_slug: error.canonical_slug },
        error,
        { upsert: true }
      )
      
      if (result.upsertedId) {
        insertedCount++
      } else {
        updatedCount++
      }
    }
    
    console.log(`✓ Database seeded successfully:`)
    console.log(`  - Inserted: ${insertedCount} errors`)
    console.log(`  - Updated: ${updatedCount} errors`)
    console.log(`  - Total: ${validErrors.length} errors`)
    
    process.exit(0)
    
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

seed()
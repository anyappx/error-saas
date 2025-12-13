import { MongoClient, Db } from 'mongodb'
import { logger } from './logger'

// Cached connection for serverless environments (globalThis for Vercel)
const globalForMongo = globalThis as unknown as {
  mongo: { client: MongoClient; db: Db } | undefined
}

let cachedClient: MongoClient | null = globalForMongo.mongo?.client ?? null
let cachedDb: Db | null = globalForMongo.mongo?.db ?? null

interface DatabaseConnection {
  client: MongoClient
  db: Db
}

export async function connectToDatabase(): Promise<DatabaseConnection | null> {
  // Return null if no MongoDB URI configured
  if (!process.env.MONGODB_URI) {
    logger.warn('[DB] No MONGODB_URI found - running in static mode')
    return null
  }

  try {
    // Use cached connection if available (important for serverless)
    if (cachedClient && cachedDb) {
      // Test the connection
      await cachedClient.db().admin().ping()
      return { client: cachedClient, db: cachedDb }
    }

    logger.log('[DB] Establishing new MongoDB connection...')
    
    // Create new connection
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    })

    await client.connect()
    
    // Test connection
    await client.db().admin().ping()
    
    const db = client.db(process.env.MONGODB_DB || 'k8s_errors_prod')

    // Cache for future requests (both local and global for Vercel)
    cachedClient = client
    cachedDb = db
    globalForMongo.mongo = { client, db }

    logger.log('[DB] MongoDB connection established successfully')
    return { client, db }

  } catch (error) {
    logger.warn('[DB] MongoDB connection failed, falling back to static mode:', error instanceof Error ? error.message : 'Unknown error')
    
    // Reset cache on failure
    cachedClient = null
    cachedDb = null
    globalForMongo.mongo = undefined
    
    // Return null to trigger static fallback
    return null
  }
}

export async function getErrorsCollection(tool: string = 'kubernetes') {
  const connection = await connectToDatabase()
  
  if (!connection) {
    return null
  }

  try {
    return connection.db.collection('errors')
  } catch (error) {
    logger.warn('[DB] Failed to get collection:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

// Health check function for monitoring
export async function checkDatabaseHealth() {
  try {
    const connection = await connectToDatabase()
    
    if (!connection) {
      return {
        connected: false,
        error: 'No MongoDB URI configured or connection failed'
      }
    }

    // Count total errors
    const collection = connection.db.collection('errors')
    const count = await collection.countDocuments()
    
    // Get counts by tool
    const toolCounts = await collection.aggregate([
      { $group: { _id: '$tool', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray()

    return {
      connected: true,
      totalErrors: count,
      toolBreakdown: toolCounts.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {} as Record<string, number>)
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Graceful cleanup (for local development)
export async function closeDatabaseConnection() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}
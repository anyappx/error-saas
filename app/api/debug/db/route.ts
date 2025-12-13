import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '../../../../lib/db'
import { getErrorStats } from '../../../../lib/dbFallback'

export async function GET() {
  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth()
    
    // Get error statistics from fallback system
    const errorStats = await getErrorStats()
    
    return NextResponse.json({
      database: {
        connected: dbHealth.connected,
        connectionDetails: dbHealth.connected ? {
          totalErrors: dbHealth.totalErrors || 0,
          toolBreakdown: dbHealth.toolBreakdown || {}
        } : null,
        error: dbHealth.error || null
      },
      staticFallback: {
        source: errorStats.source,
        totalErrors: errorStats.total,
        toolBreakdown: errorStats.byTool
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoDbName: process.env.MONGODB_DB || 'k8s_errors_prod'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get database status',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { safeFindErrorBySlug } from '@/lib/dbFallback'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Use safe fallback to get error
    const error = await safeFindErrorBySlug('kubernetes', slug)
    
    if (!error) {
      return NextResponse.json(
        { error: 'Error not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(error)
    
  } catch (error) {
    logger.error('[API] Kubernetes error fetch failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
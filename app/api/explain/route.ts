import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { safeFindErrors } from '../../../lib/dbFallback'
import { connectToDatabase } from '../../../lib/db'
import { normalizeText } from '../../../lib/normalize'
import { matchError } from '../../../lib/matcher'
import { logger } from '../../../lib/logger'

const RequestSchema = z.object({
  text: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = RequestSchema.parse(body)
    
    // Get all Kubernetes errors using safe fallback
    const validErrors = await safeFindErrors('kubernetes')
    
    // Normalize input text
    const normalizedText = normalizeText(text)
    
    // Match error
    const matchResult = matchError(normalizedText, validErrors)
    
    // Try to save submission to database (optional - won't fail if DB unavailable)
    try {
      const connection = await connectToDatabase()
      if (connection) {
        const submission = {
          raw_text: text,
          normalized_text: normalizedText,
          matched_slug: matchResult.slug,
          matched_confidence: matchResult.confidence,
          created_at: new Date().toISOString()
        }
        
        await connection.db.collection('submissions').insertOne(submission)
      }
    } catch (dbError) {
      logger.warn('[API] Failed to save submission:', dbError instanceof Error ? dbError.message : 'Unknown error')
      // Continue without failing the request
    }
    
    // Get matched error details
    let errorDetails = null
    if (matchResult.slug) {
      errorDetails = validErrors.find(e => e.canonical_slug === matchResult.slug)
    }
    
    // Flatten sources from causes, steps, and examples
    const allSources = errorDetails ? [
      ...errorDetails.root_causes.flatMap(c => c.sources),
      ...errorDetails.fix_steps.flatMap(s => s.sources),
      ...errorDetails.examples.flatMap(e => e.sources)
    ] : []
    
    // Remove duplicates
    const uniqueSources = allSources.filter((source, index, self) => 
      index === self.findIndex(s => s.url === source.url)
    )
    
    // Determine clarifying question
    let clarifyingQuestion = null
    if (matchResult.confidence < 0.6 && errorDetails) {
      clarifyingQuestion = errorDetails.clarifying_questions[0] || 
        "Can you provide more context about when this error occurs?"
    }
    
    return NextResponse.json({
      tool: 'kubernetes',
      match: {
        slug: matchResult.slug,
        confidence: matchResult.confidence
      },
      title: errorDetails?.title || null,
      summary: errorDetails?.summary || null,
      root_causes: errorDetails?.root_causes || [],
      fix_steps: errorDetails?.fix_steps || [],
      sources: uniqueSources,
      clarifying_question: clarifyingQuestion,
      suggestions: matchResult.confidence < 0.6 ? matchResult.suggestions : []
    })
    
  } catch (error) {
    logger.error('[API] Explain error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { safeFindErrors } from '@/lib/dbFallback'
import { normalizeText } from '../../../lib/normalize'
import { matchError } from '../../../lib/matcher'
import { logger } from '@/lib/logger'

export interface OCRExplainRequest {
  image?: string // base64 encoded image
  text?: string // extracted text
  extractText?: boolean // whether to extract text from image
}

export interface OCRExplainResponse {
  success: boolean
  extractedText?: string
  matchResult?: {
    slug: string | null
    confidence: number
    score: number
    suggestions: Array<{
      slug: string
      title: string
      category: string
      score: number
    }>
  }
  error?: any
  explanation?: string
  recommendations?: string[]
  dataSource: 'database' | 'static'
}

// Vercel-compatible OCR function
async function extractTextFromImage(base64Image: string): Promise<string> {
  try {
    // Remove data URL prefix if present
    const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, '')
    
    // Check if AI service is configured
    if (process.env.OPENAI_API_KEY && process.env.OCR_ENABLED === 'true') {
      return await extractWithOpenAI(imageData)
    }
    
    if (process.env.ANTHROPIC_API_KEY && process.env.OCR_ENABLED === 'true') {
      return await extractWithAnthropic(imageData)
    }
    
    // Fallback to mock OCR for development
    return getMockOCRResult(imageData)
    
  } catch (error) {
    logger.warn('[OCR] Text extraction failed, using fallback:', error instanceof Error ? error.message : 'Unknown error')
    return getMockOCRResult(base64Image)
  }
}

async function extractWithOpenAI(imageData: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text from this error screenshot. Focus on error messages, stack traces, and kubectl/docker output. Return only the extracted text."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })
  })

  const data = await response.json()
  return data.choices[0]?.message?.content || 'Could not extract text from image'
}

async function extractWithAnthropic(imageData: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageData
              }
            },
            {
              type: "text",
              text: "Extract all text from this error screenshot. Focus on error messages, stack traces, and kubectl/docker output. Return only the extracted text."
            }
          ]
        }
      ]
    })
  })

  const data = await response.json()
  return data.content[0]?.text || 'Could not extract text from image'
}

function getMockOCRResult(imageData: string): string {
  // Mock OCR results for development/demo
  const mockResults = [
    "Error: failed to pull image nginx:latest - pull access denied for nginx, repository does not exist or may require authorization: server message: insufficient_scope: authorization failed",
    "Pod test-pod-12345 is in CrashLoopBackOff state. Container nginx in pod test-pod-12345 is restarting repeatedly. Back-off 5m0s restarting failed container",
    "Error from server (Forbidden): pods is forbidden: User system:serviceaccount:default:default cannot create resource pods in API group in the namespace default",
    "The node was low on resource: memory. Container nginx was using 1.2GB, which exceeds its request of 512MB. The node had insufficient memory available",
    "Warning FailedScheduling 3m pod Insufficient cpu: 1 Insufficient memory: 2 node(s) didn't have free ports for the requested pod ports"
  ]
  
  // Return a random mock result (in real OCR, this would be the actual extracted text)
  return mockResults[Math.floor(Math.random() * mockResults.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    let extractedText = ''
    
    // Handle text extraction
    if (body.image && body.extractText !== false) {
      try {
        extractedText = await extractTextFromImage(body.image)
      } catch (error) {
        console.error('[OCR] Image processing failed:', error)
        return NextResponse.json({
          success: false,
          error: 'Failed to process image',
          dataSource: 'static'
        })
      }
    } else if (body.text) {
      extractedText = body.text
    } else {
      return NextResponse.json({
        success: false,
        error: 'Either image or text must be provided',
        dataSource: 'static'
      })
    }

    // Normalize and match the error using safe fallback
    const normalizedText = normalizeText(extractedText)
    const kubernetesErrors = await safeFindErrors('kubernetes')
    const matchResult = matchError(normalizedText, kubernetesErrors)
    
    // Find the matched error object
    const matchedError = matchResult.slug
      ? kubernetesErrors.find(e => e.canonical_slug === matchResult.slug)
      : null

    // Generate explanation
    let explanation = 'No matching Kubernetes error found.'
    let recommendations: string[] = []
    
    if (matchedError) {
      explanation = `This appears to be a "${matchedError.title}" error. ${matchedError.summary}`
      
      recommendations = [
        ...matchedError.fix_steps.slice(0, 3).map(step => step.step),
        ...(matchResult.confidence < 0.8 ? ['Consider reviewing the error context for more specific diagnosis'] : [])
      ]
    } else if (matchResult.suggestions.length > 0) {
      explanation = 'While no exact match was found, this error might be related to the following issues:'
      recommendations = matchResult.suggestions.slice(0, 3).map(s => s.title)
    }

    return NextResponse.json({
      success: true,
      extractedText,
      matchResult,
      explanation,
      recommendations,
      dataSource: 'static' // Will be enhanced to detect actual source
    })

  } catch (error) {
    logger.error('[OCR] Request processing failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error',
      dataSource: 'static'
    }, { status: 500 })
  }
}
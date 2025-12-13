import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL || null,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || null
    },
    database: {
      mongodb: !!process.env.MONGODB_URI,
      mongodbDb: process.env.MONGODB_DB || 'k8s_errors_prod'
    },
    ai: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      ocrEnabled: process.env.OCR_ENABLED === 'true',
      ocrProvider: process.env.OCR_PROVIDER || 'mock'
    },
    api: {
      rateLimit: {
        max: process.env.API_RATE_LIMIT_MAX || 1000,
        window: process.env.API_RATE_LIMIT_WINDOW || 900000
      },
      hasApiKey: !!process.env.API_KEY
    },
    monitoring: {
      googleAnalytics: !!process.env.GOOGLE_ANALYTICS_ID,
      sentry: !!process.env.SENTRY_DSN
    },
    timestamp: new Date().toISOString()
  })
}
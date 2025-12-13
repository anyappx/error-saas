import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const errors = await db.collection('errors')
      .find({ tool: 'kubernetes' }, { projection: { canonical_slug: 1, updated_at: 1 } })
      .toArray()
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  ${errors.map(error => `
  <url>
    <loc>${baseUrl}/kubernetes/errors/${error.canonical_slug}</loc>
    <lastmod>${error.updated_at || new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
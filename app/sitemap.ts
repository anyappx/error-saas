import { MetadataRoute } from 'next'
import { safeFindErrors } from '../lib/dbFallback'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kubernetes-errors.com'
  
  try {
    // Get all errors for generating error-specific sitemaps
    const errors = await safeFindErrors()
    
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/dashboard`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/errors`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/assistant`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
      }
    ]

    // Error overview pages
    const errorOverviewRoutes: MetadataRoute.Sitemap = errors.map(error => ({
      url: `${baseUrl}/errors/${error.canonical_slug}`,
      lastModified: new Date(error.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))

    // Error sub-pages for SEO
    const errorSubPageRoutes: MetadataRoute.Sitemap = errors.flatMap(error => [
      {
        url: `${baseUrl}/errors/${error.canonical_slug}/causes`,
        lastModified: new Date(error.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7
      },
      {
        url: `${baseUrl}/errors/${error.canonical_slug}/fixes`,
        lastModified: new Date(error.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8
      },
      {
        url: `${baseUrl}/errors/${error.canonical_slug}/examples`,
        lastModified: new Date(error.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6
      },
      {
        url: `${baseUrl}/errors/${error.canonical_slug}/related`,
        lastModified: new Date(error.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6
      }
    ])

    // Category pages
    const categories = Array.from(new Set(errors.map(error => error.category)))
    const categoryRoutes: MetadataRoute.Sitemap = categories.map(category => ({
      url: `${baseUrl}/errors?category=${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))

    // Tool pages
    const tools = Array.from(new Set(errors.map(error => error.tool)))
    const toolRoutes: MetadataRoute.Sitemap = tools.map(tool => ({
      url: `${baseUrl}/errors?tool=${tool}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))

    return [
      ...staticRoutes,
      ...errorOverviewRoutes,
      ...errorSubPageRoutes,
      ...categoryRoutes,
      ...toolRoutes
    ]
    
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback to static routes only if error data can't be loaded
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/dashboard`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/errors`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/assistant`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
      }
    ]
  }
}
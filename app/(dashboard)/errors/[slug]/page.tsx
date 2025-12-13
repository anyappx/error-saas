import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Terminal,
  BookOpen,
  Share,
  Download,
  Star,
  FileText,
  Users,
  BarChart3
} from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Separator } from "../../../../components/ui/separator"
import { EnterpriseBadge } from "../../../../components/ui/enterprise-badge"
import { cn } from "../../../../lib/utils"
import { safeFindErrorBySlug, safeFindErrors } from "../../../../lib/dbFallback"
import { hasFeature } from "../../../../lib/features"

interface ErrorDetailProps {
  params: Promise<{
    slug: string
  }>
}

// Server-side data fetching
async function getErrorData(slug: string) {
  return await safeFindErrorBySlug('kubernetes', slug)
}

async function getRelatedErrors(currentError: any, limit = 5) {
  const allErrors = await safeFindErrors()
  
  return allErrors
    .filter(error => 
      error.canonical_slug !== currentError.canonical_slug &&
      (error.category === currentError.category || 
       error.title.toLowerCase().includes(currentError.title.toLowerCase().split(' ')[0]))
    )
    .slice(0, limit)
}

// SEO Metadata Generation
export async function generateMetadata({ params }: ErrorDetailProps): Promise<Metadata> {
  const { slug } = await params
  const errorData = await getErrorData(slug)
  
  if (!errorData) {
    return {
      title: 'Error Not Found - Kubernetes Error Intelligence',
      description: 'The requested Kubernetes error information could not be found.',
    }
  }

  const title = `${errorData.title} - Kubernetes Error Fix Guide`
  const description = `${errorData.summary.substring(0, 150)}... Learn causes, fixes, and examples for ${errorData.title} in Kubernetes.`

  return {
    title,
    description,
    keywords: [
      errorData.title,
      'Kubernetes',
      errorData.category,
      'error fix',
      'troubleshooting',
      'devops',
      ...errorData.aliases
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Kubernetes Error Intelligence',
      images: [{
        url: `/api/og/error/${errorData.canonical_slug}`,
        width: 1200,
        height: 630,
        alt: `${errorData.title} - Kubernetes Error Guide`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/error/${errorData.canonical_slug}`]
    },
    alternates: {
      canonical: `/errors/${errorData.canonical_slug}`
    }
  }
}

export default async function ErrorDetailPage({ params }: ErrorDetailProps) {
  const { slug } = await params
  const errorData = await getErrorData(slug)
  
  if (!errorData) {
    notFound()
  }

  const relatedErrors = await getRelatedErrors(errorData)

  const getCategoryColor = (category: string) => {
    const colors = {
      registry: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
      runtime: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
      scheduling: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
      config: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      storage: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
      network: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
      auth: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": errorData.title,
    "description": errorData.summary,
    "author": {
      "@type": "Organization",
      "name": "Kubernetes Error Intelligence"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Kubernetes Error Intelligence"
    },
    "datePublished": errorData.created_at,
    "dateModified": errorData.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/errors/${errorData.canonical_slug}`
    },
    "about": {
      "@type": "SoftwareApplication",
      "name": "Kubernetes"
    },
    "teaches": `How to fix ${errorData.title} in Kubernetes`,
    "educationalLevel": "Intermediate",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "/",
      "name": "Kubernetes Error Intelligence"
    }
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": errorData.root_causes?.slice(0, 3).map((cause: any) => ({
      "@type": "Question",
      "name": `What causes ${cause.name}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": cause.why
      }
    })) || []
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd)
        }}
      />
      
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/errors" className="hover:text-foreground">
            Errors
          </Link>
          <span>/</span>
          <span className="text-foreground">{errorData.title}</span>
        </nav>

        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">{errorData.title}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed max-w-4xl">
                {errorData.summary}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize font-mono">
                    {errorData.tool}
                  </Badge>
                  <Badge className={cn("capitalize", getCategoryColor(errorData.category))}>
                    {errorData.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <span>Last updated: {new Date(errorData.updated_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Official sources</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Navigation */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Documentation Sections</h2>
          <nav className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link 
              href={`/errors/${errorData.canonical_slug}/causes`}
              className="flex items-center gap-2 p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-medium text-sm">Root Causes</div>
                <div className="text-xs text-slate-500">
                  {errorData.root_causes?.length || 0} identified
                </div>
              </div>
            </Link>
            
            <Link 
              href={`/errors/${errorData.canonical_slug}/fixes`}
              className="flex items-center gap-2 p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Terminal className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium text-sm">Resolution Steps</div>
                <div className="text-xs text-slate-500">
                  {errorData.fix_steps?.length || 0} procedures
                </div>
              </div>
            </Link>
            
            <Link 
              href={`/errors/${errorData.canonical_slug}/examples`}
              className="flex items-center gap-2 p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Examples</div>
                <div className="text-xs text-slate-500">
                  {errorData.examples?.length || 0} scenarios
                </div>
              </div>
            </Link>
            
            <Link 
              href={`/errors/${errorData.canonical_slug}/related`}
              className="flex items-center gap-2 p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium text-sm">Related Issues</div>
                <div className="text-xs text-slate-500">
                  {relatedErrors.length} similar
                </div>
              </div>
            </Link>
          </nav>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Summary */}
            {errorData.aliases && errorData.aliases.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Alternative Names</h3>
                <div className="flex flex-wrap gap-2">
                  {errorData.aliases.map((alias: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-700">
                      {alias}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Fix */}
            {errorData.fix_steps && errorData.fix_steps.length > 0 && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Quick Resolution</h3>
                </div>
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">{errorData.fix_steps[0].step}</h4>
                {errorData.fix_steps[0].commands && errorData.fix_steps[0].commands.length > 0 && (
                  <div className="bg-slate-900 text-green-400 p-4 rounded-md mb-4 overflow-x-auto">
                    <code className="text-sm font-mono">
                      {errorData.fix_steps[0].commands[0]}
                    </code>
                  </div>
                )}
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                  <Link href={`/errors/${errorData.canonical_slug}/fixes`}>
                    View Complete Resolution Guide
                  </Link>
                </Button>
              </div>
            )}

            {/* Root Causes Preview */}
            {errorData.root_causes && errorData.root_causes.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Root Causes</h3>
                  <Button variant="outline" asChild>
                    <Link href={`/errors/${errorData.canonical_slug}/causes`}>
                      View Complete Analysis
                    </Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  {errorData.root_causes.slice(0, 3).map((cause: any, index: number) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-slate-900">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{cause.name}</h4>
                        <div className="flex items-center gap-1 text-xs">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            cause.confidence >= 0.8 ? "bg-green-500" : 
                            cause.confidence >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                          )} />
                          <span className="text-slate-500">{Math.round(cause.confidence * 100)}%</span>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{cause.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technical Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Technical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Applies to</span>
                  <Badge variant="outline" className="capitalize font-mono text-xs">
                    {errorData.tool}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Category</span>
                  <Badge className={cn("capitalize text-xs", getCategoryColor(errorData.category))}>
                    {errorData.category}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Identifier</span>
                  <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
                    {errorData.canonical_slug}
                  </code>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Last updated</span>
                  <span className="text-xs text-slate-500">
                    {new Date(errorData.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Documentation Reliability */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Documentation Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Sources</span>
                  <span className="text-xs font-medium text-green-600">Official</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Completeness</span>
                  <span className="text-xs font-medium text-green-600">100%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Verified</span>
                  <span className="text-xs font-medium text-green-600">Yes</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Documentation */}
            {relatedErrors.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Related Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedErrors.slice(0, 4).map((related: any, index: number) => (
                    <Link 
                      key={index}
                      href={`/errors/${related.canonical_slug}`} 
                      className="block p-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100 leading-tight">
                        {related.title.length > 40 ? related.title.substring(0, 40) + '...' : related.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {related.category} • {related.tool}
                      </div>
                    </Link>
                  ))}
                  <Button variant="outline" asChild className="w-full mt-3 text-xs">
                    <Link href={`/errors/${errorData.canonical_slug}/related`}>
                      View All Related Issues
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Export Options */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Export Documentation</CardTitle>
                  {!hasFeature("EXPORT_REPORTS") && <EnterpriseBadge size="sm" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  disabled={!hasFeature("EXPORT_REPORTS")}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export as PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  disabled={!hasFeature("EXPORT_REPORTS")}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export as Markdown
                </Button>
                {!hasFeature("EXPORT_REPORTS") && (
                  <p className="text-xs text-slate-500 text-center mt-2">
                    Available in Pro and Team plans
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Category Documentation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Browse Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full text-sm" variant="outline">
                  <Link href={`/kubernetes/errors/${errorData.category}`}>
                    All {errorData.category} documentation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

// Generate static paths for build optimization
export async function generateStaticParams() {
  try {
    const errors = await safeFindErrors()
    return errors.map(error => ({
      slug: error.canonical_slug
    }))
  } catch (error) {
    console.warn('Failed to generate static params:', error)
    return []
  }
}
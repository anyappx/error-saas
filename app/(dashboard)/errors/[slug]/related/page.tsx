import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { 
  ArrowLeft, 
  BarChart3,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Terminal,
  FileText,
  TrendingUp,
  ArrowRight,
  Search
} from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { cn } from "../../../../lib/utils"
import { safeFindErrorBySlug, safeFindErrors } from "../../../../lib/dbFallback"

interface RelatedPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getErrorData(slug: string) {
  return await safeFindErrorBySlug('kubernetes', slug)
}

async function getRelatedErrors(currentError: any, limit = 10) {
  const allErrors = await safeFindErrors()
  
  // Find related errors by category, tool, and similar keywords
  return allErrors
    .filter(error => error.canonical_slug !== currentError.canonical_slug)
    .map(error => {
      let score = 0
      
      // Same category gets high score
      if (error.category === currentError.category) score += 50
      
      // Same tool gets medium score
      if (error.tool === currentError.tool) score += 30
      
      // Similar title keywords
      const currentKeywords = currentError.title.toLowerCase().split(' ')
      const errorKeywords = error.title.toLowerCase().split(' ')
      const commonKeywords = currentKeywords.filter((keyword: string) => 
        errorKeywords.includes(keyword) && keyword.length > 3
      )
      score += commonKeywords.length * 15
      
      // Shared aliases
      const sharedAliases = currentError.aliases?.filter((alias: string) => 
        error.aliases?.includes(alias)
      ) || []
      score += sharedAliases.length * 20
      
      return { ...error, similarityScore: score }
    })
    .filter(error => error.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
}

export async function generateMetadata({ params }: RelatedPageProps): Promise<Metadata> {
  const { slug } = await params
  const errorData = await getErrorData(slug)
  
  if (!errorData) {
    return {
      title: 'Error Not Found - Kubernetes Error Intelligence',
      description: 'The requested Kubernetes error information could not be found.',
    }
  }

  const title = `${errorData.title} Related Errors - Kubernetes Error Patterns`
  const description = `Discover errors related to ${errorData.title} in Kubernetes. Similar patterns, common co-occurrences, and related troubleshooting paths.`

  return {
    title,
    description,
    keywords: [
      errorData.title,
      'related errors',
      'Kubernetes patterns',
      errorData.category,
      'error correlation',
      'similar issues',
      'troubleshooting',
      ...errorData.aliases
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Kubernetes Error Intelligence',
      images: [{
        url: `/api/og/error/${errorData.canonical_slug}/related`,
        width: 1200,
        height: 630,
        alt: `${errorData.title} Related Errors and Patterns`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/error/${errorData.canonical_slug}/related`]
    },
    alternates: {
      canonical: `/errors/${errorData.canonical_slug}/related`
    }
  }
}

export default async function RelatedPage({ params }: RelatedPageProps) {
  const { slug } = await params
  const errorData = await getErrorData(slug)
  
  if (!errorData) {
    notFound()
  }

  const relatedErrors = await getRelatedErrors(errorData, 15)
  
  // Group related errors by relationship type
  const sameCategoryErrors = relatedErrors.filter(error => 
    error.category === errorData.category
  )
  
  const sameToolErrors = relatedErrors.filter(error => 
    error.tool === errorData.tool && error.category !== errorData.category
  )
  
  const similarTitleErrors = relatedErrors.filter(error => 
    error.category !== errorData.category && 
    error.tool !== errorData.tool &&
    error.similarityScore >= 15
  )

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

  const getSimilarityColor = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
    if (score >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
    return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
  }

  const RelatedErrorCard = ({ error, relationship }: { error: any, relationship: string }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-sm mb-2">{error.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {error.summary.substring(0, 120)}...
            </p>
          </div>
          <Badge className={cn("ml-2 text-xs", getSimilarityColor(error.similarityScore))}>
            {error.similarityScore}%
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {error.tool}
            </Badge>
            <Badge className={cn("text-xs capitalize", getCategoryColor(error.category))}>
              {error.category}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/errors/${error.canonical_slug}`}>
              <Eye className="h-3 w-3" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          Related by: {relationship}
        </div>
      </CardContent>
    </Card>
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${errorData.title} - Related Errors and Patterns`,
    "description": `Analysis of errors related to ${errorData.title} in Kubernetes environments.`,
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
      "@id": `/errors/${errorData.canonical_slug}/related`
    },
    "about": {
      "@type": "SoftwareApplication",
      "name": "Kubernetes"
    },
    "teaches": `Related error patterns for ${errorData.title}`,
    "educationalLevel": "Intermediate",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "/",
      "name": "Kubernetes Error Intelligence"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
      
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/errors" className="hover:text-foreground">
            Errors
          </Link>
          <span>/</span>
          <Link href={`/errors/${errorData.canonical_slug}`} className="hover:text-foreground">
            {errorData.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">Related</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/errors/${errorData.canonical_slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Overview
                </Link>
              </Button>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Related Errors</h1>
              <h2 className="text-xl text-muted-foreground mt-2">{errorData.title}</h2>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="capitalize">
                  {errorData.tool}
                </Badge>
                <Badge className={cn("capitalize", getCategoryColor(errorData.category))}>
                  {errorData.category}
                </Badge>
                <Badge variant="outline">
                  {relatedErrors.length} related found
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Page Navigation */}
        <Card>
          <CardContent className="pt-6">
            <nav className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href={`/errors/${errorData.canonical_slug}`}
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Overview</div>
                  <div className="text-xs text-muted-foreground">Error summary</div>
                </div>
              </Link>
              
              <Link 
                href={`/errors/${errorData.canonical_slug}/causes`}
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">Root Causes</div>
                  <div className="text-xs text-muted-foreground">
                    {errorData.root_causes?.length || 0} causes
                  </div>
                </div>
              </Link>
              
              <Link 
                href={`/errors/${errorData.canonical_slug}/fixes`}
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Terminal className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Fix Steps</div>
                  <div className="text-xs text-muted-foreground">
                    {errorData.fix_steps?.length || 0} steps
                  </div>
                </div>
              </Link>
              
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-accent">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">Related</div>
                  <div className="text-xs text-muted-foreground">Current page</div>
                </div>
              </div>
            </nav>
          </CardContent>
        </Card>

        {/* Related Errors */}
        <div className="space-y-6">
          {relatedErrors.length > 0 ? (
            <>
              {/* Same Category Errors */}
              {sameCategoryErrors.length > 0 && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Same Category ({errorData.category})
                      </CardTitle>
                      <CardDescription>
                        {sameCategoryErrors.length} other {errorData.category} errors that might occur in similar contexts
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sameCategoryErrors.slice(0, 6).map((error, index) => (
                      <RelatedErrorCard 
                        key={index} 
                        error={error} 
                        relationship="Same category"
                      />
                    ))}
                  </div>
                  
                  {sameCategoryErrors.length > 6 && (
                    <div className="text-center">
                      <Button variant="outline" asChild>
                        <Link href={`/errors?category=${errorData.category}`}>
                          <Search className="h-4 w-4 mr-2" />
                          View All {errorData.category} Errors
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Same Tool Errors */}
              {sameToolErrors.length > 0 && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="h-5 w-5" />
                        Same Tool ({errorData.tool})
                      </CardTitle>
                      <CardDescription>
                        {sameToolErrors.length} other {errorData.tool} errors across different categories
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sameToolErrors.slice(0, 6).map((error, index) => (
                      <RelatedErrorCard 
                        key={index} 
                        error={error} 
                        relationship="Same tool"
                      />
                    ))}
                  </div>
                  
                  {sameToolErrors.length > 6 && (
                    <div className="text-center">
                      <Button variant="outline" asChild>
                        <Link href={`/errors?tool=${errorData.tool}`}>
                          <Search className="h-4 w-4 mr-2" />
                          View All {errorData.tool} Errors
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Similar Patterns */}
              {similarTitleErrors.length > 0 && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Similar Patterns
                      </CardTitle>
                      <CardDescription>
                        {similarTitleErrors.length} errors with similar keywords or patterns
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {similarTitleErrors.slice(0, 6).map((error, index) => (
                      <RelatedErrorCard 
                        key={index} 
                        error={error} 
                        relationship="Similar pattern"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Top Related Summary */}
              <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                    <BarChart3 className="h-5 w-5" />
                    Error Pattern Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                        {sameCategoryErrors.length}
                      </div>
                      <div className="text-purple-600 dark:text-purple-400">
                        Same Category
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                        {sameToolErrors.length}
                      </div>
                      <div className="text-purple-600 dark:text-purple-400">
                        Same Tool
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                        {similarTitleErrors.length}
                      </div>
                      <div className="text-purple-600 dark:text-purple-400">
                        Similar Patterns
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      Understanding related errors helps identify common root causes and prevents cascading failures in your Kubernetes environment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Related Errors Found</h3>
                <p className="text-muted-foreground max-w-md">
                  No closely related errors were found for this specific error pattern. 
                  This might indicate a unique or uncommon issue.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/errors">
                    <Search className="h-4 w-4 mr-2" />
                    Browse All Errors
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Investigation</CardTitle>
            <CardDescription>
              Get the full picture of this error with detailed analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" asChild className="h-auto p-4 justify-start">
                <Link href={`/errors/${errorData.canonical_slug}/causes`}>
                  <div className="text-left">
                    <div className="font-medium">Root Causes</div>
                    <div className="text-xs text-muted-foreground">
                      Why this error occurs
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild className="h-auto p-4 justify-start">
                <Link href={`/errors/${errorData.canonical_slug}/fixes`}>
                  <div className="text-left">
                    <div className="font-medium">Fix Steps</div>
                    <div className="text-xs opacity-80">
                      {errorData.fix_steps?.length || 0} resolution steps
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4 justify-start">
                <Link href={`/errors/${errorData.canonical_slug}/examples`}>
                  <div className="text-left">
                    <div className="font-medium">Examples</div>
                    <div className="text-xs text-muted-foreground">
                      {errorData.examples?.length || 0} real-world scenarios
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  try {
    const { safeFindErrors } = await import('../../../../../lib/dbFallback')
    const errors = await safeFindErrors()
    return errors.map(error => ({
      slug: error.canonical_slug
    }))
  } catch (error) {
    console.warn('Failed to generate static params for related:', error)
    return []
  }
}
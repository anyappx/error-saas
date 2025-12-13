import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { 
  ArrowLeft, 
  AlertTriangle,
  ExternalLink,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Info,
  BookOpen
} from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Separator } from "../../../../components/ui/separator"
import { cn } from "../../../../lib/utils"
import { safeFindErrorBySlug } from "../../../../lib/dbFallback"

interface CausesPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getErrorData(slug: string) {
  return await safeFindErrorBySlug('kubernetes', slug)
}

export async function generateMetadata({ params }: CausesPageProps): Promise<Metadata> {
  const { slug } = await params
  const errorData = await getErrorData(slug)
  
  if (!errorData) {
    return {
      title: 'Error Not Found - Kubernetes Error Intelligence',
      description: 'The requested Kubernetes error information could not be found.',
    }
  }

  const title = `${errorData.title} Root Causes - Kubernetes Troubleshooting`
  const description = `Discover the root causes of ${errorData.title} in Kubernetes. Analysis of ${errorData.root_causes?.length || 0} potential causes with confidence levels and resolution paths.`

  return {
    title,
    description,
    keywords: [
      errorData.title,
      'root causes',
      'Kubernetes troubleshooting',
      errorData.category,
      'error analysis',
      'debugging',
      ...errorData.aliases
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Kubernetes Error Intelligence',
      images: [{
        url: `/api/og/error/${errorData.canonical_slug}/causes`,
        width: 1200,
        height: 630,
        alt: `${errorData.title} Root Causes Analysis`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/error/${errorData.canonical_slug}/causes`]
    },
    alternates: {
      canonical: `/errors/${errorData.canonical_slug}/causes`
    }
  }
}

export default async function CausesPage({ params }: CausesPageProps) {
  const { slug } = await params
  const errorData = await getErrorData(slug)
  
  if (!errorData) {
    notFound()
  }

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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-300"
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-300"
    return "text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-300"
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return CheckCircle2
    if (confidence >= 0.6) return AlertTriangle
    return XCircle
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${errorData.title} - Root Causes Analysis`,
    "description": `Complete analysis of root causes for ${errorData.title} in Kubernetes environments.`,
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
      "@id": `/errors/${errorData.canonical_slug}/causes`
    },
    "about": {
      "@type": "SoftwareApplication",
      "name": "Kubernetes"
    },
    "teaches": `Root cause analysis for ${errorData.title}`,
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
          <span className="text-foreground">Root Causes</span>
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
              <h1 className="text-4xl font-bold tracking-tight">Root Causes Analysis</h1>
              <h2 className="text-xl text-muted-foreground mt-2">{errorData.title}</h2>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="capitalize">
                  {errorData.tool}
                </Badge>
                <Badge className={cn("capitalize", getCategoryColor(errorData.category))}>
                  {errorData.category}
                </Badge>
                <Badge variant="outline">
                  {errorData.root_causes?.length || 0} causes identified
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
              
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-accent">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">Root Causes</div>
                  <div className="text-xs text-muted-foreground">Current page</div>
                </div>
              </div>
              
              <Link 
                href={`/errors/${errorData.canonical_slug}/fixes`}
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Fix Steps</div>
                  <div className="text-xs text-muted-foreground">
                    {errorData.fix_steps?.length || 0} steps
                  </div>
                </div>
              </Link>
              
              <Link 
                href={`/errors/${errorData.canonical_slug}/examples`}
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Examples</div>
                  <div className="text-xs text-muted-foreground">
                    {errorData.examples?.length || 0} scenarios
                  </div>
                </div>
              </Link>
            </nav>
          </CardContent>
        </Card>

        {/* Root Causes */}
        <div className="space-y-6">
          {errorData.root_causes && errorData.root_causes.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Identified Root Causes
                  </CardTitle>
                  <CardDescription>
                    Analysis of {errorData.root_causes.length} potential root causes for this error, 
                    ranked by confidence level and frequency of occurrence.
                  </CardDescription>
                </CardHeader>
              </Card>

              {errorData.root_causes
                .sort((a: any, b: any) => b.confidence - a.confidence)
                .map((cause: any, index: number) => {
                  const ConfidenceIcon = getConfidenceIcon(cause.confidence)
                  return (
                    <Card key={index} className="relative">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{cause.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={cn("text-xs", getConfidenceColor(cause.confidence))}>
                                  <ConfidenceIcon className="h-3 w-3 mr-1" />
                                  {Math.round(cause.confidence * 100)}% confidence
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Why This Happens</h4>
                          <p className="text-muted-foreground leading-relaxed">{cause.why}</p>
                        </div>

                        {cause.sources && cause.sources.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">References</h4>
                            <div className="space-y-2">
                              {cause.sources.map((source: any, sourceIndex: number) => (
                                <Button
                                  key={sourceIndex}
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="h-auto p-2 justify-start"
                                >
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-left"
                                  >
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                    <span className="text-sm">{source.label}</span>
                                  </a>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Root Causes Available</h3>
                <p className="text-muted-foreground max-w-md">
                  Root cause analysis for this error is not yet available. 
                  Check back later or contribute your findings.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href={`/errors/${errorData.canonical_slug}/fixes`}>
                    View Available Fixes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Your Investigation</CardTitle>
            <CardDescription>
              Explore other aspects of this error to get a complete understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 justify-start">
                <Link href={`/errors/${errorData.canonical_slug}/fixes`}>
                  <div className="text-left">
                    <div className="font-medium">View Fix Steps</div>
                    <div className="text-xs opacity-80">
                      {errorData.fix_steps?.length || 0} resolution steps
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4 justify-start">
                <Link href={`/errors/${errorData.canonical_slug}/examples`}>
                  <div className="text-left">
                    <div className="font-medium">See Examples</div>
                    <div className="text-xs text-muted-foreground">
                      {errorData.examples?.length || 0} real-world scenarios
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4 justify-start">
                <Link href={`/errors/${errorData.canonical_slug}/related`}>
                  <div className="text-left">
                    <div className="font-medium">Related Errors</div>
                    <div className="text-xs text-muted-foreground">
                      Similar issues and patterns
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
    console.warn('Failed to generate static params for causes:', error)
    return []
  }
}
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { 
  ExternalLink, 
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Database,
  Clock,
  Shield,
  Copy,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { safeFindErrorBySlug, safeFindErrors } from "@/lib/dbFallback"
import { DocLayout } from "@/components/layout/doc-layout"

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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-emerald-600"
    if (confidence >= 0.6) return "text-amber-600"
    return "text-slate-500"
  }
  
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return "High"
    if (confidence >= 0.6) return "Medium"
    return "Low"
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
      
      <DocLayout>
        <div className="space-y-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
            <Link href="/dashboard" className="hover:text-indigo-600">
              Overview
            </Link>
            <span>/</span>
            <Link href="/errors" className="hover:text-indigo-600">
              Errors
            </Link>
            <span>/</span>
            <span className="text-slate-900">{errorData.title}</span>
          </nav>

          {/* Header */}
          <div className="space-y-4 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="text-xs">
                {errorData.tool}
              </Badge>
              <Badge variant="secondary" className="text-xs capitalize">
                {errorData.category}
              </Badge>
              <Badge className="text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 leading-tight">{errorData.title}</h1>
            <p className="text-slate-600 text-base leading-relaxed max-w-4xl">
              {errorData.summary}
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Updated {new Date(errorData.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                <span>Official documentation</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">What this error means</h2>
                <p className="text-slate-600">
                  This section explains the technical details and context of this Kubernetes error.
                </p>
              </div>
              {/* Alternative Names */}
              {errorData.aliases && errorData.aliases.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-slate-900 mb-3">Also known as:</h3>
                    <div className="flex flex-wrap gap-2">
                      {errorData.aliases.map((alias: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {alias}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Common Causes */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-slate-900">Common causes</h2>
                  <p className="text-slate-600">
                    Ranked by likelihood and confidence based on real-world scenarios.
                  </p>
                </div>
                {errorData.root_causes && errorData.root_causes.length > 0 ? (
                  <div className="space-y-4">
                    {errorData.root_causes.map((cause: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="space-y-1 flex-1">
                              <h3 className="font-medium text-slate-900">{index + 1}. {cause.name}</h3>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs", getConfidenceColor(cause.confidence))}
                                >
                                  {getConfidenceBadge(cause.confidence)} confidence
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {Math.round(cause.confidence * 100)}% likelihood
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{cause.why}</p>
                          {cause.sources && cause.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <div className="flex flex-wrap gap-2">
                                {cause.sources.map((source: any, sourceIndex: number) => (
                                  <Link 
                                    key={sourceIndex}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                                  >
                                    {source.label}
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-slate-500 text-center py-4">
                        No documented causes available for this error yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Step-by-step fixes */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-slate-900">Step-by-step fixes</h2>
                  <p className="text-slate-600">
                    Follow these procedures in order to resolve the issue.
                  </p>
                </div>
                {errorData.fix_steps && errorData.fix_steps.length > 0 ? (
                  <div className="space-y-4">
                    {errorData.fix_steps.map((step: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
                                {index + 1}
                              </div>
                              <div className="space-y-2 flex-1">
                                <h3 className="font-medium text-slate-900">{step.step}</h3>
                                {step.commands && step.commands.length > 0 && (
                                  <div className="space-y-2">
                                    {step.commands.map((command: string, cmdIndex: number) => (
                                      <div key={cmdIndex} className="relative">
                                        <pre className="bg-slate-900 text-slate-100 p-3 rounded-md overflow-x-auto text-sm font-mono">
                                          <code>{command}</code>
                                        </pre>
                                        <span className="absolute top-2 right-2 p-1 rounded text-slate-400 cursor-pointer" title="Copy to clipboard">
                                          <Copy className="h-3 w-3" />
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {step.sources && step.sources.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {step.sources.map((source: any, sourceIndex: number) => (
                                      <Link 
                                        key={sourceIndex}
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                                      >
                                        {source.label}
                                        <ExternalLink className="h-3 w-3" />
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-slate-500 text-center py-4">
                        No documented fix steps available for this error yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              {/* Examples */}
              {errorData.examples && errorData.examples.length > 0 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900">Examples</h2>
                    <p className="text-slate-600">
                      Real-world scenarios and their solutions.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {errorData.examples.map((example: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <h3 className="font-medium text-slate-900">{example.name}</h3>
                            <div className="space-y-2">
                              <div>
                                <h4 className="text-sm font-medium text-slate-700">Symptom:</h4>
                                <p className="text-sm text-slate-600">{example.symptom}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-slate-700">Solution:</h4>
                                <p className="text-sm text-slate-600">{example.fix}</p>
                              </div>
                            </div>
                            {example.sources && example.sources.length > 0 && (
                              <div className="pt-2 border-t border-slate-100">
                                <div className="flex flex-wrap gap-2">
                                  {example.sources.map((source: any, sourceIndex: number) => (
                                    <Link 
                                      key={sourceIndex}
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                                    >
                                      {source.label}
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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
                  <CardTitle className="text-base font-medium">Error Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Category</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {errorData.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tool</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {errorData.tool}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Confidence</span>
                    <Badge className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      High
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Last updated</span>
                    <span className="text-xs text-slate-900">
                      {new Date(errorData.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Official Sources */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Official Sources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {errorData.root_causes?.[0]?.sources?.length > 0 ? (
                    errorData.root_causes[0].sources.map((source: any, index: number) => (
                      <Link
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-sm text-slate-900 group-hover:text-indigo-600">
                          {source.label}
                        </span>
                        <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-600" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No external sources available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Related Errors */}
              {relatedErrors.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Related Errors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {relatedErrors.slice(0, 3).map((related: any, index: number) => (
                      <Link 
                        key={index}
                        href={`/errors/${related.canonical_slug}`} 
                        className="block p-3 rounded border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 leading-tight mb-1">
                          {related.title.length > 35 ? related.title.substring(0, 35) + '...' : related.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {related.category} • {related.tool}
                        </div>
                      </Link>
                    ))}
                    {relatedErrors.length > 3 && (
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View {relatedErrors.length - 3} more
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs justify-start">
                    <Link href={`/errors?category=${errorData.category}`}>
                      Browse {errorData.category} errors
                    </Link>
                  </Button>
                  <span className="w-full text-xs justify-start border border-slate-200 rounded px-3 py-2 text-center text-slate-600 cursor-not-allowed block">
                    Share this page
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DocLayout>
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
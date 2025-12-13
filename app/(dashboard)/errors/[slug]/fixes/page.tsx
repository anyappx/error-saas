import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { 
  ArrowLeft, 
  Terminal,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Code,
  Play,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { safeFindErrorBySlug } from "@/lib/dbFallback"

interface FixesPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getErrorData(slug: string) {
  return await safeFindErrorBySlug('kubernetes', slug)
}

export async function generateMetadata({ params }: FixesPageProps): Promise<Metadata> {
  const { slug } = await params
  const errorData = await getErrorData(slug)
  
  if (!errorData) {
    return {
      title: 'Error Not Found - Kubernetes Error Intelligence',
      description: 'The requested Kubernetes error information could not be found.',
    }
  }

  const title = `${errorData.title} Fix Steps - Kubernetes Error Resolution`
  const description = `Step-by-step guide to fix ${errorData.title} in Kubernetes. ${errorData.fix_steps?.length || 0} proven resolution steps with commands and examples.`

  return {
    title,
    description,
    keywords: [
      errorData.title,
      'fix steps',
      'Kubernetes resolution',
      errorData.category,
      'error fix',
      'troubleshooting guide',
      'kubectl commands',
      ...errorData.aliases
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Kubernetes Error Intelligence',
      images: [{
        url: `/api/og/error/${errorData.canonical_slug}/fixes`,
        width: 1200,
        height: 630,
        alt: `${errorData.title} Fix Steps Guide`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/error/${errorData.canonical_slug}/fixes`]
    },
    alternates: {
      canonical: `/errors/${errorData.canonical_slug}/fixes`
    }
  }
}

export default async function FixesPage({ params }: FixesPageProps) {
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


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to fix ${errorData.title} in Kubernetes`,
    "description": `Step-by-step guide to resolve ${errorData.title} error in Kubernetes environments.`,
    "totalTime": "PT15M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "kubectl access"
      },
      {
        "@type": "HowToSupply", 
        "name": "Kubernetes cluster"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "kubectl"
      }
    ],
    "step": errorData.fix_steps?.map((step: any, index: number) => ({
      "@type": "HowToStep",
      "name": step.step,
      "position": index + 1,
      "text": step.step,
      "url": `/errors/${errorData.canonical_slug}/fixes#step-${index + 1}`
    })) || [],
    "author": {
      "@type": "Organization",
      "name": "Kubernetes Error Intelligence"
    },
    "datePublished": errorData.created_at,
    "dateModified": errorData.updated_at
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
          <span className="text-foreground">Fix Steps</span>
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
              <h1 className="text-4xl font-bold tracking-tight">Fix Steps</h1>
              <h2 className="text-xl text-muted-foreground mt-2">{errorData.title}</h2>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="capitalize">
                  {errorData.tool}
                </Badge>
                <Badge className={cn("capitalize", getCategoryColor(errorData.category))}>
                  {errorData.category}
                </Badge>
                <Badge variant="outline">
                  {errorData.fix_steps?.length || 0} steps
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
              
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-accent">
                <Terminal className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Fix Steps</div>
                  <div className="text-xs text-muted-foreground">Current page</div>
                </div>
              </div>
              
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

        {/* Fix Steps */}
        <div className="space-y-6">
          {errorData.fix_steps && errorData.fix_steps.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Resolution Steps
                  </CardTitle>
                  <CardDescription>
                    Follow these {errorData.fix_steps.length} steps to resolve the {errorData.title} error. 
                    Steps are ordered by effectiveness and ease of implementation.
                  </CardDescription>
                </CardHeader>
              </Card>

              {errorData.fix_steps.map((step: any, index: number) => (
                <Card key={index} id={`step-${index + 1}`} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{step.step}</CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {step.commands && step.commands.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Commands to Run
                        </h4>
                        {step.commands.map((command: string, cmdIndex: number) => (
                          <div key={cmdIndex} className="bg-muted rounded-lg p-4">
                            <code className="text-sm font-mono block break-all">
                              {command}
                            </code>
                          </div>
                        ))}
                      </div>
                    )}

                    {step.sources && step.sources.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">References</h4>
                        <div className="space-y-2">
                          {step.sources.map((source: any, sourceIndex: number) => (
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
              ))}

              {/* Verification Step */}
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                    <CheckCircle2 className="h-5 w-5" />
                    Verify the Fix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    After completing the fix steps above, verify that the error has been resolved:
                  </p>
                  <div className="space-y-2">
                    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                      <code className="text-sm font-mono text-green-800 dark:text-green-200">
                        kubectl get pods --all-namespaces
                      </code>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                      <code className="text-sm font-mono text-green-800 dark:text-green-200">
                        kubectl describe pod [pod-name] -n [namespace]
                      </code>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-3">
                    Check that pods are running successfully and no error events are reported.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Fix Steps Available</h3>
                <p className="text-muted-foreground max-w-md">
                  Detailed fix steps for this error are not yet available. 
                  Check the root causes for manual troubleshooting guidance.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href={`/errors/${errorData.canonical_slug}/causes`}>
                    View Root Causes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Your Investigation</CardTitle>
            <CardDescription>
              Understand the full context of this error with additional resources
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
                <Link href={`/errors/${errorData.canonical_slug}/examples`}>
                  <div className="text-left">
                    <div className="font-medium">See Examples</div>
                    <div className="text-xs opacity-80">
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
    console.warn('Failed to generate static params for fixes:', error)
    return []
  }
}
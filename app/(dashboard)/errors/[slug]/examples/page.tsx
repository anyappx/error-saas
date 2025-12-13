import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { 
  ArrowLeft, 
  FileText,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Code2,
  Play,
  Terminal,
  Lightbulb
} from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { cn } from "../../../../lib/utils"
import { safeFindErrorBySlug } from "../../../../lib/dbFallback"

interface ExamplesPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getErrorData(slug: string) {
  return await safeFindErrorBySlug('kubernetes', slug)
}

export async function generateMetadata({ params }: ExamplesPageProps): Promise<Metadata> {
  const { slug } = await params
  const errorData = await getErrorData(slug)
  
  if (!errorData) {
    return {
      title: 'Error Not Found - Kubernetes Error Intelligence',
      description: 'The requested Kubernetes error information could not be found.',
    }
  }

  const title = `${errorData.title} Examples - Kubernetes Error Scenarios`
  const description = `Real-world examples of ${errorData.title} in Kubernetes. ${errorData.examples?.length || 0} practical scenarios with symptoms and solutions.`

  return {
    title,
    description,
    keywords: [
      errorData.title,
      'examples',
      'Kubernetes scenarios',
      errorData.category,
      'error examples',
      'case studies',
      'real world',
      ...errorData.aliases
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Kubernetes Error Intelligence',
      images: [{
        url: `/api/og/error/${errorData.canonical_slug}/examples`,
        width: 1200,
        height: 630,
        alt: `${errorData.title} Examples and Case Studies`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/error/${errorData.canonical_slug}/examples`]
    },
    alternates: {
      canonical: `/errors/${errorData.canonical_slug}/examples`
    }
  }
}

export default async function ExamplesPage({ params }: ExamplesPageProps) {
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
    "@type": "TechArticle",
    "headline": `${errorData.title} - Examples and Case Studies`,
    "description": `Real-world examples and scenarios of ${errorData.title} in Kubernetes environments.`,
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
      "@id": `/errors/${errorData.canonical_slug}/examples`
    },
    "about": {
      "@type": "SoftwareApplication",
      "name": "Kubernetes"
    },
    "teaches": `Examples and case studies for ${errorData.title}`,
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
          <span className="text-foreground">Examples</span>
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
              <h1 className="text-4xl font-bold tracking-tight">Real-World Examples</h1>
              <h2 className="text-xl text-muted-foreground mt-2">{errorData.title}</h2>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="capitalize">
                  {errorData.tool}
                </Badge>
                <Badge className={cn("capitalize", getCategoryColor(errorData.category))}>
                  {errorData.category}
                </Badge>
                <Badge variant="outline">
                  {errorData.examples?.length || 0} scenarios
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
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Examples</div>
                  <div className="text-xs text-muted-foreground">Current page</div>
                </div>
              </div>
            </nav>
          </CardContent>
        </Card>

        {/* Examples */}
        <div className="space-y-6">
          {errorData.examples && errorData.examples.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Case Studies & Scenarios
                  </CardTitle>
                  <CardDescription>
                    {errorData.examples.length} real-world examples of {errorData.title} 
                    with detailed symptoms, context, and resolution strategies.
                  </CardDescription>
                </CardHeader>
              </Card>

              {errorData.examples.map((example: any, index: number) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{example.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Case Study
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Symptom Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <h4 className="font-medium">Symptoms</h4>
                      </div>
                      <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950 p-4 rounded-r-lg">
                        <h5 className="font-medium text-red-800 dark:text-red-300 mb-2">
                          What You'll See
                        </h5>
                        <p className="text-red-700 dark:text-red-300 leading-relaxed">
                          {example.symptom}
                        </p>
                      </div>
                    </div>
                    
                    {/* Solution Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium">Solution</h4>
                      </div>
                      <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950 p-4 rounded-r-lg">
                        <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">
                          Resolution Approach
                        </h5>
                        <p className="text-green-700 dark:text-green-300 leading-relaxed">
                          {example.fix}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button asChild size="sm">
                          <Link href={`/errors/${errorData.canonical_slug}/fixes`}>
                            <Terminal className="h-3 w-3 mr-1" />
                            View Detailed Steps
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/errors/${errorData.canonical_slug}/causes`}>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Root Cause Analysis
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Resources Section */}
                    {example.sources && example.sources.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <h4 className="font-medium">References</h4>
                        </div>
                        <div className="grid gap-2">
                          {example.sources.map((source: any, sourceIndex: number) => (
                            <Button
                              key={sourceIndex}
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-auto p-3 justify-start"
                            >
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-left"
                              >
                                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">{source.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new URL(source.url).hostname}
                                  </div>
                                </div>
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Quick Actions */}
              <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                    <Lightbulb className="h-5 w-5" />
                    Learn From These Examples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 dark:text-blue-300 mb-4">
                    Use these real-world scenarios to better understand how {errorData.title} manifests 
                    in different environments and contexts.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" asChild className="justify-start">
                      <Link href={`/errors/${errorData.canonical_slug}/causes`}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Understand Root Causes
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="justify-start">
                      <Link href={`/errors/${errorData.canonical_slug}/fixes`}>
                        <Terminal className="h-4 w-4 mr-2" />
                        Apply Fix Steps
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Examples Available</h3>
                <p className="text-muted-foreground max-w-md">
                  Real-world examples for this error are not yet available. 
                  Check the fix steps and root causes for troubleshooting guidance.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" asChild>
                    <Link href={`/errors/${errorData.canonical_slug}/causes`}>
                      View Root Causes
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/errors/${errorData.canonical_slug}/fixes`}>
                      View Fix Steps
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>
              Dive deeper into understanding and resolving this error
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
    console.warn('Failed to generate static params for examples:', error)
    return []
  }
}
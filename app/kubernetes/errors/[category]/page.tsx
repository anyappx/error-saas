import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { 
  Shield,
  Network,
  Database,
  Settings,
  Clock,
  Container,
  Server,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  ChevronRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { safeFindErrors } from "@/lib/dbFallback"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

const categoryMeta = {
  auth: {
    title: "Authentication Errors",
    description: "Kubernetes authentication and authorization errors",
    icon: Shield,
    color: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
  },
  network: {
    title: "Network Errors", 
    description: "Networking, connectivity, and communication errors",
    icon: Network,
    color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
  },
  storage: {
    title: "Storage Errors",
    description: "Persistent volumes, storage classes, and disk errors", 
    icon: Database,
    color: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
  },
  config: {
    title: "Configuration Errors",
    description: "ConfigMaps, Secrets, and configuration management errors",
    icon: Settings, 
    color: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800"
  },
  scheduling: {
    title: "Scheduling Errors",
    description: "Pod scheduling, resource allocation, and placement errors",
    icon: Clock,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800"
  },
  registry: {
    title: "Registry Errors",
    description: "Container image pulling and registry authentication errors",
    icon: Container,
    color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
  },
  runtime: {
    title: "Runtime Errors", 
    description: "Container runtime, CRI, and execution errors",
    icon: AlertTriangle,
    color: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
  },
  cluster: {
    title: "Cluster Errors",
    description: "Cluster-wide issues, node problems, and infrastructure errors",
    icon: Server,
    color: "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
  }
}

async function getCategoryErrors(category: string) {
  const allErrors = await safeFindErrors()
  return allErrors.filter(error => error.category === category)
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const meta = categoryMeta[category as keyof typeof categoryMeta]
  
  if (!meta) {
    return {
      title: 'Category Not Found - Kubernetes Error Documentation'
    }
  }

  return {
    title: `${meta.title} - Kubernetes Documentation`,
    description: meta.description + ". Complete troubleshooting guide with causes, fixes, and examples.",
    keywords: [
      category,
      'kubernetes',
      meta.title.toLowerCase(),
      'troubleshooting',
      'documentation'
    ]
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const meta = categoryMeta[category as keyof typeof categoryMeta]
  
  if (!meta) {
    notFound()
  }

  const errors = await getCategoryErrors(category)
  const Icon = meta.icon

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
          <Link href="/errors" className="hover:text-slate-700 dark:hover:text-slate-300">
            Documentation
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 dark:text-slate-100">{meta.title}</span>
        </nav>
        
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-lg border", meta.color)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {meta.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
              {meta.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>{errors.length} documented errors</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errors.length}</div>
            <p className="text-xs text-slate-500 mt-1">Documented issues</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-slate-500 mt-1">Resolution paths</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Official</div>
            <p className="text-xs text-slate-500 mt-1">Kubernetes docs</p>
          </CardContent>
        </Card>
      </div>

      {/* Error List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Error Reference
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/errors?category=${category}`}>
              View in Error Explorer
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {errors.map((error, index) => (
            <Card key={error.canonical_slug} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border text-slate-600 dark:text-slate-400">
                        #{(index + 1).toString().padStart(2, '0')}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {error.title}
                      </h3>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {error.summary}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {error.tool}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{error.root_causes?.length || 0} causes</span>
                        <span>•</span>
                        <span>{error.fix_steps?.length || 0} fixes</span>
                        <span>•</span>
                        <span>{error.examples?.length || 0} examples</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <Link href={`/errors/${error.canonical_slug}`}>
                          <BookOpen className="h-3 w-3 mr-1" />
                          View Documentation
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/errors/${error.canonical_slug}/fixes`}>
                          Quick Fix
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/errors/${error.canonical_slug}/causes`}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Causes
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/errors/${error.canonical_slug}/examples`}>
                        <BookOpen className="h-3 w-3 mr-1" />
                        Examples
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Related Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Related Documentation</CardTitle>
          <CardDescription>
            Explore other error categories that might be relevant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categoryMeta)
              .filter(([key]) => key !== category)
              .slice(0, 6)
              .map(([key, relatedMeta]) => {
                const RelatedIcon = relatedMeta.icon
                return (
                  <Button
                    key={key}
                    variant="outline"
                    asChild
                    className="h-auto p-3 justify-start"
                  >
                    <Link href={`/kubernetes/errors/${key}`}>
                      <RelatedIcon className={cn("h-4 w-4 mr-2", relatedMeta.color.split(' ')[0])} />
                      <div className="text-left">
                        <div className="font-medium text-sm">{relatedMeta.title}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {relatedMeta.description.split('.')[0]}
                        </div>
                      </div>
                    </Link>
                  </Button>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(categoryMeta).map(category => ({
    category
  }))
}
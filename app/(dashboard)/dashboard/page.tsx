"use client"

import * as React from "react"
import Link from "next/link"
import { 
  AlertTriangle, 
  Database,
  ExternalLink,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Network,
  Activity,
  Settings,
  HardDrive,
  Grid,
  Server
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DocLayout } from "@/components/layout/doc-layout"

interface SearchResult {
  error: {
    tool: string
    canonical_slug: string
    title: string
    category: string
    summary: string
    created_at: string
    updated_at: string
  }
  score: number
  matchType: string
  matchedText: string
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  categories: string[]
  dataSource: 'database' | 'static'
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [dashboardData, setDashboardData] = React.useState<SearchResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch all errors for dashboard overview
        const response = await fetch('/api/search?limit=100')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
        
        const data: SearchResponse = await response.json()
        setDashboardData(data)
        
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getCategoryIcon = (category: string) => {
    const icons = {
      auth: ShieldCheck,
      network: Network,
      runtime: Activity,
      scheduler: Grid,
      storage: HardDrive,
      config: Settings,
      cluster: Server,
      registry: Database
    }
    return icons[category as keyof typeof icons] || AlertTriangle
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      auth: "text-amber-600",
      network: "text-cyan-600",
      runtime: "text-orange-600",
      scheduler: "text-blue-600",
      storage: "text-green-600",
      config: "text-purple-600",
      cluster: "text-indigo-600",
      registry: "text-rose-600"
    }
    return colors[category as keyof typeof colors] || "text-slate-600"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return "Dec 13, 2024"
    }
  }

  // Generate category stats
  const categoryStats = React.useMemo(() => {
    if (!dashboardData) return []
    
    const stats = dashboardData.results.reduce((acc, result) => {
      const cat = result.error.category
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([category, count]) => ({
        category,
        count,
        icon: getCategoryIcon(category),
        color: getCategoryColor(category)
      }))
  }, [dashboardData])

  if (isLoading) {
    return (
      <DocLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-32 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </DocLayout>
    )
  }

  if (error) {
    return (
      <DocLayout>
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
            <p className="text-slate-600">Kubernetes Error Documentation</p>
          </div>
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <p className="text-rose-600 font-medium">Failed to load documentation overview</p>
              </div>
              <p className="text-rose-600 text-sm mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-rose-200 text-rose-600 hover:bg-rose-100"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </DocLayout>
    )
  }

  return (
    <DocLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
          <p className="text-slate-600">
            Comprehensive troubleshooting reference for Kubernetes errors and operational issues
          </p>
        </div>

        {/* Overview Card */}
        {dashboardData && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Documented Errors</p>
                  <p className="text-3xl font-semibold text-slate-900">{dashboardData.total}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Categories</p>
                  <p className="text-3xl font-semibold text-slate-900">{dashboardData.categories.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Last Updated</p>
                  <p className="text-sm text-slate-900">{formatDate(new Date().toISOString())}</p>
                  <Badge variant="secondary" className="text-xs">
                    <Database className="h-3 w-3 mr-1" />
                    Live database
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Popular Errors</CardTitle>
            <CardDescription>
              Most commonly referenced Kubernetes errors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.results.slice(0, 5).map((result, index) => {
              const confidenceColor = result.score > 80 ? "text-emerald-600" : result.score > 60 ? "text-amber-600" : "text-slate-500"
              return (
                <div
                  key={`${result.error.canonical_slug}-${index}`}
                  className="border-l-2 border-slate-200 pl-4 space-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <Link 
                        href={`/errors/${result.error.canonical_slug}`}
                        className="text-sm font-medium text-slate-900 hover:text-indigo-600 flex items-center gap-2"
                      >
                        {result.error.title}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <p className="text-sm text-slate-600">
                        {result.error.summary.substring(0, 120)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className="text-xs capitalize">
                        {result.error.category}
                      </Badge>
                      <span className={cn("text-xs font-medium", confidenceColor)}>
                        {Math.round((result.score / 100) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            }) || (
              <p className="text-slate-500 text-center py-4">
                No errors found in this category yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Categories Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Error Categories</CardTitle>
            <CardDescription>
              Browse errors by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryStats.map(({ category, count, icon: Icon, color }) => (
                <Link
                  key={category}
                  href={`/errors?category=${category}`}
                  className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={cn("h-5 w-5", color)} />
                    <span className="text-sm font-medium text-slate-900">{count}</span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 capitalize group-hover:text-indigo-600">
                    {category}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {count} documented errors
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </DocLayout>
  )
}
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

  const getCategoryDescription = (category: string) => {
    const descriptions = {
      auth: "Authentication and authorization failures, RBAC issues, and permission-related errors",
      network: "Network connectivity, DNS resolution, ingress, and service communication issues",
      runtime: "Pod execution, container crashes, resource limitations, and application runtime errors",
      scheduler: "Pod scheduling failures, resource constraints, node affinity, and placement issues",
      storage: "Persistent volume claims, storage class problems, and volume mounting errors",
      config: "ConfigMap, Secret, and configuration-related issues affecting pod startup",
      cluster: "Cluster-wide issues, node problems, and infrastructure-level errors",
      registry: "Container image registry access and image pull problems"
    }
    return descriptions[category as keyof typeof descriptions] || "General Kubernetes operational issues and errors"
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
        {/* Enterprise Header */}
        <div className="space-y-3">
          <h1>Kubernetes Error Documentation</h1>
          <p className="text-lg text-slate-600">
            Enterprise-grade troubleshooting reference for Kubernetes clusters and workloads
          </p>
          {dashboardData && (
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {dashboardData.total} documented errors
              </span>
              <span className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-blue-600" />
                {dashboardData.categories.length} categories
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                Updated daily
              </span>
            </div>
          )}
        </div>

        {/* Enterprise Stats Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-emerald-900">{dashboardData.total}</p>
                    <p className="text-sm font-medium text-emerald-700">Total Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Grid className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-blue-900">{dashboardData.categories.length}</p>
                    <p className="text-sm font-medium text-blue-700">Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-amber-900">15</p>
                    <p className="text-sm font-medium text-amber-700">Critical Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-slate-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Activity className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">24/7</p>
                    <p className="text-sm font-medium text-slate-700">Monitoring</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enterprise Category Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>Error Categories</h2>
            <Link 
              href="/errors" 
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Browse all errors
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryStats.map((stat) => (
              <Card key={stat.category} className="hover:shadow-md transition-shadow border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <stat.icon className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 capitalize">{stat.category}</h3>
                          <p className="text-sm text-slate-600">{stat.count} documented errors</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {getCategoryDescription(stat.category)}
                      </p>
                      <Link 
                        href={`/errors?category=${stat.category}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View errors
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Error Reports</CardTitle>
                <CardDescription>Latest documented errors and troubleshooting guides</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Live updates
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.results.slice(0, 5).map((result, index) => (
              <div
                key={`${result.error.canonical_slug}-${index}`}
                className="flex items-start gap-4 p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors"
              >
                <div className="p-2 bg-slate-100 rounded-lg mt-1">
                  {(() => {
                    const Icon = getCategoryIcon(result.error.category)
                    return <Icon className="h-4 w-4 text-slate-600" />
                  })()}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <Link 
                      href={`/errors/${result.error.canonical_slug}`}
                      className="font-medium text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {result.error.title}
                    </Link>
                    <Badge variant="outline" className="text-xs bg-slate-50 capitalize">
                      {result.error.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {result.error.summary}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Tool: {result.error.tool}</span>
                    <span>•</span>
                    <span>Updated {formatDate(result.error.updated_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </DocLayout>
  )
}
"use client"

import * as React from "react"
import Link from "next/link"
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Activity,
  Database,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Monitor,
  Loader2,
  Eye,
  Package
} from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { cn } from "../../../lib/utils"

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

  const getCategoryColor = (category: string) => {
    const colors = {
      registry: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
      runtime: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
      scheduling: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
      config: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      storage: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
      network: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
      auth: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
      cluster: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
  }

  const formatLastSeen = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h ago`
      } else {
        return `${Math.floor(diffInMinutes / 1440)}d ago`
      }
    } catch {
      return "Recently"
    }
  }

  // Calculate stats from real data
  const stats = React.useMemo(() => {
    if (!dashboardData) {
      return [
        { title: "Total Errors", value: "...", icon: AlertTriangle, color: "text-red-600", change: "Loading..." },
        { title: "Categories", value: "...", icon: Package, color: "text-blue-600", change: "Loading..." },
        { title: "Top Tools", value: "...", icon: Monitor, color: "text-green-600", change: "Loading..." },
        { title: "Data Source", value: "...", icon: Database, color: "text-purple-600", change: "Loading..." },
      ]
    }

    const categoryCount = new Set(dashboardData.results.map(r => r.error.category)).size
    const toolCount = new Set(dashboardData.results.map(r => r.error.tool)).size
    const topTool = dashboardData.results.reduce((acc, curr) => {
      acc[curr.error.tool] = (acc[curr.error.tool] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const mostCommonTool = Object.entries(topTool).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'

    return [
      {
        title: "Total Errors",
        value: dashboardData.total.toString(),
        icon: AlertTriangle,
        color: "text-red-600",
        change: `${dashboardData.results.length} loaded`
      },
      {
        title: "Categories", 
        value: categoryCount.toString(),
        icon: BarChart3,
        color: "text-blue-600",
        change: `${dashboardData.categories.length} available`
      },
      {
        title: "Tools",
        value: toolCount.toString(), 
        icon: Monitor,
        color: "text-green-600",
        change: `Top: ${mostCommonTool}`
      },
      {
        title: "Data Source",
        value: dashboardData.dataSource,
        icon: Database,
        color: "text-purple-600",
        change: dashboardData.dataSource === 'database' ? 'Live data' : 'Fallback mode'
      },
    ]
  }, [dashboardData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Loading error intelligence data...</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading dashboard data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Error Intelligence Platform</p>
          </div>
        </div>

        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-600 font-medium">Failed to Load Dashboard</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-red-200 text-red-600 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Kubernetes Error Documentation</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Comprehensive troubleshooting guide and error reference
          </p>
          {dashboardData && (
            <p className="text-sm text-slate-500 mt-2">
              {dashboardData.total} documented errors • Updated {new Date().toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/errors">
              Browse Documentation
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/analysis">
              Bulk Analysis
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Documentation Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Error Reference</CardTitle>
            <CardDescription>
              Most frequently referenced error documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.results.slice(0, 6).map((result, index) => (
              <div
                key={`${result.error.canonical_slug}-${index}`}
                className="flex items-center space-x-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {result.error.title}
                    </p>
                    <Badge className={cn("text-xs", getCategoryColor(result.error.category))}>
                      {result.error.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.error.summary.substring(0, 80)}...
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Score: {result.score}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/errors/${result.error.canonical_slug}`}>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            )) || (
              <div className="text-center text-muted-foreground py-4">
                No recent errors found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Error Categories</CardTitle>
            <CardDescription>
              Breakdown by error category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData && Object.entries(
              dashboardData.results.reduce((acc, result) => {
                acc[result.error.category] = (acc[result.error.category] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs capitalize", getCategoryColor(category))}>
                      {category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{count}</span>
                    <div className="w-16 bg-muted h-2 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min((count / dashboardData.results.length) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Tool Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Tool Activity</CardTitle>
          <CardDescription>
            Error distribution across different tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData && Object.entries(
              dashboardData.results.reduce((acc, result) => {
                acc[result.error.tool] = (acc[result.error.tool] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .map(([tool, count]) => (
                <div key={tool} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="capitalize font-medium">{tool}</span>
                    </div>
                    <span className="font-medium">{count} errors</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min((count / dashboardData.results.length) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
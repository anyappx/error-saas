"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Package,
  Clock,
  TrendingUp,
  Eye,
  ExternalLink,
  Loader2
} from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
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
  query: string
  categories: string[]
  dataSource: 'database' | 'static'
  executionTimeMs: number
}

const tools = [
  { value: "all", label: "All Tools" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "docker", label: "Docker" },
  { value: "helm", label: "Helm" },
  { value: "kubectl", label: "Kubectl" },
  { value: "cni", label: "CNI" },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "registry", label: "Registry" },
  { value: "runtime", label: "Runtime" },
  { value: "scheduling", label: "Scheduling" },
  { value: "config", label: "Configuration" },
  { value: "storage", label: "Storage" },
  { value: "network", label: "Network" },
  { value: "auth", label: "Authentication" },
  { value: "cluster", label: "Cluster" },
  { value: "scheduler", label: "Scheduler" },
]

function ErrorsPageContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [selectedTool, setSelectedTool] = React.useState(searchParams.get("tool") || "all")
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = React.useState(0)
  const [dataSource, setDataSource] = React.useState<'database' | 'static'>('static')
  const [error, setError] = React.useState<string | null>(null)

  // Debounced search function
  const performSearch = React.useCallback(async (query: string, category?: string, tool?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const searchParams = new URLSearchParams()
      if (query) searchParams.set('q', query)
      if (category && category !== 'all') searchParams.set('category', category)
      if (tool && tool !== 'all') searchParams.set('tool', tool)
      
      const response = await fetch(`/api/search?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }
      
      const data: SearchResponse = await response.json()
      
      setSearchResults(data.results || [])
      setTotalResults(data.total || 0)
      setDataSource(data.dataSource || 'static')
      
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
      setSearchResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load - get all errors
  React.useEffect(() => {
    performSearch("")
  }, [performSearch])

  // Debounced search on query change
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery, selectedCategory, selectedTool)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory, selectedTool, performSearch])

  const handleRefresh = () => {
    performSearch(searchQuery, selectedCategory, selectedTool)
  }

  const handleExport = () => {
    console.log("Exporting error data...")
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
      cluster: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
      scheduler: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
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
      return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Error Documentation</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Search and browse comprehensive Kubernetes error documentation
          </p>
          {dataSource && (
            <p className="text-sm text-slate-500 mt-2">
              {totalResults} documented errors • Source: {dataSource === 'database' ? 'Live' : 'Static'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResults}</div>
            <p className="text-xs text-muted-foreground">across all tools</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Match</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {searchResults[0]?.error.title.substring(0, 20) || "None"}
              {searchResults[0]?.error.title.length > 20 ? "..." : ""}
            </div>
            <p className="text-xs text-muted-foreground">
              {searchResults[0]?.score ? `Score: ${searchResults[0].score}` : "No results"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(searchResults.map(r => r.error.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">error categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Source</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{dataSource}</div>
            <p className="text-xs text-muted-foreground">
              {dataSource === 'database' ? 'live data' : 'fallback mode'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
          <CardDescription>
            Search errors by keyword and filter by tool and category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search errors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger>
                <SelectValue placeholder="Tool" />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool.value} value={tool.value}>
                    {tool.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-600 font-medium">Search Error</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 border-red-200 text-red-600 hover:bg-red-100"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Error Results</CardTitle>
          <CardDescription>
            {isLoading 
              ? "Loading error data..." 
              : `Found ${totalResults} error${totalResults !== 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading errors...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p>No errors found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Error</TableHead>
                  <TableHead>Tool</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Match Type</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((result, index) => (
                  <TableRow key={`${result.error.canonical_slug}-${index}`}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{result.error.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {result.error.summary.substring(0, 100)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {result.error.tool}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", getCategoryColor(result.error.category))}>
                        {result.error.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={result.score > 80 ? "default" : result.score > 50 ? "secondary" : "outline"}>
                        {result.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground capitalize">
                        {result.matchType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {formatLastSeen(result.error.updated_at)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/errors/${result.error.canonical_slug}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ErrorsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    }>
      <ErrorsPageContent />
    </Suspense>
  )
}
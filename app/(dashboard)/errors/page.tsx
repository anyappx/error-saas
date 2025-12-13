"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { 
  Search, 
  Filter, 
  AlertTriangle,
  Eye,
  ExternalLink,
  Loader2,
  Database,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return "Unknown"
    }
  }


  return (
    <DocLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Error Documentation</h1>
          <p className="text-slate-600">
            Search and browse comprehensive Kubernetes error documentation
          </p>
          {dataSource && (
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-3">
              <span>{totalResults} documented errors</span>
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                <span>{dataSource === 'database' ? 'Live database' : 'Static fallback'}</span>
              </div>
            </div>
          )}
        </div>


        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search errors (e.g. CrashLoopBackOff)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 sm:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh} 
                  disabled={isLoading}
                  className="px-3"
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <p className="text-rose-600 font-medium">Search Error</p>
              </div>
              <p className="text-rose-600 text-sm mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border-rose-200 text-rose-600 hover:bg-rose-100"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-600">Loading error documentation...</span>
              </div>
            </CardContent>
          </Card>
        ) : searchResults.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="font-medium">No errors found for this category yet</p>
                <p className="text-sm">Try browsing other categories or adjusting your search</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {searchResults.length} of {totalResults} documented errors
              </p>
            </div>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <Card key={`${result.error.canonical_slug}-${index}`} className="hover:border-indigo-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Link 
                            href={`/errors/${result.error.canonical_slug}`}
                            className="text-base font-medium text-slate-900 hover:text-indigo-600 flex items-center gap-2"
                          >
                            {result.error.title}
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {result.error.summary.length > 150 
                            ? result.error.summary.substring(0, 150) + '...' 
                            : result.error.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <Badge variant="outline" className="capitalize">
                            {result.error.tool}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {result.error.category}
                          </Badge>
                          <span className="text-slate-500">
                            Updated {formatDate(result.error.updated_at)}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="ml-4">
                        <Link href={`/errors/${result.error.canonical_slug}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DocLayout>
  )
}

export default function ErrorsPage() {
  return (
    <Suspense fallback={
      <DocLayout>
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="h-64 bg-slate-100 rounded"></div>
        </div>
      </DocLayout>
    }>
      <ErrorsPageContent />
    </Suspense>
  )
}
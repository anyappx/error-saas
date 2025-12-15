"use client"

import * as React from "react"
import Link from "next/link"

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

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
        <p>Please wait while we load the dashboard.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Overview</h1>
        <p>Kubernetes Error Documentation</p>
        <div>
          <p><strong>Error:</strong> {error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header>
        <h1>Kubernetes Error Documentation</h1>
        <p>Enterprise-grade troubleshooting reference for Kubernetes clusters and workloads</p>
        {dashboardData && (
          <div>
            <span>{dashboardData.total} documented errors</span>
            <span>{dashboardData.categories.length} categories</span>
            <span>Updated daily</span>
          </div>
        )}
      </header>

      {dashboardData && (
        <section>
          <h2>Statistics</h2>
          <div>
            <div>
              <h3>Total Errors</h3>
              <p>{dashboardData.total}</p>
            </div>
            <div>
              <h3>Categories</h3>
              <p>{dashboardData.categories.length}</p>
            </div>
            <div>
              <h3>Critical Issues</h3>
              <p>15</p>
            </div>
            <div>
              <h3>Monitoring</h3>
              <p>24/7</p>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2>Error Categories</h2>
        <Link href="/errors">Browse all errors</Link>
        {dashboardData && (
          <div>
            {dashboardData.categories.map((category) => (
              <div key={category}>
                <h3>{category}</h3>
                <p>Documentation for {category} related errors</p>
                <Link href={`/errors?category=${category}`}>View errors</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Recent Error Reports</h2>
        <p>Latest documented errors and troubleshooting guides</p>
        {dashboardData?.results.slice(0, 5).map((result, index) => (
          <div key={`${result.error.canonical_slug}-${index}`}>
            <h3>
              <Link href={`/errors/${result.error.canonical_slug}`}>
                {result.error.title}
              </Link>
            </h3>
            <p><strong>Category:</strong> {result.error.category}</p>
            <p>{result.error.summary}</p>
            <p>
              <small>Tool: {result.error.tool} | Updated {formatDate(result.error.updated_at)}</small>
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}
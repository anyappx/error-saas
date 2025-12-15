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

  const generateCategoryStats = (data: SearchResponse) => {
    const stats = data.results.reduce((acc, result) => {
      const cat = result.error.category
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([category, count]) => ({ category, count }))
  }

  if (isLoading) {
    return (
      <div className="docs-font">
        {/* Same Header as Homepage */}
        <header className="docs-header">
          <Link href="/" className="docs-logo">
            ErrorDocs
          </Link>
          <nav className="docs-nav">
            <Link href="/docs" className="docs-nav-link">Documentation</Link>
            <Link href="/kubernetes" className="docs-nav-link">Kubernetes</Link>
            <Link href="/pricing" className="docs-nav-link">Pricing</Link>
            
            <div className="docs-search">
              <input 
                type="text" 
                placeholder="Search..." 
                className="docs-search-input"
              />
            </div>
            
            <Link href="/dashboard" className="docs-btn-primary">Get started</Link>
          </nav>
        </header>

        <main className="docs-section">
          <div className="docs-container">
            <div className="docs-card" style={{ textAlign: 'center' }}>
              <h1>Loading Dashboard...</h1>
              <p>Please wait while we load your data.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="docs-font">
        {/* Same Header as Homepage */}
        <header className="docs-header">
          <Link href="/" className="docs-logo">
            ErrorDocs
          </Link>
          <nav className="docs-nav">
            <Link href="/docs" className="docs-nav-link">Documentation</Link>
            <Link href="/kubernetes" className="docs-nav-link">Kubernetes</Link>
            <Link href="/pricing" className="docs-nav-link">Pricing</Link>
            
            <div className="docs-search">
              <input 
                type="text" 
                placeholder="Search..." 
                className="docs-search-input"
              />
            </div>
            
            <Link href="/dashboard" className="docs-btn-primary">Get started</Link>
          </nav>
        </header>

        <main className="docs-section">
          <div className="docs-container">
            <div className="docs-card" style={{ borderColor: '#EF4444', backgroundColor: '#FEF2F2' }}>
              <h1 style={{ color: '#DC2626' }}>Dashboard Error</h1>
              <p style={{ color: '#DC2626' }}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="docs-btn-primary"
                style={{ marginTop: '16px' }}
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const categoryStats = dashboardData ? generateCategoryStats(dashboardData) : []

  return (
    <div className="docs-font">
      {/* Same Header as Homepage */}
      <header className="docs-header">
        <Link href="/" className="docs-logo">
          ErrorDocs
        </Link>
        <nav className="docs-nav">
          <Link href="/docs" className="docs-nav-link">Documentation</Link>
          <Link href="/kubernetes" className="docs-nav-link">Kubernetes</Link>
          <Link href="/pricing" className="docs-nav-link">Pricing</Link>
          
          <div className="docs-search">
            <input 
              type="text" 
              placeholder="Search errors..." 
              className="docs-search-input"
            />
          </div>
          
          <Link href="/dashboard" className="docs-btn-primary">Get started</Link>
        </nav>
      </header>

      <main className="docs-section">
        <div className="docs-container">
          {/* Dashboard Hero */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px', color: 'var(--stripe-docs-text)' }}>
              Dashboard Overview
            </h1>
            <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '24px' }}>
              Monitor your Kubernetes troubleshooting resources and error documentation
            </p>
            {dashboardData && (
              <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px', color: '#6B7280' }}>
                <span><strong>{dashboardData.total}</strong> total errors</span>
                <span><strong>{dashboardData.categories.length}</strong> categories</span>
                <span><strong>Updated</strong> daily</span>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {dashboardData && (
            <div className="docs-grid" style={{ marginBottom: '48px' }}>
              <div className="docs-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--stripe-docs-primary)', marginBottom: '8px' }}>
                  {dashboardData.total}
                </div>
                <h3>Total Errors</h3>
                <p>Comprehensive error documentation</p>
              </div>
              
              <div className="docs-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>
                  {dashboardData.categories.length}
                </div>
                <h3>Categories</h3>
                <p>Organized by error type</p>
              </div>
              
              <div className="docs-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#F59E0B', marginBottom: '8px' }}>
                  24/7
                </div>
                <h3>Monitoring</h3>
                <p>Always available support</p>
              </div>
            </div>
          )}

          {/* Category Overview */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'var(--stripe-docs-text)' }}>
              Error Categories
            </h2>
            <div className="docs-grid-small">
              {categoryStats.map(({ category, count }) => (
                <Link href={`/errors?category=${category}`} key={category} className="docs-category-card">
                  <h4 style={{ textTransform: 'capitalize' }}>{category}</h4>
                  <p>{count} errors</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Errors */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'var(--stripe-docs-text)' }}>
              Recent Error Reports
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dashboardData?.results.slice(0, 5).map((result, index) => (
                <div key={`${result.error.canonical_slug}-${index}`} className="docs-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <Link 
                      href={`/errors/${result.error.canonical_slug}`}
                      style={{ fontSize: '18px', fontWeight: '600', color: 'var(--stripe-docs-primary)', textDecoration: 'none' }}
                    >
                      {result.error.title}
                    </Link>
                    <span style={{ 
                      fontSize: '12px', 
                      backgroundColor: '#F3F4F6', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      textTransform: 'capitalize',
                      color: '#6B7280'
                    }}>
                      {result.error.category}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6B7280' }}>
                    {result.error.summary}
                  </p>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    Tool: {result.error.tool} • Updated {formatDate(result.error.updated_at)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div style={{ textAlign: 'center', marginTop: '48px', padding: '48px 0' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--stripe-docs-text)' }}>
              Need help with a specific error?
            </h3>
            <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px' }}>
              Search our comprehensive error database or browse by category
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/errors" className="docs-btn-primary">Browse All Errors</Link>
              <Link href="/kubernetes" className="docs-btn-secondary">View Documentation</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { safeFindErrors } from '../../../lib/dbFallback'
import { normalizeText } from '../../../lib/normalize'
import { KubernetesError } from '../../../lib/schema'
import { logger } from '../../../lib/logger'

export interface SearchResult {
  error: KubernetesError
  score: number
  matchType: 'exact' | 'alias' | 'regex' | 'fuzzy'
  matchedText: string
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  page: number
  pageSize: number
  categories: string[]
  executionTimeMs: number
  dataSource: 'database' | 'static'
}

class K8SearchEngine {
  private readonly EXACT_MATCH_SCORE = 100
  private readonly ALIAS_MATCH_SCORE = 80
  private readonly REGEX_MATCH_SCORE = 60
  private readonly FUZZY_MATCH_SCORE = 40
  private readonly CATEGORY_BOOST = 20
  private readonly TITLE_BOOST = 15
  private readonly SUMMARY_BOOST = 10

  async search(
    query: string,
    category?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<SearchResponse> {
    const startTime = Date.now()
    const normalizedQuery = normalizeText(query)
    
    // Get all errors using safe fallback
    const allErrors = await safeFindErrors()
    
    if (!normalizedQuery) {
      return {
        results: [],
        total: 0,
        query,
        page,
        pageSize,
        categories: [],
        executionTimeMs: Date.now() - startTime,
        dataSource: allErrors === await safeFindErrors() ? 'static' : 'database'
      }
    }

    let results: SearchResult[] = []

    // 1. Exact canonical slug matches
    results.push(...this.findExactMatches(normalizedQuery, allErrors))
    
    // 2. Alias matches
    results.push(...this.findAliasMatches(normalizedQuery, allErrors))
    
    // 3. Regex pattern matches
    results.push(...this.findRegexMatches(normalizedQuery, allErrors))
    
    // 4. Fuzzy content matches
    results.push(...this.findFuzzyMatches(normalizedQuery, allErrors))

    // Remove duplicates by canonical_slug
    const uniqueResults = this.deduplicateResults(results)

    // Apply category filter
    const filteredResults = category 
      ? uniqueResults.filter(r => r.error.category === category)
      : uniqueResults

    // Sort by score (highest first)
    filteredResults.sort((a, b) => b.score - a.score)

    // Apply pagination
    const startIndex = (page - 1) * pageSize
    const paginatedResults = filteredResults.slice(startIndex, startIndex + pageSize)

    // Extract categories for faceting
    const categories = [...new Set(filteredResults.map(r => r.error.category))]

    return {
      results: paginatedResults,
      total: filteredResults.length,
      query,
      page,
      pageSize,
      categories,
      executionTimeMs: Date.now() - startTime,
      dataSource: 'static' // For now, will be enhanced with DB detection
    }
  }

  private findExactMatches(query: string, errors: KubernetesError[]): SearchResult[] {
    return errors
      .filter(error => error.canonical_slug === query)
      .map(error => ({
        error,
        score: this.EXACT_MATCH_SCORE + this.getCategoryBoost(error),
        matchType: 'exact' as const,
        matchedText: error.canonical_slug
      }))
  }

  private findAliasMatches(query: string, errors: KubernetesError[]): SearchResult[] {
    const results: SearchResult[] = []
    
    for (const error of errors) {
      for (const alias of error.aliases) {
        const normalizedAlias = normalizeText(alias)
        if (normalizedAlias.includes(query) || query.includes(normalizedAlias)) {
          let score = this.ALIAS_MATCH_SCORE
          
          // Boost for exact alias match
          if (normalizedAlias === query) {
            score += 20
          }
          
          // Boost for title match
          if (normalizeText(error.title).includes(query)) {
            score += this.TITLE_BOOST
          }
          
          results.push({
            error,
            score: score + this.getCategoryBoost(error),
            matchType: 'alias',
            matchedText: alias
          })
          break // Only count first alias match per error
        }
      }
    }
    
    return results
  }

  private findRegexMatches(query: string, errors: KubernetesError[]): SearchResult[] {
    const results: SearchResult[] = []
    
    for (const error of errors) {
      for (const pattern of error.matchers.regex) {
        try {
          const regex = new RegExp(pattern, 'i')
          if (regex.test(query)) {
            let score = this.REGEX_MATCH_SCORE
            
            // Boost for summary match
            if (normalizeText(error.summary).includes(query)) {
              score += this.SUMMARY_BOOST
            }
            
            results.push({
              error,
              score: score + this.getCategoryBoost(error),
              matchType: 'regex',
              matchedText: pattern
            })
            break // Only count first regex match per error
          }
        } catch (e) {
          // Skip invalid regex patterns
          continue
        }
      }
    }
    
    return results
  }

  private findFuzzyMatches(query: string, errors: KubernetesError[]): SearchResult[] {
    const results: SearchResult[] = []
    const queryWords = query.split(/\s+/)
    
    for (const error of errors) {
      const searchableText = [
        error.title,
        error.summary,
        ...error.root_causes.map(c => `${c.name} ${c.why}`),
        ...error.fix_steps.map(s => s.step),
        ...error.examples.map(e => `${e.name} ${e.symptom}`)
      ].join(' ')
      
      const normalizedText = normalizeText(searchableText)
      let matchCount = 0
      let totalWords = queryWords.length
      
      for (const word of queryWords) {
        if (word.length > 2 && normalizedText.includes(word)) {
          matchCount++
        }
      }
      
      if (matchCount > 0) {
        const matchRatio = matchCount / totalWords
        let score = Math.floor(this.FUZZY_MATCH_SCORE * matchRatio)
        
        // Boost for title matches
        const titleWords = normalizeText(error.title).split(/\s+/)
        for (const word of queryWords) {
          if (titleWords.some(tw => tw.includes(word) || word.includes(tw))) {
            score += this.TITLE_BOOST
            break
          }
        }
        
        if (score > 10) { // Only include matches with reasonable score
          results.push({
            error,
            score: score + this.getCategoryBoost(error),
            matchType: 'fuzzy',
            matchedText: queryWords.filter(w => normalizedText.includes(w)).join(' ')
          })
        }
      }
    }
    
    return results
  }

  private getCategoryBoost(error: KubernetesError): number {
    // Boost popular categories
    const categoryBoosts: Record<string, number> = {
      'runtime': this.CATEGORY_BOOST,
      'network': this.CATEGORY_BOOST * 0.8,
      'auth': this.CATEGORY_BOOST * 0.6,
      'storage': this.CATEGORY_BOOST * 0.6,
      'config': this.CATEGORY_BOOST * 0.4,
      'scheduler': this.CATEGORY_BOOST * 0.4,
      'cluster': this.CATEGORY_BOOST * 0.4
    }
    
    return categoryBoosts[error.category] || 0
  }

  private deduplicateResults(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>()
    const unique: SearchResult[] = []
    
    for (const result of results) {
      if (!seen.has(result.error.canonical_slug)) {
        seen.add(result.error.canonical_slug)
        unique.push(result)
      } else {
        // If we've seen this error, boost the existing one's score
        const existing = unique.find(r => r.error.canonical_slug === result.error.canonical_slug)
        if (existing && result.score > existing.score) {
          existing.score = result.score
          existing.matchType = result.matchType
          existing.matchedText = result.matchedText
        }
      }
    }
    
    return unique
  }

  async getPopularSearches(): Promise<string[]> {
    return [
      'pod pending',
      'image pull error',
      'node not ready',
      'crashloopbackoff',
      'service unavailable',
      'forbidden',
      'network unreachable',
      'oom killed',
      'volume mount failed',
      'certificate expired'
    ]
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) {
      return this.getPopularSearches()
    }
    
    const normalizedQuery = normalizeText(query)
    const suggestions = new Set<string>()
    const allErrors = await safeFindErrors()
    
    // Add matching aliases
    for (const error of allErrors) {
      for (const alias of error.aliases) {
        if (normalizeText(alias).includes(normalizedQuery)) {
          suggestions.add(alias)
          if (suggestions.size >= 8) break
        }
      }
      if (suggestions.size >= 8) break
    }
    
    // Add matching titles
    for (const error of allErrors) {
      if (normalizeText(error.title).includes(normalizedQuery)) {
        suggestions.add(error.title)
        if (suggestions.size >= 10) break
      }
    }
    
    return Array.from(suggestions).slice(0, 10)
  }
}

const searchEngine = new K8SearchEngine()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const suggestions = searchParams.get('suggestions') === 'true'

    if (suggestions) {
      return NextResponse.json({
        suggestions: await searchEngine.getSuggestions(query)
      })
    }

    const results = await searchEngine.search(query, category, page, pageSize)
    
    return NextResponse.json(results)
  } catch (error) {
    logger.error('[API] Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, category, page = 1, pageSize = 20 } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const results = await searchEngine.search(query, category, page, pageSize)
    
    return NextResponse.json(results)
  } catch (error) {
    logger.error('[API] Search POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
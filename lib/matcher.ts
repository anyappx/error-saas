import { KubernetesError } from './schema'
import { normalizeText } from './normalize'

export interface MatchResult {
  slug: string | null
  confidence: number
  score: number
  matchDetails: MatchDetail[]
  suggestions: Array<{
    slug: string
    title: string
    category: string
    score: number
  }>
}

export interface MatchDetail {
  type: 'exact' | 'regex' | 'alias' | 'title' | 'summary' | 'cause' | 'semantic'
  pattern: string
  matchedText: string
  score: number
}

export interface MatcherConfig {
  exactMatchWeight: number
  regexWeight: number
  aliasWeight: number
  titleWeight: number
  summaryWeight: number
  causeWeight: number
  semanticWeight: number
  categoryBoost: Record<string, number>
  lengthPenalty: boolean
  fuzzyThreshold: number
}

class K8MatcherEngine {
  private config: MatcherConfig

  constructor(config?: Partial<MatcherConfig>) {
    this.config = {
      exactMatchWeight: 50,
      regexWeight: 25,
      aliasWeight: 20,
      titleWeight: 15,
      summaryWeight: 10,
      causeWeight: 8,
      semanticWeight: 5,
      categoryBoost: {
        'runtime': 15,
        'network': 12,
        'auth': 10,
        'storage': 10,
        'config': 8,
        'scheduler': 8,
        'cluster': 8
      },
      lengthPenalty: true,
      fuzzyThreshold: 0.7,
      ...config
    }
  }

  /**
   * Matches normalized text against Kubernetes errors using weighted scoring
   */
  matchError(normalizedText: string, errors: KubernetesError[]): MatchResult {
    if (!normalizedText.trim()) {
      return {
        slug: null,
        confidence: 0,
        score: 0,
        matchDetails: [],
        suggestions: []
      }
    }

    const queryTokens = this.tokenize(normalizedText)
    const results = errors.map(error => this.scoreError(normalizedText, queryTokens, error))
    
    // Sort by score descending
    results.sort((a, b) => b.totalScore - a.totalScore)
    
    const topResult = results[0]
    const confidence = this.calculateConfidence(topResult?.totalScore || 0, normalizedText.length)
    
    // Get top 5 suggestions
    const suggestions = results.slice(0, 5).map(result => ({
      slug: result.error.canonical_slug,
      title: result.error.title,
      category: result.error.category,
      score: Math.round(result.totalScore * 10) / 10
    }))

    return {
      slug: topResult?.error.canonical_slug || null,
      confidence,
      score: Math.round((topResult?.totalScore || 0) * 10) / 10,
      matchDetails: topResult?.details || [],
      suggestions
    }
  }

  private scoreError(
    normalizedText: string, 
    queryTokens: string[], 
    error: KubernetesError
  ): { error: KubernetesError; totalScore: number; details: MatchDetail[] } {
    const details: MatchDetail[] = []
    let totalScore = 0

    // 1. Exact canonical slug match
    if (normalizedText === error.canonical_slug) {
      const score = this.config.exactMatchWeight
      details.push({
        type: 'exact',
        pattern: error.canonical_slug,
        matchedText: normalizedText,
        score
      })
      totalScore += score
    }

    // 2. Regex pattern matching
    const regexScore = this.scoreRegexMatches(normalizedText, error.matchers.regex, details)
    totalScore += regexScore

    // 3. Alias matching
    const aliasScore = this.scoreAliasMatches(normalizedText, queryTokens, error.aliases, details)
    totalScore += aliasScore

    // 4. Title matching
    const titleScore = this.scoreTitleMatch(normalizedText, queryTokens, error.title, details)
    totalScore += titleScore

    // 5. Summary matching
    const summaryScore = this.scoreSummaryMatch(normalizedText, queryTokens, error.summary, details)
    totalScore += summaryScore

    // 6. Root causes matching
    const causeScore = this.scoreCauseMatches(normalizedText, queryTokens, error.root_causes, details)
    totalScore += causeScore

    // 7. Semantic/contextual matching
    const semanticScore = this.scoreSemanticMatches(normalizedText, queryTokens, error, details)
    totalScore += semanticScore

    // 8. Category boost
    const categoryBoost = this.config.categoryBoost[error.category] || 0
    if (categoryBoost > 0) {
      totalScore += categoryBoost
      details.push({
        type: 'semantic',
        pattern: `category:${error.category}`,
        matchedText: error.category,
        score: categoryBoost
      })
    }

    // 9. Length penalty for very short queries
    if (this.config.lengthPenalty && normalizedText.length < 10) {
      totalScore *= 0.8
    }

    return { error, totalScore, details }
  }

  private scoreRegexMatches(text: string, patterns: string[], details: MatchDetail[]): number {
    let score = 0
    const matchedPatterns = new Set<string>()

    for (const pattern of patterns) {
      try {
        const regex = new RegExp(pattern, 'i')
        const match = text.match(regex)
        
        if (match && !matchedPatterns.has(pattern)) {
          matchedPatterns.add(pattern)
          const matchScore = this.config.regexWeight * (1 + (match[0].length / text.length))
          score += matchScore
          
          details.push({
            type: 'regex',
            pattern,
            matchedText: match[0],
            score: Math.round(matchScore * 10) / 10
          })
        }
      } catch {
        // Invalid regex, skip
        continue
      }
    }

    return score
  }

  private scoreAliasMatches(text: string, tokens: string[], aliases: string[], details: MatchDetail[]): number {
    let score = 0
    
    for (const alias of aliases) {
      const normalizedAlias = normalizeText(alias)
      
      // Exact alias match
      if (text.includes(normalizedAlias)) {
        const matchScore = this.config.aliasWeight * (normalizedAlias.length / text.length)
        score += matchScore
        
        details.push({
          type: 'alias',
          pattern: alias,
          matchedText: normalizedAlias,
          score: Math.round(matchScore * 10) / 10
        })
      }
      // Partial token matching
      else {
        const aliasTokens = this.tokenize(normalizedAlias)
        const matchCount = tokens.filter(token => 
          aliasTokens.some(at => at.includes(token) || token.includes(at))
        ).length
        
        if (matchCount > 0) {
          const matchScore = (this.config.aliasWeight * 0.5) * (matchCount / Math.max(tokens.length, aliasTokens.length))
          score += matchScore
          
          details.push({
            type: 'alias',
            pattern: alias,
            matchedText: tokens.filter(t => aliasTokens.some(at => at.includes(t))).join(' '),
            score: Math.round(matchScore * 10) / 10
          })
        }
      }
    }

    return score
  }

  private scoreTitleMatch(text: string, tokens: string[], title: string, details: MatchDetail[]): number {
    const normalizedTitle = normalizeText(title)
    
    if (text.includes(normalizedTitle) || normalizedTitle.includes(text)) {
      const matchScore = this.config.titleWeight
      details.push({
        type: 'title',
        pattern: title,
        matchedText: title,
        score: matchScore
      })
      return matchScore
    }

    // Token-based matching
    const titleTokens = this.tokenize(normalizedTitle)
    const matchCount = tokens.filter(token =>
      titleTokens.some(tt => tt.includes(token) || token.includes(tt))
    ).length

    if (matchCount > 0) {
      const matchScore = this.config.titleWeight * 0.7 * (matchCount / titleTokens.length)
      details.push({
        type: 'title',
        pattern: title,
        matchedText: tokens.filter(t => titleTokens.some(tt => tt.includes(t))).join(' '),
        score: Math.round(matchScore * 10) / 10
      })
      return matchScore
    }

    return 0
  }

  private scoreSummaryMatch(text: string, tokens: string[], summary: string, details: MatchDetail[]): number {
    const normalizedSummary = normalizeText(summary)
    const summaryTokens = this.tokenize(normalizedSummary)
    
    const matchCount = tokens.filter(token =>
      summaryTokens.some(st => st.includes(token) && token.length > 3)
    ).length

    if (matchCount > 0) {
      const matchScore = this.config.summaryWeight * (matchCount / tokens.length)
      details.push({
        type: 'summary',
        pattern: summary.slice(0, 50) + '...',
        matchedText: tokens.filter(t => summaryTokens.some(st => st.includes(t))).join(' '),
        score: Math.round(matchScore * 10) / 10
      })
      return matchScore
    }

    return 0
  }

  private scoreCauseMatches(text: string, tokens: string[], causes: any[], details: MatchDetail[]): number {
    let score = 0
    
    for (const cause of causes.slice(0, 3)) { // Limit to top 3 causes
      const causeText = normalizeText(`${cause.name} ${cause.why}`)
      const causeTokens = this.tokenize(causeText)
      
      const matchCount = tokens.filter(token =>
        causeTokens.some(ct => ct.includes(token) && token.length > 3)
      ).length

      if (matchCount > 0) {
        const matchScore = this.config.causeWeight * (matchCount / tokens.length) * cause.confidence
        score += matchScore
        
        details.push({
          type: 'cause',
          pattern: cause.name,
          matchedText: tokens.filter(t => causeTokens.some(ct => ct.includes(t))).join(' '),
          score: Math.round(matchScore * 10) / 10
        })
      }
    }

    return score
  }

  private scoreSemanticMatches(text: string, tokens: string[], error: KubernetesError, details: MatchDetail[]): number {
    let score = 0
    
    // Common Kubernetes error keywords
    const k8sKeywords = [
      'pod', 'container', 'deployment', 'service', 'node', 'cluster',
      'image', 'volume', 'secret', 'configmap', 'namespace', 'ingress',
      'kubelet', 'api', 'scheduler', 'controller', 'etcd', 'proxy'
    ]
    
    const contextKeywords = error.fix_steps
      .flatMap(step => this.tokenize(step.step))
      .filter(token => k8sKeywords.includes(token))
      .slice(0, 5)
    
    const contextMatches = tokens.filter(token => contextKeywords.includes(token))
    
    if (contextMatches.length > 0) {
      const matchScore = this.config.semanticWeight * contextMatches.length
      score += matchScore
      
      details.push({
        type: 'semantic',
        pattern: 'kubernetes-context',
        matchedText: contextMatches.join(' '),
        score: Math.round(matchScore * 10) / 10
      })
    }

    return score
  }

  private calculateConfidence(score: number, textLength: number): number {
    // Base confidence from score
    let confidence = 0
    
    if (score >= 80) {
      confidence = 0.95
    } else if (score >= 60) {
      confidence = 0.85
    } else if (score >= 40) {
      confidence = 0.75
    } else if (score >= 25) {
      confidence = 0.65
    } else if (score >= 15) {
      confidence = 0.5
    } else if (score >= 8) {
      confidence = 0.35
    } else {
      confidence = 0.1
    }
    
    // Adjust for text length
    if (textLength < 20) {
      confidence *= 0.8
    } else if (textLength > 100) {
      confidence *= 0.9
    }
    
    return Math.min(confidence, 0.99)
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
  }
}

// Create default matcher instance
const defaultMatcher = new K8MatcherEngine()

/**
 * Legacy compatibility function
 */
export function matchError(normalizedText: string, errors: KubernetesError[]): MatchResult {
  return defaultMatcher.matchError(normalizedText, errors)
}

/**
 * Create a custom matcher with specific configuration
 */
export function createMatcher(config: Partial<MatcherConfig>): K8MatcherEngine {
  return new K8MatcherEngine(config)
}

export { K8MatcherEngine }
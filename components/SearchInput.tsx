'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface SearchResult {
  error: any
  score: number
  matchType: string
  matchedText: string
}

interface SearchInputProps {
  placeholder?: string
  onResults?: (results: SearchResult[]) => void
  className?: string
  showSuggestions?: boolean
}

export function SearchInput({ 
  placeholder = "Search Kubernetes errors...", 
  onResults,
  className = "",
  showSuggestions = true 
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestionsList(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      if (showSuggestions) {
        await fetchSuggestions(query)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, showSuggestions])

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&suggestions=true`)
      const data = await response.json()
      
      if (data.suggestions) {
        setSuggestions(data.suggestions)
        setShowSuggestionsList(true)
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setShowSuggestionsList(false)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.results) {
        onResults?.(data.results)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestionsList(false)
    performSearch(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsList || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault()
          handleSuggestionClick(suggestions[selectedSuggestionIndex])
        }
        break
      case 'Escape':
        setShowSuggestionsList(false)
        setSelectedSuggestionIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestionsList(true)
              }
            }}
            placeholder={placeholder}
            className="w-full h-12 px-4 pr-24 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            disabled={isLoading}
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {isLoading && (
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            )}
            
            <Button 
              type="submit" 
              size="sm"
              disabled={isLoading || !query.trim()}
              className="h-8"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </form>

      {showSuggestionsList && suggestions.length > 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-full mt-1 w-full z-50 max-h-64 overflow-y-auto"
        >
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">Suggestions</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                  ${index === selectedSuggestionIndex 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
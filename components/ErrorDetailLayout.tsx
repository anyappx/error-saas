'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { getErrorCategoryColor } from '@/lib/utils'

interface ErrorDetailProps {
  error: any
  relatedErrors?: any[]
}

export function ErrorDetailLayout({ error, relatedErrors = [] }: ErrorDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'causes' | 'fixes' | 'examples'>('overview')
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCommand(text)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'causes', label: 'Root Causes' },
    { id: 'fixes', label: 'Fix Steps' },
    { id: 'examples', label: 'Examples' }
  ]

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getErrorCategoryColor(error.category)}`}>
            {error.category.toUpperCase()}
          </span>
          <span className="text-sm text-muted-foreground">
            {error.tool}
          </span>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {error.title}
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed">
          {error.summary}
        </p>
        
        {error.aliases.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Also known as:</h3>
            <div className="flex flex-wrap gap-2">
              {error.aliases.slice(0, 5).map((alias: string, index: number) => (
                <span key={index} className="px-2 py-1 text-xs bg-muted rounded-md">
                  {alias}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{error.summary}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Root Causes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {error.root_causes.slice(0, 3).map((cause: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{cause.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{cause.why}</p>
                          <div className="flex items-center mt-2">
                            <div className="w-16 bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full" 
                                style={{ width: `${cause.confidence * 100}%` }}
                              />
                            </div>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {Math.round(cause.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'causes' && (
            <div className="space-y-4">
              {error.root_causes.map((cause: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      {cause.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{cause.why}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${cause.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(cause.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    {cause.sources && cause.sources.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">References:</h5>
                        <div className="space-y-1">
                          {cause.sources.map((source: any, srcIndex: number) => (
                            <a
                              key={srcIndex}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline block"
                            >
                              {source.label} ↗
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'fixes' && (
            <div className="space-y-4">
              {error.fix_steps.map((step: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      {step.step}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {step.commands && step.commands.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium">Commands:</h5>
                        {step.commands.map((command: string, cmdIndex: number) => (
                          <div key={cmdIndex} className="bg-muted p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <code className="text-sm font-mono">{command}</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(command)}
                                className="ml-2 h-6 w-6 p-0"
                              >
                                {copiedCommand === command ? (
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {step.sources && step.sources.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">References:</h5>
                        <div className="space-y-1">
                          {step.sources.map((source: any, srcIndex: number) => (
                            <a
                              key={srcIndex}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline block"
                            >
                              {source.label} ↗
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-4">
              {error.examples.map((example: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{example.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-1">Symptom:</h5>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          {example.symptom}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-1">Fix:</h5>
                        <p className="text-sm">{example.fix}</p>
                      </div>
                      
                      {example.sources && example.sources.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">References:</h5>
                          <div className="space-y-1">
                            {example.sources.map((source: any, srcIndex: number) => (
                              <a
                                key={srcIndex}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline block"
                              >
                                {source.label} ↗
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Error
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Bookmark
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Guide
              </Button>
            </CardContent>
          </Card>

          {error.clarifying_questions && error.clarifying_questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {error.clarifying_questions.map((question: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {relatedErrors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedErrors.slice(0, 5).map((related: any, index: number) => (
                    <a
                      key={index}
                      href={`/${related.tool}/errors/${related.canonical_slug}`}
                      className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <h5 className="font-medium text-sm">{related.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {related.summary}
                      </p>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
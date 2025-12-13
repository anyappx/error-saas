'use client'

import { useState } from 'react'

interface ExplainResponse {
  tool: string
  match: { slug: string | null, confidence: number }
  title: string | null
  summary: string | null
  root_causes: Array<{
    name: string
    why: string
    confidence: number
    sources: Array<{ url: string, label: string }>
  }>
  fix_steps: Array<{
    step: string
    commands: string[]
    sources: Array<{ url: string, label: string }>
  }>
  sources: Array<{ url: string, label: string }>
  clarifying_question: string | null
  suggestions: Array<{ slug: string, title: string, category: string }>
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<ExplainResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const exampleErrors = [
    'ImagePullBackOff',
    'CrashLoopBackOff', 
    'CreateContainerConfigError',
    '0/3 nodes are available: pod has unbound immediate PersistentVolumeClaims',
    'FailedScheduling'
  ]

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      
      const data = await response.json()
      
      // Handle API errors gracefully
      if (data.error) {
        setResult({
          tool: 'kubernetes',
          match: { slug: null, confidence: 0 },
          title: 'API Connection Error',
          summary: 'Unable to process request. This demo requires a MongoDB connection.',
          root_causes: [],
          fix_steps: [],
          sources: [],
          clarifying_question: 'Please set up MongoDB connection to use the full functionality.',
          suggestions: []
        })
      } else {
        setResult(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setResult({
        tool: 'kubernetes',
        match: { slug: null, confidence: 0 },
        title: 'Connection Error',
        summary: 'Failed to connect to the API.',
        root_causes: [],
        fix_steps: [],
        sources: [],
        clarifying_question: null,
        suggestions: []
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Kubernetes Error Fix Atlas</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your Kubernetes error here..."
          rows={8}
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}
        />
        
        <button
          onClick={() => handleSubmit(inputText)}
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Analyzing...' : 'Explain & Fix'}
        </button>
      </div>

      <div>
        <h3>Quick Examples:</h3>
        <div style={{ marginBottom: '20px' }}>
          {exampleErrors.map((error, index) => (
            <button
              key={index}
              onClick={() => {
                setInputText(error)
                handleSubmit(error)
              }}
              style={{
                margin: '5px',
                padding: '5px 10px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {error}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div style={{ marginTop: '30px' }}>
          <h2>Result</h2>
          
          {result.title && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Meaning</h3>
              <h4>{result.title}</h4>
              <p>{result.summary}</p>
              <p>Confidence: {(result.match.confidence * 100).toFixed(0)}%</p>
            </div>
          )}

          {result.root_causes && result.root_causes.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Common Causes</h3>
              {result.root_causes.map((cause, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                  <strong>{cause.name}</strong>
                  <p>{cause.why}</p>
                  <small>Confidence: {(cause.confidence * 100).toFixed(0)}%</small>
                </div>
              ))}
            </div>
          )}

          {result.fix_steps && result.fix_steps.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Fix Steps</h3>
              {result.fix_steps.map((step, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <h4>{index + 1}. {step.step}</h4>
                  {step.commands && step.commands.length > 0 && (
                    <div>
                      <strong>Commands:</strong>
                      {step.commands.map((cmd, cmdIndex) => (
                        <pre key={cmdIndex} style={{ 
                          backgroundColor: '#f0f0f0', 
                          padding: '5px', 
                          marginTop: '5px',
                          fontFamily: 'monospace'
                        }}>
                          {cmd}
                        </pre>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.sources && result.sources.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Sources</h3>
              <ul>
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.clarifying_question && (
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
              <h3>Need More Info</h3>
              <p>{result.clarifying_question}</p>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Top Suggestions</h3>
              {result.suggestions.map((suggestion, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <strong>{suggestion.title}</strong> ({suggestion.category})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
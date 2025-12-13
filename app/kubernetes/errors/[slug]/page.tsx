import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import clientPromise from '../../../../lib/mongodb'
import { ErrorSchema, KubernetesError } from '../../../../lib/schema'
import { generateSEOMetadata, generateFAQJsonLd } from '../../../../lib/seo'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getError(slug: string): Promise<KubernetesError | null> {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const error = await db.collection('errors').findOne({
      tool: 'kubernetes',
      canonical_slug: slug
    })
    
    if (!error) return null
    
    return ErrorSchema.parse(error)
  } catch {
    return null
  }
}

async function getRelatedErrors(category: string, currentSlug: string): Promise<KubernetesError[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const errors = await db.collection('errors')
      .find({
        tool: 'kubernetes',
        category,
        canonical_slug: { $ne: currentSlug }
      })
      .limit(5)
      .toArray()
    
    return errors.map(error => ErrorSchema.parse(error))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const error = await getError(slug)
  
  if (!error) {
    return {
      title: 'Error not found',
      description: 'The requested Kubernetes error could not be found.'
    }
  }
  
  return generateSEOMetadata(error)
}

export default async function ErrorPage({ params }: PageProps) {
  const { slug } = await params
  const error = await getError(slug)
  
  if (!error) {
    notFound()
  }
  
  const relatedErrors = await getRelatedErrors(error.category, error.canonical_slug)
  const faqJsonLd = generateFAQJsonLd(error)
  
  // Flatten all sources
  const allSources = [
    ...error.root_causes.flatMap(c => c.sources),
    ...error.fix_steps.flatMap(s => s.sources),
    ...error.examples.flatMap(e => e.sources)
  ]
  
  // Remove duplicates
  const uniqueSources = allSources.filter((source, index, self) => 
    index === self.findIndex(s => s.url === source.url)
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <nav style={{ marginBottom: '20px' }}>
        <a href="/" style={{ color: '#007cba', textDecoration: 'none' }}>← Back to Error Atlas</a>
      </nav>
      
      <h1>{error.title}</h1>
      
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderLeft: '4px solid #007cba' }}>
        <h2>Summary</h2>
        <p>{error.summary}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Common Causes</h2>
        {error.root_causes.map((cause, index) => (
          <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
            <h3>{cause.name}</h3>
            <p>{cause.why}</p>
            <div style={{ marginTop: '10px' }}>
              <strong>Confidence: {(cause.confidence * 100).toFixed(0)}%</strong>
            </div>
            {cause.sources.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Sources:</strong>
                <ul>
                  {cause.sources.map((source, sourceIndex) => (
                    <li key={sourceIndex}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Fix Steps</h2>
        {error.fix_steps.map((step, index) => (
          <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
            <h3>{index + 1}. {step.step}</h3>
            {step.commands.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Commands:</strong>
                {step.commands.map((cmd, cmdIndex) => (
                  <pre key={cmdIndex} style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: '10px', 
                    marginTop: '5px',
                    fontFamily: 'monospace',
                    borderRadius: '4px',
                    overflow: 'auto'
                  }}>
                    {cmd}
                  </pre>
                ))}
              </div>
            )}
            {step.sources.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Sources:</strong>
                <ul>
                  {step.sources.map((source, sourceIndex) => (
                    <li key={sourceIndex}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {error.examples.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Examples</h2>
          {error.examples.map((example, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e2e3e5', borderRadius: '4px' }}>
              <h3>{example.name}</h3>
              <p><strong>Symptom:</strong> {example.symptom}</p>
              <p><strong>Fix:</strong> {example.fix}</p>
              {example.sources.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Sources:</strong>
                  <ul>
                    {example.sources.map((source, sourceIndex) => (
                      <li key={sourceIndex}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2>All Sources</h2>
        <ul>
          {uniqueSources.map((source, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {relatedErrors.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Related {error.category} Errors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            {relatedErrors.map((related) => (
              <a
                key={related.canonical_slug}
                href={`/kubernetes/errors/${related.canonical_slug}`}
                style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid #dee2e6'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', color: '#007cba' }}>{related.title}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
                  {related.summary.slice(0, 100)}...
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
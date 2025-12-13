import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { K8S_ERRORS } from '../../../../../kubernetes/errors/k8s_errors'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const error = K8S_ERRORS.find(e => e.canonical_slug === slug)
    
    if (!error) {
      return new Response('Error not found', { status: 404 })
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F172A',
            backgroundImage: 'linear-gradient(45deg, #1E293B 0%, #0F172A 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              maxWidth: '800px',
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#F97316',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              🔧 Kubernetes Error Fix Guide
            </div>
            
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '30px',
                textAlign: 'center',
                lineHeight: 1.1,
              }}
            >
              {error.title}
            </div>
            
            <div
              style={{
                fontSize: 24,
                color: '#CBD5E1',
                textAlign: 'center',
                marginBottom: '30px',
                lineHeight: 1.4,
              }}
            >
              {error.summary.slice(0, 120)}...
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  backgroundColor: error.category === 'auth' ? '#DC2626' :
                                 error.category === 'network' ? '#2563EB' :
                                 error.category === 'storage' ? '#7C3AED' :
                                 error.category === 'runtime' ? '#059669' :
                                 error.category === 'config' ? '#EA580C' :
                                 error.category === 'scheduler' ? '#0891B2' : '#6B7280',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '18px',
                  fontWeight: 600,
                }}
              >
                {error.category.toUpperCase()}
              </div>
              
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: '18px',
                }}
              >
                {error.fix_steps.length} Fix Steps
              </div>
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              color: '#64748B',
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            k8s-errors.dev
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`Error generating OG image: ${e.message}`)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
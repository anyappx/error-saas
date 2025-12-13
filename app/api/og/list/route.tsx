import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const title = category 
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} Kubernetes Errors`
      : 'Kubernetes Error Database'
    
    const subtitle = category
      ? `Complete troubleshooting guide for ${category} issues`
      : '150+ Expert Solutions & Fixes'

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
              padding: '60px',
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
              📚 Error Database
            </div>
            
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '30px',
                textAlign: 'center',
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
            
            <div
              style={{
                fontSize: 28,
                color: '#CBD5E1',
                textAlign: 'center',
                marginBottom: '40px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {!category && (
                <>
                  <div
                    style={{
                      backgroundColor: '#DC2626',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    AUTH
                  </div>
                  <div
                    style={{
                      backgroundColor: '#2563EB',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    NETWORK
                  </div>
                  <div
                    style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    RUNTIME
                  </div>
                  <div
                    style={{
                      backgroundColor: '#7C3AED',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    STORAGE
                  </div>
                </>
              )}
              
              {category && (
                <div
                  style={{
                    backgroundColor: category === 'auth' ? '#DC2626' :
                                   category === 'network' ? '#2563EB' :
                                   category === 'storage' ? '#7C3AED' :
                                   category === 'runtime' ? '#059669' :
                                   category === 'config' ? '#EA580C' :
                                   category === 'scheduler' ? '#0891B2' : '#6B7280',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '24px',
                    fontWeight: 700,
                  }}
                >
                  {category.toUpperCase()} ERRORS
                </div>
              )}
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              color: '#64748B',
              fontSize: '18px',
            }}
          >
            <div>Step-by-Step Fixes</div>
            <div>•</div>
            <div>Root Cause Analysis</div>
            <div>•</div>
            <div>k8s-errors.dev</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`Error generating list OG image: ${e.message}`)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
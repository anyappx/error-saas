import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  try {
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
            backgroundImage: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #1E293B 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              maxWidth: '900px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                background: 'linear-gradient(45deg, #F97316, #EAB308, #10B981)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                marginBottom: '30px',
                textAlign: 'center',
                lineHeight: 1,
              }}
            >
              🚀 K8S Error Intelligence
            </div>
            
            <div
              style={{
                fontSize: 32,
                color: '#FFFFFF',
                marginBottom: '40px',
                textAlign: 'center',
                lineHeight: 1.3,
                fontWeight: 600,
              }}
            >
              Instant Kubernetes Troubleshooting
            </div>
            
            <div
              style={{
                fontSize: 24,
                color: '#CBD5E1',
                textAlign: 'center',
                marginBottom: '50px',
                lineHeight: 1.4,
              }}
            >
              Upload error screenshots or paste messages for step-by-step fixes
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '48px' }}>📸</div>
                <div style={{ color: '#94A3B8', fontSize: '18px', textAlign: 'center' }}>
                  Upload<br />Screenshot
                </div>
              </div>
              
              <div style={{ color: '#6B7280', fontSize: '32px' }}>→</div>
              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '48px' }}>🔍</div>
                <div style={{ color: '#94A3B8', fontSize: '18px', textAlign: 'center' }}>
                  AI Analysis
                </div>
              </div>
              
              <div style={{ color: '#6B7280', fontSize: '32px' }}>→</div>
              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '48px' }}>🔧</div>
                <div style={{ color: '#94A3B8', fontSize: '18px', textAlign: 'center' }}>
                  Instant Fix
                </div>
              </div>
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              color: '#64748B',
              fontSize: '20px',
            }}
          >
            <div>150+ Errors Covered</div>
            <div>•</div>
            <div>Expert Solutions</div>
            <div>•</div>
            <div>100% Free</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`Error generating home OG image: ${e.message}`)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
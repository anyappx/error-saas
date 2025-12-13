/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic Turbopack config to avoid conflicts
  turbopack: {},
  
  // Production configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/k8s/:path*',
        destination: '/kubernetes/:path*',
        permanent: true
      }
    ]
  },

  // Output configuration for serverless
  output: 'standalone'
}

export default nextConfig
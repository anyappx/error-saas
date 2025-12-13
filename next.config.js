/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enhanced Turbopack config for path resolution
  turbopack: {
    resolveAlias: {
      '@': '.',
      '@/components': './components',
      '@/lib': './lib',
      '@/app': './app',
    },
  },
  
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
  output: 'standalone',

  // Experimental features for better compatibility
  experimental: {
    // Remove turbo config as it's not valid for Next.js 16
  },

  // Webpack fallback for path resolution
  webpack: (config) => {
    const path = require('path')
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/app': path.resolve(__dirname, 'app'),
    }
    return config
  },
}

module.exports = nextConfig
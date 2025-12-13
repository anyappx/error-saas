# K8S Error Intelligence - Production Deployment Guide

Complete guide for deploying K8S Error Intelligence to production using Vercel.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Vercel Deployment](#vercel-deployment)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Performance Optimization](#performance-optimization)
- [Security Checklist](#security-checklist)
- [CI/CD Pipeline](#cicd-pipeline)

## Prerequisites

### Required Accounts
- [Vercel](https://vercel.com) account (Pro plan recommended for production)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- GitHub account (for CI/CD)
- Domain registrar account (for custom domain)

### Local Development Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd error-saas

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

## Environment Configuration

### Required Environment Variables

Create these environment variables in Vercel dashboard:

#### Database
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
MONGODB_DB=k8s_errors_prod

# Alternative: MongoDB Connection String
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

#### Application Settings
```env
# Base URL (your production domain)
NEXT_PUBLIC_BASE_URL=https://k8s-errors.dev

# API Configuration
API_KEY=<generate-strong-api-key>
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Search Configuration
SEARCH_MAX_RESULTS=50
SEARCH_TIMEOUT=5000
```

#### Optional Services
```env
# Analytics (if using)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PLAUSIBLE_DOMAIN=k8s-errors.dev

# Error Tracking (recommended)
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=k8s-error-intelligence

# OCR Service (for production OCR)
GOOGLE_CLOUD_VISION_KEY=<api-key>
# OR
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=us-east-1
```

### Environment Variable Template
```bash
# Copy to Vercel environment variables
MONGODB_URI="your-mongodb-connection-string"
MONGODB_DB="k8s_errors_prod"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
API_KEY="your-secure-api-key-256-bit"
NODE_ENV="production"
```

## Database Setup

### MongoDB Atlas Configuration

1. **Create MongoDB Atlas Cluster**
   ```bash
   # Choose cloud provider and region
   # Recommended: AWS us-east-1 for Vercel compatibility
   # Cluster Tier: M2 or higher for production
   ```

2. **Database Security**
   ```javascript
   // Create database user with limited permissions
   db.createUser({
     user: "k8s_errors_prod",
     pwd: "secure-password-here",
     roles: [
       { role: "readWrite", db: "k8s_errors_prod" }
     ]
   })
   ```

3. **Network Access**
   ```text
   # Add to IP Access List:
   # 0.0.0.0/0 (for Vercel - they use dynamic IPs)
   # Or use Vercel's IP ranges if available
   ```

4. **Connection String**
   ```text
   mongodb+srv://k8s_errors_prod:<password>@cluster0.xxxxx.mongodb.net/k8s_errors_prod?retryWrites=true&w=majority
   ```

### Database Indexes (Performance)
```javascript
// Connect to your MongoDB and run these commands
use k8s_errors_prod

// Optimize search performance
db.errors.createIndex({ "canonical_slug": 1 })
db.errors.createIndex({ "category": 1 })
db.errors.createIndex({ "tool": 1 })
db.errors.createIndex({ "aliases": 1 })

// Text search index
db.errors.createIndex({
  "title": "text",
  "summary": "text",
  "aliases": "text"
}, {
  name: "error_search_index",
  weights: {
    "title": 10,
    "summary": 5,
    "aliases": 8
  }
})

// Compound indexes for filtering
db.errors.createIndex({ "tool": 1, "category": 1 })
db.errors.createIndex({ "category": 1, "canonical_slug": 1 })
```

## Vercel Deployment

### 1. Connect Repository to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project (run in project root)
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 2. Project Configuration

Create `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/errors",
      "destination": "/kubernetes/errors",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap.xml"
    },
    {
      "source": "/robots.txt",
      "destination": "/api/robots.txt"
    }
  ]
}
```

### 3. Build Configuration

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
  },
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
  async redirects() {
    return [
      {
        source: '/k8s/:path*',
        destination: '/kubernetes/:path*',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
```

## Domain Configuration

### 1. Custom Domain Setup

In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your domain: `k8s-errors.dev`
3. Add www subdomain: `www.k8s-errors.dev`
4. Configure DNS records at your domain registrar

### 2. DNS Configuration

Add these DNS records:
```text
Type: A
Name: @
Value: 76.76.19.61 (Vercel's IP)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.
- Verify HTTPS works: `https://k8s-errors.dev`
- Check certificate validity: Browser dev tools → Security tab

## Monitoring & Health Checks

### 1. Health Check Endpoint

Create `app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'

export async function GET() {
  try {
    // Test database connection
    const { client } = await connectToDatabase()
    await client.db().admin().ping()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'operational'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, { status: 503 })
  }
}
```

### 2. Uptime Monitoring

Set up monitoring with:
- [Uptime Robot](https://uptimerobot.com) (free)
- [Pingdom](https://pingdom.com)
- [Better Uptime](https://betteruptime.com)

Monitor these endpoints:
- `https://k8s-errors.dev/api/health`
- `https://k8s-errors.dev/kubernetes/errors/forbidden`
- `https://k8s-errors.dev/api/search?q=pod`

### 3. Performance Monitoring

#### Web Vitals Tracking
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Custom Performance Tracking
```typescript
// lib/analytics.ts
export function trackSearchPerformance(query: string, duration: number, results: number) {
  // Send to your analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search_performance', {
      query,
      duration_ms: duration,
      result_count: results
    })
  }
}
```

## Performance Optimization

### 1. Caching Strategy

#### API Response Caching
```typescript
// app/api/kubernetes/error/[slug]/route.ts
export async function GET(request: Request) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

#### Static Generation
```typescript
// app/kubernetes/errors/[slug]/page.tsx
export async function generateStaticParams() {
  return [
    { slug: 'forbidden' },
    { slug: 'imagepullbackoff' },
    // Generate for top 50 most common errors
  ]
}
```

### 2. Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
}
```

### 3. Bundle Optimization

```javascript
// Webpack Bundle Analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your next config
})
```

## Security Checklist

### 1. Environment Security
- ✅ No secrets in code repository
- ✅ Environment variables in Vercel dashboard only
- ✅ Strong database passwords (32+ characters)
- ✅ API rate limiting enabled
- ✅ CORS configured properly

### 2. API Security
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.ip || 'unknown'
  
  // Security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  return response
}
```

### 3. Database Security
- ✅ MongoDB user with minimal permissions
- ✅ Network access restricted
- ✅ Connection string encrypted
- ✅ Audit logs enabled
- ✅ Backup strategy implemented

## CI/CD Pipeline

### 1. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        
      - name: Run type check
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 2. Pre-deployment Checklist

Create automated checks:
```javascript
// scripts/pre-deploy-check.js
const checks = [
  'Environment variables configured',
  'Database connection working',
  'All tests passing',
  'Build successful',
  'No TypeScript errors',
  'Security headers configured',
  'Monitoring endpoints responding'
]

async function runPreDeploymentChecks() {
  // Implementation here
}
```

### 3. Post-deployment Validation

```javascript
// scripts/post-deploy-validate.js
async function validateDeployment() {
  const tests = [
    () => testHealthEndpoint(),
    () => testSearchAPI(),
    () => testErrorPages(),
    () => testStaticAssets(),
    () => testSEOMetadata()
  ]
  
  for (const test of tests) {
    await test()
  }
}
```

## Deployment Commands

### Quick Deployment
```bash
# Deploy to production
vercel --prod

# Deploy with environment check
npm run build && vercel --prod

# Deploy with custom domain
vercel --prod --domains=k8s-errors.dev
```

### Rollback Strategy
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url> --scope=<team>

# Rollback via Git
git revert <commit-hash>
git push origin main
```

## Monitoring Commands

```bash
# Check deployment status
vercel inspect <deployment-url>

# View logs
vercel logs <deployment-url>

# Check domain status
vercel domains ls

# Test health endpoint
curl https://k8s-errors.dev/api/health
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   vercel --force
   
   # Check build logs
   vercel logs <deployment-url>
   ```

2. **Database Connection Issues**
   ```javascript
   // Test connection locally
   node -e "
   const { MongoClient } = require('mongodb');
   MongoClient.connect(process.env.MONGODB_URI)
     .then(() => console.log('✅ Database connected'))
     .catch(err => console.error('❌ Database error:', err))
   "
   ```

3. **Environment Variable Issues**
   ```bash
   # List environment variables
   vercel env ls
   
   # Add missing variables
   vercel env add
   ```

## Support

- 📧 **Email**: support@k8s-errors.dev
- 🐛 **Issues**: GitHub Issues
- 📖 **Docs**: [Documentation Site]
- 💬 **Discord**: [Community Server]

---

**Next Steps**: After deployment, monitor the health endpoint and set up alerting for any issues.
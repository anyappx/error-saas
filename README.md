# Kubernetes Error Documentation Platform

Enterprise-grade Next.js application providing comprehensive Kubernetes error documentation and fixes.

## Installation & Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment setup:**
   Create `.env.local` with:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

3. **Seed database:**
   ```bash
   pnpm run seed
   ```

4. **Run development server:**
   ```bash
   pnpm dev
   ```

5. **Build for production:**
   ```bash
   pnpm build
   ```

## Architecture

### Stack
- Next.js 16 (App Router, TypeScript)
- MongoDB Atlas
- zod for validation
- pnpm package manager

### Key Features
- Deterministic error matching (no AI embeddings)
- Real source URLs for all fixes and causes
- SEO-optimized error detail pages
- Sitemap generation
- Structured data (JSON-LD)

### API Endpoints
- `POST /api/explain` - Analyze and explain Kubernetes errors
- `GET /api/kubernetes/error/[slug]` - Get specific error details
- `GET /sitemap.xml` - Main sitemap index
- `GET /sitemaps/kubernetes.xml` - Kubernetes errors sitemap
- `GET /robots.txt` - Robots configuration

### Database Schema
Two collections:
- `errors` - Canonical Kubernetes errors with causes, fixes, and sources
- `submissions` - User input tracking

## Implementation Status

✅ **Completed:**
- Project structure and dependencies
- MongoDB connection with caching
- Schema validation with zod
- Text normalization and deterministic matching
- All API endpoints
- Home page UI with textarea and results
- Error detail pages with SEO metadata
- Sitemap and robots.txt generation
- Seed script infrastructure

⏳ **In Progress:**
- Seed data (5/50 errors completed)

🔄 **Next Steps:**
- Complete remaining 45 canonical errors in seed data
- Test with MongoDB Atlas connectivity
- Validate all 10 gates

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm run seed` - Seed database with error data# error-saas

import Link from 'next/link'
import { ArrowRight, BookOpen, Search, Zap, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen stripe-bg-primary">
      {/* Navigation */}
      <header className="border-b border-gray-100 stripe-nav stripe-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-semibold text-gray-900 stripe-text-primary">ErrorDocs</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 stripe-nav-item">
                Documentation
              </Link>
              <Link href="/kubernetes" className="text-sm font-medium text-gray-600 hover:text-gray-900 stripe-nav-item">
                Kubernetes
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 stripe-nav-item">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="stripe-btn stripe-btn-secondary">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild className="stripe-btn stripe-btn-primary">
                <Link href="/dashboard">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 stripe-h1">
              Kubernetes Error Documentation
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto stripe-body">
              Comprehensive documentation and troubleshooting guide for Kubernetes errors, issues, and operational challenges. 
              Get instant solutions to complex container orchestration problems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="stripe-btn stripe-btn-primary">
                <Link href="/dashboard">
                  Explore documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="stripe-btn stripe-btn-secondary">
                <Link href="/kubernetes">
                  Browse errors
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 stripe-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 stripe-h2">
              Everything you need to troubleshoot Kubernetes
            </h2>
            <p className="text-lg text-gray-600 stripe-body">
              Enterprise-grade error documentation with real-world solutions and trusted sources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="stripe-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 stripe-h3">
                  Instant Error Search
                </h3>
                <p className="text-gray-600 stripe-body-small">
                  Search through thousands of documented Kubernetes errors with deterministic matching and get instant solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="stripe-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 stripe-h3">
                  Comprehensive Guides
                </h3>
                <p className="text-gray-600 stripe-body-small">
                  Detailed troubleshooting guides with step-by-step fixes, root cause analysis, and prevention strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="stripe-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 stripe-h3">
                  Trusted Sources
                </h3>
                <p className="text-gray-600 stripe-body-small">
                  All solutions link to official Kubernetes documentation and verified community resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 stripe-h2">
              Error categories we cover
            </h2>
            <p className="text-lg text-gray-600 stripe-body">
              From basic runtime issues to complex cluster management problems.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Runtime & Execution', count: '16 errors' },
              { name: 'Network & Connectivity', count: '12 errors' },
              { name: 'Authentication & Security', count: '8 errors' },
              { name: 'Configuration', count: '11 errors' },
              { name: 'Storage & Volumes', count: '9 errors' },
              { name: 'Scheduling', count: '6 errors' },
              { name: 'Cluster Management', count: '7 errors' },
              { name: 'Registry Issues', count: '5 errors' }
            ].map((category, index) => (
              <Card key={index} className="stripe-card hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-gray-900 mb-1 stripe-h6">{category.name}</h4>
                  <p className="text-sm text-gray-600 stripe-body-small">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 stripe-bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 stripe-h2">
            Ready to solve your Kubernetes challenges?
          </h2>
          <p className="text-lg text-gray-600 mb-8 stripe-body">
            Join thousands of developers and DevOps engineers who rely on our documentation.
          </p>
          <Button asChild size="lg" className="stripe-btn stripe-btn-primary">
            <Link href="/dashboard">
              Start exploring
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 stripe-h6">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Dashboard</Link></li>
                <li><Link href="/kubernetes" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Documentation</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 stripe-h6">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/learning-paths" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Learning Paths</Link></li>
                <li><Link href="/kubernetes/troubleshooting-checklist" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Troubleshooting</Link></li>
                <li><Link href="/errors" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Error Search</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 stripe-h6">Categories</h3>
              <ul className="space-y-2">
                <li><Link href="/errors?category=runtime" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Runtime</Link></li>
                <li><Link href="/errors?category=network" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Network</Link></li>
                <li><Link href="/errors?category=auth" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 stripe-h6">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900 stripe-nav-item">About</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900 stripe-nav-item">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600 stripe-body-small">
              © 2024 ErrorDocs. Enterprise Kubernetes troubleshooting documentation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
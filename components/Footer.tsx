'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kubernetes/errors" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kubernetes
                </Link>
              </li>
              <li>
                <Link href="/helm/errors" className="text-muted-foreground hover:text-foreground transition-colors">
                  Helm
                </Link>
              </li>
              <li>
                <Link href="/kubectl/errors" className="text-muted-foreground hover:text-foreground transition-colors">
                  kubectl
                </Link>
              </li>
              <li>
                <Link href="/docker/errors" className="text-muted-foreground hover:text-foreground transition-colors">
                  Docker
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kubernetes/errors?category=runtime" className="text-muted-foreground hover:text-foreground transition-colors">
                  Runtime
                </Link>
              </li>
              <li>
                <Link href="/kubernetes/errors?category=network" className="text-muted-foreground hover:text-foreground transition-colors">
                  Network
                </Link>
              </li>
              <li>
                <Link href="/kubernetes/errors?category=storage" className="text-muted-foreground hover:text-foreground transition-colors">
                  Storage
                </Link>
              </li>
              <li>
                <Link href="/kubernetes/errors?category=auth" className="text-muted-foreground hover:text-foreground transition-colors">
                  Authentication
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Search Errors
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-muted-foreground hover:text-foreground transition-colors">
                  Upload Screenshot
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="https://github.com/k8s-error-intelligence" className="text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">⚡</div>
              <div>
                <p className="text-sm font-semibold">K8S Error Intelligence</p>
                <p className="text-xs text-muted-foreground">Instant Kubernetes troubleshooting</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>150+ Errors</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>4 Tools</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>100% Free</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} K8S Error Intelligence. Built with ❤️ for the Kubernetes community.
            </p>
            <p className="mt-1">
              Not affiliated with the Cloud Native Computing Foundation or Kubernetes project.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
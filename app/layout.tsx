import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Kubernetes Error Documentation',
  description: 'Comprehensive documentation and troubleshooting guide for Kubernetes errors, issues, and operational challenges.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} docs-font`}>
        <header className="docs-header">
          <Link href="/" className="docs-logo">
            ErrorDocs
          </Link>
          <nav className="docs-nav">
            <Link href="/docs" className="docs-nav-link">Documentation</Link>
            <Link href="/kubernetes" className="docs-nav-link">Kubernetes</Link>
            <Link href="/pricing" className="docs-nav-link">Pricing</Link>
            
            <div className="docs-search">
              <input 
                type="text" 
                placeholder="Search..." 
                className="docs-search-input"
              />
            </div>
            
            <Link href="/dashboard" className="docs-btn-primary">Get Started</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
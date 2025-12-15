import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="docs-font">
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
          
          <Link href="/dashboard" className="docs-btn-primary">Get started</Link>
        </nav>
      </header>

      <main>
        <section className="docs-hero">
          <div className="docs-container">
            <div className="docs-hero-content">
              <h1>Kubernetes Error Documentation</h1>
              <p>
                The definitive resource for troubleshooting Kubernetes issues. Transform cryptic error messages into clear solutions with our comprehensive, AI-powered documentation platform.
              </p>
              <div className="docs-hero-buttons">
                <Link href="/dashboard" className="docs-btn-primary">Explore documentation</Link>
                <Link href="/kubernetes" className="docs-btn-secondary">Browse errors</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="docs-section">
          <div className="docs-container">
            <h2>Everything you need to troubleshoot Kubernetes</h2>
            <p>Transform cryptic error messages into actionable solutions. Our AI-powered platform helps you resolve issues faster than ever.</p>
            
            <div className="docs-grid">
              <div className="docs-card">
                <div className="docs-card-icon docs-card-icon-search">
                  🔍
                </div>
                <h3>Lightning-Fast Search</h3>
                <p>Find solutions in seconds, not hours. Our intelligent search understands context and matches your exact error patterns across 10,000+ documented issues.</p>
              </div>

              <div className="docs-card">
                <div className="docs-card-icon docs-card-icon-guide">
                  📚
                </div>
                <h3>Battle-Tested Solutions</h3>
                <p>Every solution comes from real production environments. Get step-by-step fixes, root cause analysis, and prevention strategies used by top engineering teams.</p>
              </div>

              <div className="docs-card">
                <div className="docs-card-icon docs-card-icon-trusted">
                  ✨
                </div>
                <h3>Always Up-to-Date</h3>
                <p>Stay ahead of the curve with solutions verified against the latest Kubernetes releases. Our documentation evolves with the ecosystem.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="docs-section-alt">
          <div className="docs-container">
            <h2>Error categories we cover</h2>
            <p>From basic runtime issues to complex cluster management problems.</p>
            
            <div className="docs-grid-small">
              <Link href="/errors?category=runtime" className="docs-category-card">
                <h4>Runtime & Execution</h4>
                <p>16 errors</p>
              </Link>
              <Link href="/errors?category=network" className="docs-category-card">
                <h4>Network & Connectivity</h4>
                <p>12 errors</p>
              </Link>
              <Link href="/errors?category=auth" className="docs-category-card">
                <h4>Authentication & Security</h4>
                <p>8 errors</p>
              </Link>
              <Link href="/errors?category=config" className="docs-category-card">
                <h4>Configuration</h4>
                <p>11 errors</p>
              </Link>
              <Link href="/errors?category=storage" className="docs-category-card">
                <h4>Storage & Volumes</h4>
                <p>9 errors</p>
              </Link>
              <Link href="/errors?category=scheduler" className="docs-category-card">
                <h4>Scheduling</h4>
                <p>6 errors</p>
              </Link>
              <Link href="/errors?category=cluster" className="docs-category-card">
                <h4>Cluster Management</h4>
                <p>7 errors</p>
              </Link>
              <Link href="/errors?category=registry" className="docs-category-card">
                <h4>Registry Issues</h4>
                <p>5 errors</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="docs-section">
          <div className="docs-container">
            <h2>Ready to solve your Kubernetes challenges?</h2>
            <p>Join thousands of developers and DevOps engineers who rely on our documentation.</p>
            <div style={{ textAlign: 'center' }}>
              <Link href="/dashboard" className="docs-btn-primary">Start exploring</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="docs-footer">
        <div className="docs-container">
          <div className="docs-footer-grid">
            <div>
              <h3>Product</h3>
              <ul>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/kubernetes">Documentation</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3>Resources</h3>
              <ul>
                <li><Link href="/learning-paths">Learning Paths</Link></li>
                <li><Link href="/kubernetes/troubleshooting-checklist">Troubleshooting</Link></li>
                <li><Link href="/errors">Error Search</Link></li>
              </ul>
            </div>
            <div>
              <h3>Categories</h3>
              <ul>
                <li><Link href="/errors?category=runtime">Runtime</Link></li>
                <li><Link href="/errors?category=network">Network</Link></li>
                <li><Link href="/errors?category=auth">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3>Company</h3>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="docs-footer-bottom">
            <p>© 2024 ErrorDocs. Enterprise Kubernetes troubleshooting documentation.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
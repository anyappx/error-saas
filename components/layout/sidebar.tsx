'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  AlertTriangle,
  Shield,
  Network,
  Database,
  Settings,
  Clock,
  Container,
  Server,
  BookOpen,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Crown
} from 'lucide-react'
import { Button } from '../ui/button'
import { EnterpriseBadge } from '../ui/enterprise-badge'
import { useState } from 'react'

const tools = [
  { name: 'Kubernetes', slug: 'kubernetes', icon: Container },
  { name: 'Docker', slug: 'docker', icon: Container },
  { name: 'Helm', slug: 'helm', icon: Settings },
  { name: 'kubectl', slug: 'kubectl', icon: Settings }
]

const categories = [
  { name: 'Authentication', slug: 'auth', icon: Shield, color: 'text-yellow-600' },
  { name: 'Network', slug: 'network', icon: Network, color: 'text-blue-600' },
  { name: 'Runtime', slug: 'runtime', icon: AlertTriangle, color: 'text-orange-600' },
  { name: 'Storage', slug: 'storage', icon: Database, color: 'text-green-600' },
  { name: 'Scheduling', slug: 'scheduling', icon: Clock, color: 'text-purple-600' },
  { name: 'Registry', slug: 'registry', icon: Container, color: 'text-red-600' },
  { name: 'Configuration', slug: 'config', icon: Settings, color: 'text-indigo-600' },
  { name: 'Cluster', slug: 'cluster', icon: Server, color: 'text-gray-600' }
]

export function Sidebar() {
  const pathname = usePathname()
  const [toolsExpanded, setToolsExpanded] = useState(true)
  const [categoriesExpanded, setCategoriesExpanded] = useState(true)
  
  return (
    <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6" />
          <span className="font-semibold text-sm">Kubernetes Error Docs</span>
        </Link>
        
        <nav className="space-y-6">
          {/* Quick Access */}
          <div>
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Documentation
            </h3>
            <div className="space-y-1">
              <Link 
                href="/dashboard" 
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                  pathname === '/dashboard' 
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                Overview
              </Link>
              <Link 
                href="/errors" 
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                  pathname === '/errors' 
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                Browse Errors
              </Link>
              <Link 
                href="/analysis" 
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors group",
                  pathname === '/analysis' 
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Bulk Analysis
                </div>
                <EnterpriseBadge size="sm" className="opacity-60 group-hover:opacity-100" />
              </Link>
            </div>
          </div>

          {/* Tools */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setToolsExpanded(!toolsExpanded)}
              className="w-full justify-between h-auto p-0 mb-2"
            >
              <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Tools
              </h3>
              {toolsExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
            {toolsExpanded && (
              <div className="space-y-1">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  const isActive = pathname.includes(`tool=${tool.slug}`)
                  return (
                    <Link
                      key={tool.slug}
                      href={`/errors?tool=${tool.slug}`}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {tool.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="w-full justify-between h-auto p-0 mb-2"
            >
              <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Categories
              </h3>
              {categoriesExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
            {categoriesExpanded && (
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon
                  const isActive = pathname.includes(`category=${category.slug}`)
                  return (
                    <Link
                      key={category.slug}
                      href={`/kubernetes/errors/${category.slug}`}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", category.color)} />
                      {category.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
        
        {/* Bottom CTA */}
        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Upgrade Available
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
              Get bulk analysis, exports, and priority support
            </p>
            <Button asChild size="sm" className="w-full text-xs h-8">
              <Link href="/pricing">
                View Plans
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
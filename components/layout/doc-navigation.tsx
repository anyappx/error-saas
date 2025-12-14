"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ChevronDown, 
  ChevronRight,
  Home,
  FileText,
  Activity,
  Network,
  Shield,
  Settings,
  Grid3X3,
  HardDrive,
  Server,
  BookOpen,
  AlertTriangle,
  Zap,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  count?: number
  badge?: string
}

interface NavSection {
  title: string
  href?: string
  collapsible?: boolean
  items?: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: "Getting Started",
    href: "/dashboard"
  },
  {
    title: "Kubernetes",
    href: "/kubernetes"
  },
  {
    title: "Error Categories",
    collapsible: true,
    items: [
      { title: "Runtime & Execution", href: "/kubernetes/runtime", count: 16 },
      { title: "Network & Connectivity", href: "/errors?category=network", count: 12 },
      { title: "Authentication & Security", href: "/errors?category=auth", count: 8 },
      { title: "Configuration", href: "/errors?category=config", count: 11 },
      { title: "Storage & Volumes", href: "/errors?category=storage", count: 9 },
      { title: "Scheduling", href: "/errors?category=scheduler", count: 6 },
      { title: "Cluster Management", href: "/errors?category=cluster", count: 7 },
    ]
  },
  {
    title: "Learning",
    collapsible: true,
    items: [
      { title: "Learning Paths", href: "/learning-paths" },
      { title: "Troubleshooting Guide", href: "/kubernetes/troubleshooting-checklist" },
      { title: "Best Practices", href: "/kubernetes/best-practices" }
    ]
  },
  {
    title: "Tools",
    collapsible: true,
    items: [
      { title: "Error Search", href: "/errors" },
      { title: "Bulk Analysis", href: "/analysis", badge: "Pro" }
    ]
  }
]

interface DocNavigationProps {
  onItemClick?: () => void
}

export function DocNavigation({ onItemClick }: DocNavigationProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Error Categories", "Learning", "Tools"
  ])

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(s => s !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === "/dashboard" && (pathname === "/" || pathname === "/dashboard")) return true
    if (href.includes("?category=")) {
      const category = new URL(`https://example.com${href}`).searchParams.get("category")
      // Use window.location for browser environment only
      const currentSearch = typeof window !== "undefined" ? window.location.search : ""
      const currentCategory = new URL(`https://example.com${pathname}${currentSearch}`).searchParams.get("category")
      return category === currentCategory
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleItemClick = () => {
    onItemClick?.()
  }

  return (
    <nav className="h-full overflow-y-auto bg-white border-r border-gray-200 stripe-bg-sidebar stripe-border-right">
      <div className="p-6">
        <div className="space-y-1">
          {navigation.map((section) => (
            <div key={section.title} className="stripe-sidebar-section">
              {section.href ? (
                <Link
                  href={section.href}
                  onClick={handleItemClick}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors stripe-sidebar-link",
                    isActive(section.href)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700 stripe-sidebar-link-active"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {section.title}
                </Link>
              ) : (
                <div className="py-2">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-md stripe-sidebar-title"
                  >
                    <span>{section.title}</span>
                    <ChevronRight className={cn(
                      "h-4 w-4 text-gray-400 transition-transform",
                      expandedSections.includes(section.title) && "rotate-90"
                    )} />
                  </button>

                  {section.items && expandedSections.includes(section.title) && (
                    <div className="mt-2 space-y-1 ml-4">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleItemClick}
                          className={cn(
                            "flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors stripe-sidebar-link",
                            isActive(item.href)
                              ? "bg-blue-50 text-blue-700 font-medium stripe-sidebar-link-active"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <span>{item.title}</span>
                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full stripe-badge stripe-badge-warning">
                                {item.badge}
                              </span>
                            )}
                            {item.count && (
                              <span className="text-xs text-gray-400 stripe-text-tertiary">
                                {item.count}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
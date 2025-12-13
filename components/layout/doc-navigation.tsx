"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface NavSection {
  title: string
  href?: string
  collapsible?: boolean
  pro?: boolean
  items?: NavItem[]
}

interface NavItem {
  title: string
  href: string
  count?: number
}

const navigation: NavSection[] = [
  {
    title: "Overview",
    href: "/dashboard",
  },
  {
    title: "Kubernetes Errors",
    collapsible: true,
    items: [
      { title: "Auth", href: "/errors?category=auth", count: 8 },
      { title: "Network", href: "/errors?category=network", count: 12 },
      { title: "Runtime", href: "/errors?category=runtime", count: 15 },
      { title: "Scheduler", href: "/errors?category=scheduler", count: 6 },
      { title: "Storage", href: "/errors?category=storage", count: 9 },
      { title: "Config", href: "/errors?category=config", count: 11 },
      { title: "Cluster", href: "/errors?category=cluster", count: 7 },
    ],
  },
  {
    title: "Tools",
    collapsible: true,
    items: [
      { title: "Docker", href: "/tools/docker" },
      { title: "Helm", href: "/tools/helm" },
      { title: "kubectl", href: "/tools/kubectl" },
      { title: "CNI", href: "/tools/cni" },
    ],
  },
  {
    title: "Bulk Analysis",
    href: "/analysis",
    pro: true,
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
]

export function DocNavigation() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Kubernetes Errors",
    "Tools",
  ])

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(s => s !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/") return true
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <aside className="w-[280px] bg-white border-r border-slate-200 flex-shrink-0 h-full overflow-y-auto">
      <nav className="p-6 space-y-1">
        {navigation.map((section) => (
          <div key={section.title}>
            {section.href ? (
              // Direct link
              <Link
                href={section.href}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-sm leading-5 rounded-md transition-colors",
                  isActive(section.href)
                    ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className="flex items-center gap-2">
                  {section.title}
                  {section.pro && (
                    <Badge variant="secondary" className="text-xs h-5 px-1.5">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </span>
              </Link>
            ) : (
              // Collapsible section
              <div>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm leading-5 font-medium text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <span>{section.title}</span>
                  {section.collapsible && (
                    expandedSections.includes(section.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </button>

                {section.items && expandedSections.includes(section.title) && (
                  <div className="mt-1 ml-3 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 text-sm leading-5 rounded-md transition-colors",
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <span>{item.title}</span>
                        {item.count && (
                          <Badge variant="outline" className="text-xs">
                            {item.count}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
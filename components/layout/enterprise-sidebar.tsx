"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Database,
  FileText,
  GitBranch,
  HelpCircle,
  Home,
  Layers,
  Monitor,
  Package,
  Search,
  Settings,
  Shield,
  Users,
  Zap,
  Bot,
  Camera,
  Filter,
  Activity,
  Globe,
  Lock,
  Calendar,
  Inbox,
  Archive
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SidebarItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: SidebarItem[]
  shortcut?: string
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    shortcut: "⌘D"
  },
  {
    title: "Error Explorer",
    href: "/errors",
    icon: Search,
    badge: "2.4k",
    shortcut: "⌘E",
    children: [
      { title: "All Errors", href: "/errors", icon: Archive },
      { title: "Kubernetes", href: "/errors?tool=kubernetes", icon: Package },
      { title: "Docker", href: "/errors?tool=docker", icon: Package },
      { title: "Helm", href: "/errors?tool=helm", icon: Package },
    ]
  },
  {
    title: "Incidents",
    href: "/incidents",
    icon: AlertTriangle,
    badge: 3,
    shortcut: "⌘I",
    children: [
      { title: "Active", href: "/incidents?status=active", icon: Activity },
      { title: "Resolved", href: "/incidents?status=resolved", icon: Archive },
      { title: "All Incidents", href: "/incidents", icon: Inbox },
    ]
  },
  {
    title: "Clusters",
    href: "/clusters",
    icon: Database,
    shortcut: "⌘C"
  },
  {
    title: "AI Assistant",
    href: "/assistant",
    icon: Bot,
    shortcut: "⌘A"
  },
  {
    title: "Screenshot Analyzer",
    href: "/screenshot",
    icon: Camera,
    shortcut: "⌘S"
  },
  {
    title: "Analytics",
    icon: BarChart3,
    children: [
      { title: "Overview", href: "/analytics", icon: Activity },
      { title: "Error Trends", href: "/analytics/trends", icon: BarChart3 },
      { title: "Performance", href: "/analytics/performance", icon: Zap },
      { title: "Usage", href: "/analytics/usage", icon: Monitor },
    ]
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: GitBranch,
    children: [
      { title: "AWS", href: "/integrations/aws", icon: Globe },
      { title: "GCP", href: "/integrations/gcp", icon: Globe },
      { title: "Azure", href: "/integrations/azure", icon: Globe },
      { title: "Webhooks", href: "/integrations/webhooks", icon: Zap },
    ]
  },
  {
    title: "Team",
    icon: Users,
    children: [
      { title: "Members", href: "/team/members", icon: Users },
      { title: "Organizations", href: "/team/organizations", icon: Building2 },
      { title: "Projects", href: "/team/projects", icon: Layers },
      { title: "Audit Logs", href: "/team/audit", icon: Shield },
    ]
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: BookOpen
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Profile", href: "/settings/profile", icon: Users },
      { title: "Notifications", href: "/settings/notifications", icon: Bell },
      { title: "Security", href: "/settings/security", icon: Lock },
      { title: "Billing", href: "/settings/billing", icon: CreditCard },
      { title: "API Keys", href: "/settings/api", icon: Shield },
    ]
  },
  {
    title: "Support",
    href: "/support",
    icon: HelpCircle
  },
]

interface EnterpriseSidebarProps {
  className?: string
}

export function EnterpriseSidebar({ className }: EnterpriseSidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set())

  const toggleSection = (title: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(title)) {
      newOpenSections.delete(title)
    } else {
      newOpenSections.add(title)
    }
    setOpenSections(newOpenSections)
  }

  const isActive = (href: string) => pathname === href
  const isChildActive = (children: SidebarItem[]) =>
    children.some(child => child.href && pathname === child.href)

  React.useEffect(() => {
    // Auto-expand sections with active children
    sidebarItems.forEach(item => {
      if (item.children && isChildActive(item.children)) {
        setOpenSections(prev => new Set(prev).add(item.title))
      }
    })
  }, [pathname])

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = openSections.has(item.title)
    
    if (hasChildren) {
      return (
        <Collapsible
          key={item.title}
          open={isExpanded}
          onOpenChange={() => toggleSection(item.title)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 px-3 py-2 h-auto font-normal",
                level > 0 && "pl-6",
                isChildActive(item.children!) && "bg-accent text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link key={item.title} href={item.href!}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 px-3 py-2 h-auto font-normal",
            level > 0 && "pl-6",
            isActive(item.href!) && "bg-accent text-accent-foreground"
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto">
              {item.badge}
            </Badge>
          )}
          {item.shortcut && (
            <kbd className="ml-auto hidden lg:inline-block pointer-events-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              {item.shortcut}
            </kbd>
          )}
        </Button>
      </Link>
    )
  }

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Platform
          </h2>
          <div className="space-y-1">
            {sidebarItems.slice(0, 6).map(item => renderSidebarItem(item))}
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Management
          </h2>
          <div className="space-y-1">
            {sidebarItems.slice(6, 9).map(item => renderSidebarItem(item))}
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Support
          </h2>
          <div className="space-y-1">
            {sidebarItems.slice(9).map(item => renderSidebarItem(item))}
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="px-3 py-2 border-t">
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="text-sm font-medium mb-2">Today's Activity</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>New Errors</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span>Incidents</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span>Resolution Rate</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
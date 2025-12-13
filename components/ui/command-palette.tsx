"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command"
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Building2,
  Calculator,
  Calendar,
  CreditCard,
  Database,
  FileText,
  Home,
  Monitor,
  Package,
  Search,
  Settings,
  Shield,
  Users,
  Zap,
  Bot,
  Camera,
  Globe,
  GitBranch,
  HelpCircle
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  shortcut?: string
  group: string
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState('')

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      description: 'Go to main dashboard',
      icon: Home,
      action: () => router.push('/dashboard'),
      shortcut: '⌘D',
      group: 'Navigation'
    },
    {
      id: 'nav-errors',
      title: 'Error Explorer',
      description: 'Browse and search errors',
      icon: Search,
      action: () => router.push('/errors'),
      shortcut: '⌘E',
      group: 'Navigation'
    },
    {
      id: 'nav-incidents',
      title: 'Incidents',
      description: 'Manage incidents and alerts',
      icon: AlertTriangle,
      action: () => router.push('/incidents'),
      shortcut: '⌘I',
      group: 'Navigation'
    },
    {
      id: 'nav-clusters',
      title: 'Clusters',
      description: 'View cluster status',
      icon: Database,
      action: () => router.push('/clusters'),
      shortcut: '⌘C',
      group: 'Navigation'
    },
    {
      id: 'nav-analytics',
      title: 'Analytics',
      description: 'View metrics and insights',
      icon: BarChart3,
      action: () => router.push('/analytics'),
      group: 'Navigation'
    },
    {
      id: 'nav-assistant',
      title: 'AI Assistant',
      description: 'Open AI assistant',
      icon: Bot,
      action: () => {
        // This would trigger the assistant panel
        const event = new CustomEvent('toggle-assistant')
        window.dispatchEvent(event)
      },
      shortcut: '⌘A',
      group: 'Navigation'
    },

    // Tools
    {
      id: 'tool-screenshot',
      title: 'Screenshot Analyzer',
      description: 'Analyze error screenshots',
      icon: Camera,
      action: () => router.push('/screenshot'),
      shortcut: '⌘S',
      group: 'Tools'
    },
    {
      id: 'tool-search',
      title: 'Global Search',
      description: 'Search across all data',
      icon: Search,
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      },
      shortcut: '⌘/',
      group: 'Tools'
    },

    // Quick Actions
    {
      id: 'action-new-incident',
      title: 'Create New Incident',
      description: 'Start incident response',
      icon: AlertTriangle,
      action: () => router.push('/incidents/new'),
      group: 'Quick Actions'
    },
    {
      id: 'action-export-data',
      title: 'Export Data',
      description: 'Export error data',
      icon: FileText,
      action: () => {
        // Implement export functionality
        console.log('Export data')
      },
      group: 'Quick Actions'
    },

    // Settings
    {
      id: 'settings-profile',
      title: 'Profile Settings',
      description: 'Manage your profile',
      icon: Users,
      action: () => router.push('/settings/profile'),
      group: 'Settings'
    },
    {
      id: 'settings-security',
      title: 'Security Settings',
      description: 'Manage security preferences',
      icon: Shield,
      action: () => router.push('/settings/security'),
      group: 'Settings'
    },
    {
      id: 'settings-billing',
      title: 'Billing',
      description: 'View billing information',
      icon: CreditCard,
      action: () => router.push('/settings/billing'),
      group: 'Settings'
    },

    // Help
    {
      id: 'help-docs',
      title: 'Documentation',
      description: 'View documentation',
      icon: BookOpen,
      action: () => router.push('/docs'),
      group: 'Help'
    },
    {
      id: 'help-support',
      title: 'Contact Support',
      description: 'Get help from support',
      icon: HelpCircle,
      action: () => router.push('/support'),
      group: 'Help'
    },

    // Common Errors
    {
      id: 'error-imagepullbackoff',
      title: 'ImagePullBackOff',
      description: 'View ImagePullBackOff error details',
      icon: Package,
      action: () => router.push('/errors/imagepullbackoff'),
      group: 'Common Errors'
    },
    {
      id: 'error-crashloopbackoff',
      title: 'CrashLoopBackOff',
      description: 'View CrashLoopBackOff error details',
      icon: Package,
      action: () => router.push('/errors/crashloopbackoff'),
      group: 'Common Errors'
    },
    {
      id: 'error-failedscheduling',
      title: 'FailedScheduling',
      description: 'View FailedScheduling error details',
      icon: Calendar,
      action: () => router.push('/errors/failedscheduling'),
      group: 'Common Errors'
    },
  ]

  const filteredCommands = React.useMemo(() => {
    if (!search) return commands
    
    return commands.filter(command => 
      command.title.toLowerCase().includes(search.toLowerCase()) ||
      command.description?.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, commands])

  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    
    filteredCommands.forEach(command => {
      if (!groups[command.group]) {
        groups[command.group] = []
      }
      groups[command.group].push(command)
    })
    
    return groups
  }, [filteredCommands])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const runCommand = (command: CommandItem) => {
    onOpenChange(false)
    setSearch('')
    command.action()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search for commands, errors, or navigate..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {Object.entries(groupedCommands).map(([group, commands], index) => (
          <React.Fragment key={group}>
            <CommandGroup heading={group}>
              {commands.map((command) => {
                const Icon = command.icon
                return (
                  <CommandItem
                    key={command.id}
                    value={command.title}
                    onSelect={() => runCommand(command)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="flex-1">{command.title}</span>
                    {command.description && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {command.description}
                      </span>
                    )}
                    {command.shortcut && (
                      <CommandShortcut>{command.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {index < Object.entries(groupedCommands).length - 1 && <CommandSeparator />}
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
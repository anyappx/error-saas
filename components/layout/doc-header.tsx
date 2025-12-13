import Link from "next/link"
import { Search, Github, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface DocHeaderProps {
  onToggleAI?: () => void
  showAIToggle?: boolean
}

export function DocHeader({ onToggleAI, showAIToggle = false }: DocHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex-shrink-0">
      <div className="h-full flex items-center justify-between">
        {/* Left: Branding - Text-based, minimal */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-lg font-semibold text-slate-900 hover:text-slate-700">
            Kubernetes Error Docs
          </Link>
        </div>

        {/* Center: Search - 400px width */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search Kubernetes errors (e.g. CrashLoopBackOff)"
              className="pl-10 w-full h-10 rounded-md border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="flex items-center gap-1">
            <Link href="/analysis">
              Bulk Analysis
              <Badge variant="secondary" className="text-xs ml-1">Pro</Badge>
            </Link>
          </Button>
          {showAIToggle && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleAI}
              className="flex items-center gap-1"
            >
              <Bot className="h-4 w-4" />
              AI Assistant
            </Button>
          )}
          <Button variant="ghost" size="sm" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
import Link from "next/link"
import { Search, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function DocHeader() {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex-1">
          <Link href="/" className="flex flex-col">
            <h1 className="text-xl font-semibold text-slate-900">
              Kubernetes Error Documentation
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Enterprise-grade troubleshooting reference
            </p>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search Kubernetes errors (e.g. CrashLoopBackOff)"
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link href="/analysis">
              Bulk Analysis
              <Badge variant="secondary" className="text-xs">Pro</Badge>
            </Link>
          </Button>
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
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Search, 
  Command, 
  Menu,
  BookOpen,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface EnterpriseHeaderProps {
  onMenuToggle?: () => void
  onCommandPaletteOpen?: () => void
}

export function EnterpriseHeader({ 
  onMenuToggle, 
  onCommandPaletteOpen 
}: EnterpriseHeaderProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 px-0 text-base hover:bg-transparent focus:bg-transparent md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo */}
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white dark:text-slate-900" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-semibold text-lg leading-tight text-slate-900 dark:text-slate-100">Kubernetes</span>
              <span className="text-xs text-slate-500 leading-tight">Error Documentation</span>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search error documentation..."
              className="pl-8 md:w-[300px] lg:w-[500px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/errors?q=${encodeURIComponent(searchQuery)}`
                }
              }}
            />
            <div className="absolute right-2 top-2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button asChild variant="outline" size="sm" className="hidden md:flex">
            <a href="https://kubernetes.io/docs" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Official Docs
            </a>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onCommandPaletteOpen}
            className="hidden md:inline-flex"
          >
            <Command className="h-4 w-4" />
            <span className="sr-only">Open command palette</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { EnterpriseHeader } from "./enterprise-header"
import { Sidebar } from "./sidebar"
import { AIAssistant } from "../ai/ai-assistant"
import { CommandPalette } from "../ui/command-palette"

interface EnterpriseLayoutProps {
  children: React.ReactNode
  className?: string
}

export function EnterpriseLayout({ children, className }: EnterpriseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false)
  const [assistantOpen, setAssistantOpen] = React.useState(false)

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case "k":
            event.preventDefault()
            setCommandPaletteOpen(true)
            break
          case "j":
            event.preventDefault()
            setAssistantOpen(!assistantOpen)
            break
          case "b":
            event.preventDefault()
            setSidebarOpen(!sidebarOpen)
            break
          case "/":
            event.preventDefault()
            // Focus search in header
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
            }
            break
        }
      }

      // Escape key handling
      if (event.key === "Escape") {
        setCommandPaletteOpen(false)
        setAssistantOpen(false)
        setSidebarOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [sidebarOpen, assistantOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <EnterpriseHeader
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 transition-transform duration-200",
            "hidden lg:block",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main
          className={cn(
            "flex-1 transition-all duration-200",
            "lg:ml-64",
            assistantOpen && "lg:mr-80"
          )}
        >
          <div className={cn("container mx-auto px-4 py-6", className)}>
            {children}
          </div>
        </main>

        {/* AI Assistant */}
        <aside
          className={cn(
            "fixed right-0 top-16 z-30 h-[calc(100vh-4rem)] w-80 shrink-0 border-l bg-background transition-transform duration-200",
            assistantOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <AIAssistant onClose={() => setAssistantOpen(false)} />
        </aside>

        {/* Assistant overlay for mobile */}
        {assistantOpen && (
          <div
            className="fixed inset-0 top-16 z-20 bg-black/50 lg:hidden"
            onClick={() => setAssistantOpen(false)}
          />
        )}
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Global keyboard shortcut hints */}
      <div className="fixed bottom-4 right-4 z-50 hidden lg:block">
        <div className="rounded-lg bg-muted p-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none select-none rounded border bg-background px-1.5 py-0.5 font-mono">
              ⌘K
            </kbd>
            <span>Command</span>
          </div>
        </div>
      </div>
    </div>
  )
}
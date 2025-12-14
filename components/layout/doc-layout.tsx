"use client"

import { useState, useEffect } from "react"
import { DocHeader } from "./doc-header"
import { DocNavigation } from "./doc-navigation"
import { cn } from "@/lib/utils"

interface DocLayoutProps {
  children: React.ReactNode
  showAIAssistant?: boolean
}

export function DocLayout({ children, showAIAssistant = false }: DocLayoutProps) {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsMobileNavOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile nav when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileNavOpen) setIsMobileNavOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobileNavOpen])

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <DocHeader 
        onToggleNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
      />
      
      <div className="flex flex-1 relative">
        {/* Mobile Overlay */}
        {isMobile && isMobileNavOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={cn(
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-80",
          "lg:sticky lg:z-auto",
          "transform transition-transform duration-300 ease-in-out",
          isMobile && !isMobileNavOpen ? "-translate-x-full" : "translate-x-0",
          "lg:translate-x-0"
        )}>
          <DocNavigation onItemClick={() => setIsMobileNavOpen(false)} />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
            <div className="prose prose-gray max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
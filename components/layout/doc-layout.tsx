"use client"

import { useState } from "react"
import { DocHeader } from "./doc-header"
import { DocNavigation } from "./doc-navigation"

interface DocLayoutProps {
  children: React.ReactNode
  showAIAssistant?: boolean
}

export function DocLayout({ children, showAIAssistant = false }: DocLayoutProps) {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

  return (
    <div className="flex flex-col w-full min-h-screen max-w-[1400px] mx-auto">
      {/* Fixed Header - 64px */}
      <DocHeader 
        onToggleAI={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        showAIToggle={showAIAssistant}
      />
      
      <div className="flex flex-1">
        {/* Left Sidebar - 280px fixed */}
        <DocNavigation />
        
        {/* Main Content Area - 720px max-width, centered */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[720px] mx-auto px-12 py-12">
            {children}
          </div>
        </main>
        
        {/* AI Assistant Panel - 320px fixed, collapsible */}
        {showAIAssistant && (
          <aside 
            className={`w-80 bg-slate-50 border-l border-slate-200 transition-transform duration-200 ${
              isAIAssistantOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">AI Assistant</h3>
                <button 
                  onClick={() => setIsAIAssistantOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
              <div className="text-sm text-slate-600">
                AI assistance panel content will go here
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
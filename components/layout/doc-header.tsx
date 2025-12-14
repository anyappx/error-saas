"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X, Command } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocHeaderProps {
  onToggleNav?: () => void
  isMobileNavOpen?: boolean
}

export function DocHeader({ 
  onToggleNav, 
  isMobileNavOpen = false 
}: DocHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left: Logo */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden -ml-2 mr-2 p-2"
            onClick={onToggleNav}
          >
            {isMobileNavOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-semibold text-gray-900">ErrorDocs</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search docs..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/kubernetes" className="text-sm text-gray-600 hover:text-gray-900">
              Docs
            </Link>
            <Link href="/learning-paths" className="text-sm text-gray-600 hover:text-gray-900">
              Learn
            </Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
          </nav>
          
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/analysis">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
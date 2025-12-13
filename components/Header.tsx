'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="text-2xl">⚡</div>
            <span className="hidden font-bold sm:inline-block">
              K8S Error Intelligence
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/kubernetes/errors"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Errors
            </Link>
            <Link 
              href="/search"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Search
            </Link>
            <Link 
              href="/categories"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Categories
            </Link>
            <Link 
              href="/tools"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Tools
            </Link>
          </nav>
        </div>
        
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="mr-2 text-2xl">⚡</span>
          <span className="font-bold">K8S Errors</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" size="sm" className="h-8 w-full justify-start text-sm font-normal md:w-40 lg:w-64">
              <span className="hidden lg:inline-flex">Search errors...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
          
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="sr-only">Dashboard</span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">GitHub</span>
            </Button>
          </nav>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="border-t px-7 pb-6 pt-4 md:hidden">
          <nav className="grid gap-2">
            <Link href="/kubernetes/errors" className="block px-2 py-1 text-lg">
              Errors
            </Link>
            <Link href="/search" className="block px-2 py-1 text-lg">
              Search
            </Link>
            <Link href="/categories" className="block px-2 py-1 text-lg">
              Categories
            </Link>
            <Link href="/tools" className="block px-2 py-1 text-lg">
              Tools
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
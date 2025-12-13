import { DocHeader } from "./doc-header"
import { DocNavigation } from "./doc-navigation"

interface DocLayoutProps {
  children: React.ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <DocHeader />
      <div className="flex flex-1">
        <DocNavigation />
        <main className="flex-1 max-w-none">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
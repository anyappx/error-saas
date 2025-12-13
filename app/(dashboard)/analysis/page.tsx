import { Metadata } from "next"
import Link from "next/link"
import { BulkAnalysis } from "@/components/enterprise/bulk-analysis"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Bulk Analysis - Kubernetes Error Documentation",
  description: "Analyze multiple Kubernetes errors simultaneously to identify patterns and root causes.",
  keywords: ["kubernetes", "bulk analysis", "error patterns", "troubleshooting"]
}

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
          <Link href="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-300">
            Documentation
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 dark:text-slate-100">Bulk Analysis</span>
        </nav>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Bulk Error Analysis
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
              Analyze multiple Kubernetes errors simultaneously to identify patterns, 
              cluster similar issues, and get comprehensive insights for faster resolution.
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Analysis Component */}
      <BulkAnalysis />

      {/* Usage Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Analysis Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• Paste error messages from logs, kubectl output, or monitoring alerts</li>
          <li>• Include context like timestamps and pod names for better clustering</li>
          <li>• Mix different error types to identify cross-system patterns</li>
          <li>• Use the pattern detection to prioritize which errors to fix first</li>
        </ul>
      </div>
    </div>
  )
}
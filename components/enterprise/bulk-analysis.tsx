"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { EnterpriseBadge } from "../ui/enterprise-badge"
import { UpgradeNotice } from "./upgrade-notice"
import { hasFeature } from "../../lib/features"
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Download,
  Loader2
} from "lucide-react"

export function BulkAnalysis() {
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  
  const hasBulkAccess = hasFeature("BULK_ANALYSIS")
  const hasExportAccess = hasFeature("EXPORT_REPORTS")

  const handleAnalyze = async () => {
    if (!hasBulkAccess) return
    
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setAnalysis({
        totalErrors: 15,
        categories: {
          "network": 6,
          "auth": 4, 
          "storage": 3,
          "config": 2
        },
        topPatterns: [
          { pattern: "Connection timeout", count: 4, confidence: 0.92 },
          { pattern: "Certificate expiry", count: 3, confidence: 0.88 },
          { pattern: "Permission denied", count: 2, confidence: 0.85 }
        ]
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleExport = () => {
    // Would handle export logic
    alert("Export functionality requires Pro or Team plan")
  }

  if (!hasBulkAccess) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Bulk Error Analysis
                </CardTitle>
                <CardDescription>
                  Analyze multiple errors at once to identify patterns and clusters
                </CardDescription>
              </div>
              <EnterpriseBadge />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Paste multiple error messages or log excerpts here..."
                className="min-h-32 font-mono text-sm"
                disabled
              />
              <Button disabled className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Analyze Errors
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <UpgradeNotice 
          feature="Bulk Error Analysis"
          description="Analyze up to 100 errors simultaneously, identify patterns, and get clustered insights to resolve issues faster."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Error Analysis
            <EnterpriseBadge />
          </CardTitle>
          <CardDescription>
            Analyze multiple errors to identify patterns and clusters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste multiple error messages or log excerpts here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-32 font-mono text-sm"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={!input.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Analyze Errors
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {analysis.totalErrors}
                  </div>
                  <div className="text-sm text-slate-500">Total Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {Object.keys(analysis.categories).length}
                  </div>
                  <div className="text-sm text-slate-500">Categories</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Category Breakdown</h4>
                {Object.entries(analysis.categories).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category}</span>
                    <Badge variant="outline">{count as number}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Pattern Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.topPatterns.map((pattern: any, index: number) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{pattern.pattern}</span>
                    <Badge variant="outline">{pattern.count}×</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${pattern.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {Math.round(pattern.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base">
                  <Download className="h-4 w-4" />
                  Export Analysis
                </span>
                {!hasExportAccess && <EnterpriseBadge size="sm" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleExport}
                  disabled={!hasExportAccess}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExport}
                  disabled={!hasExportAccess}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Markdown
                </Button>
              </div>
              {!hasExportAccess && (
                <p className="text-xs text-slate-500 mt-2">
                  Available in Pro and Team plans
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
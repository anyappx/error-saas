import { DocLayout } from "@/components/layout/doc-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Zap, Lock } from "lucide-react"
import Link from "next/link"

export default function AnalysisPage() {
  return (
    <DocLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">Bulk Analysis</h1>
            <Badge className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Pro Feature
            </Badge>
          </div>
          <p className="text-slate-600">
            AI-powered analysis of multiple Kubernetes errors and log files
          </p>
        </div>

        {/* Preview Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 mb-1">Preview — Pro Feature</h3>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Bulk Analysis allows you to upload log files, error dumps, and kubectl outputs 
                  for intelligent analysis across multiple errors simultaneously.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Multi-Error Analysis</CardTitle>
              <CardDescription>
                Analyze patterns across multiple related Kubernetes errors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Detect cascading failure patterns</li>
                <li>• Identify root cause relationships</li>
                <li>• Generate comprehensive fix strategies</li>
                <li>• Export detailed analysis reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Log File Processing</CardTitle>
              <CardDescription>
                Upload and process kubectl outputs and cluster logs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Support for kubectl describe outputs</li>
                <li>• Container log analysis</li>
                <li>• Event timeline reconstruction</li>
                <li>• Automated error extraction</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Pricing CTA */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Upgrade to Pro</h3>
                <p className="text-slate-600">
                  Get access to bulk analysis, priority support, and advanced features
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button asChild>
                  <Link href="/pricing">
                    View Pricing Plans
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">
                    Continue with Free
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocLayout>
  )
}
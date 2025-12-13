import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Clock, Users, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { DocLayout } from "@/components/layout/doc-layout"

export const metadata: Metadata = {
  title: "Pricing - Kubernetes Error Documentation",
  description: "Simple, transparent pricing for Kubernetes error analysis and documentation tools.",
  keywords: ["kubernetes", "pricing", "error analysis", "documentation tools"]
}

const features = {
  free: [
    "Complete error documentation access",
    "Search across all error types",
    "Root cause analysis",
    "Fix procedures and examples",
    "Community support via GitHub"
  ],
  pro: [
    "Everything in Free",
    "Bulk error analysis (up to 100 errors)",
    "Error pattern clustering",
    "Export reports (PDF, Markdown)",
    "Email support (48h response)"
  ],
  team: [
    "Everything in Pro", 
    "Unlimited bulk analysis",
    "Team workspaces and sharing",
    "Custom webhook integrations",
    "Priority support (4h response)",
    "Usage analytics and insights"
  ]
}

const faqs = [
  {
    question: "Can I upgrade or downgrade at any time?",
    answer: "Yes, you can change your plan at any time. Changes take effect immediately, with prorated billing."
  },
  {
    question: "Is the free tier really free forever?",
    answer: "Yes, our core documentation remains free forever. We believe error documentation should be accessible to everyone."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and PayPal. Enterprise customers can pay via invoice."
  },
  {
    question: "Do you offer team discounts?",
    answer: "Yes, we offer volume discounts for teams over 10 users. Contact us for custom pricing."
  }
]

export default function PricingPage() {
  return (
    <DocLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Pricing
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your team's Kubernetes documentation needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Free</CardTitle>
              <CardDescription>Perfect for individual developers</CardDescription>
              <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-slate-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-indigo-200 relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Crown className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-lg">Pro</CardTitle>
              <CardDescription>For teams and professionals</CardDescription>
              <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-slate-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Team Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team</CardTitle>
              <CardDescription>For larger teams and organizations</CardDescription>
              <div className="text-3xl font-bold">$99<span className="text-sm font-normal text-slate-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                {features.team.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>


        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium text-slate-900">{faq.question}</h4>
                <p className="text-sm text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </DocLayout>
  )
}
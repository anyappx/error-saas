import { Metadata } from "next"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Check, ArrowLeft, Clock, Users, Zap } from "lucide-react"
import { PRICING_TIERS } from "../../lib/features"
import { cn } from "../../lib/utils"

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
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <nav className="flex items-center justify-center space-x-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-300">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">Pricing</span>
        </nav>
        
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose the plan that fits your team's needs. Start free, upgrade when you need advanced analysis tools.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
        {Object.entries(PRICING_TIERS).map(([key, tier]) => (
          <Card key={key} className={cn(
            "relative border-2",
            key === 'PRO' && "border-blue-200 shadow-lg scale-105"
          )}>
            {key === 'PRO' && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription className="text-base">
                {tier.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  ${tier.price}
                </span>
                {tier.price > 0 && (
                  <span className="text-slate-500">/month per user</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {features[key.toLowerCase() as keyof typeof features].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={key === 'PRO' ? "default" : "outline"}
                size="lg"
              >
                {tier.price === 0 ? "Get Started Free" : "Start Free Trial"}
              </Button>
              
              {tier.price > 0 && (
                <p className="text-xs text-center text-slate-500">
                  14-day free trial • No credit card required
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Value Proposition */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-8">
          Why teams choose our platform
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Save 80% debugging time
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Instantly find root causes instead of searching through logs for hours
            </p>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Share knowledge
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Build institutional knowledge that survives team changes
            </p>
          </div>
          <div className="text-center">
            <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Prevent incidents
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Learn from patterns to prevent similar issues in the future
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-slate-50 dark:bg-slate-900 rounded-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Need something custom?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          We work with enterprise teams to create custom solutions for complex infrastructure needs.
        </p>
        <Button variant="outline">
          Contact Sales
        </Button>
      </div>

      {/* Back to Documentation */}
      <div className="text-center">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documentation
          </Link>
        </Button>
      </div>
    </div>
  )
}
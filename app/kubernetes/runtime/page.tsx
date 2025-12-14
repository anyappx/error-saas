import Link from "next/link"
import { Metadata } from "next"
import { 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { safeFindErrors } from "@/lib/dbFallback"

export const metadata: Metadata = {
  title: "Kubernetes Runtime & Execution Errors - Complete Troubleshooting Guide",
  description: "Comprehensive guide to Kubernetes runtime errors: CrashLoopBackOff, ImagePullBackOff, pod lifecycle issues, and container execution failures with solutions.",
  keywords: [
    "kubernetes runtime errors",
    "crashloopbackoff", 
    "imagepullbackoff",
    "pod lifecycle",
    "container crashes", 
    "kubernetes debugging",
    "k8s execution errors",
    "pod startup issues"
  ],
  alternates: {
    canonical: "/kubernetes/runtime"
  }
}

const runtimeConcepts = [
  {
    title: "Pod Lifecycle",
    description: "Understanding Pending → Running → Succeeded/Failed states",
    icon: Play,
    topics: ["Pod Phases", "Container States", "Restart Policies", "Init Containers"]
  },
  {
    title: "Container Execution", 
    description: "How containers start, run, and handle failures",
    icon: Terminal,
    topics: ["Image Pulling", "Command Execution", "Resource Limits", "Health Checks"]
  },
  {
    title: "Error Patterns",
    description: "Common failure modes and debugging approaches", 
    icon: AlertTriangle,
    topics: ["Crash Analysis", "Exit Codes", "Log Investigation", "Event Inspection"]
  },
  {
    title: "Recovery Strategies",
    description: "Automatic and manual recovery mechanisms",
    icon: RotateCcw,
    topics: ["Restart Policies", "Graceful Shutdown", "Rolling Updates", "Circuit Breakers"]
  }
]

const troubleshootingWorkflow = [
  {
    step: 1,
    title: "Check Pod Status",
    command: "kubectl get pods -o wide",
    description: "Identify pod state and basic information"
  },
  {
    step: 2, 
    title: "Examine Events",
    command: "kubectl describe pod <pod-name>",
    description: "Look for recent events and error messages"
  },
  {
    step: 3,
    title: "Check Logs",
    command: "kubectl logs <pod-name> --previous",
    description: "Analyze application and previous container logs"
  },
  {
    step: 4,
    title: "Resource Inspection",
    command: "kubectl top pod <pod-name>",
    description: "Verify resource usage and limits"
  }
]

const commonScenarios = [
  {
    scenario: "Application Crash on Startup",
    symptoms: ["CrashLoopBackOff", "Exit code 1", "Rapid restarts"],
    causes: ["Configuration errors", "Missing dependencies", "Resource constraints"],
    quickFix: "Check logs for startup errors and verify configuration"
  },
  {
    scenario: "Image Cannot Be Pulled", 
    symptoms: ["ImagePullBackOff", "ErrImagePull", "Pending state"],
    causes: ["Registry access", "Authentication", "Image not found"],
    quickFix: "Verify image name, registry access, and pull secrets"
  },
  {
    scenario: "Container Memory Issues",
    symptoms: ["OOMKilled", "Memory usage spikes", "Slow performance"],
    causes: ["Memory leaks", "Insufficient limits", "Resource contention"],
    quickFix: "Increase memory limits and investigate memory usage"
  },
  {
    scenario: "Startup Timeout",
    symptoms: ["Pending state", "Startup probe failures", "Long initialization"],
    causes: ["Slow startup", "Probe misconfiguration", "Resource starvation"],
    quickFix: "Adjust probe timing and verify startup performance"
  }
]

export default async function KubernetesRuntimePage() {
  // Get runtime-specific errors
  const allErrors = await safeFindErrors()
  const runtimeErrors = allErrors.filter(error => 
    error.tool === 'kubernetes' && error.category === 'runtime'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center text-sm text-slate-600">
            <Link href="/kubernetes" className="hover:text-slate-900 transition-colors">
              Kubernetes
            </Link>
            <span className="mx-2">/</span>
            <span className="text-orange-600 font-medium">Runtime & Execution</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-white/30">
                {runtimeErrors.length} Documented Errors
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Runtime & Execution
              <span className="block text-orange-200">Error Troubleshooting</span>
            </h1>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Master Kubernetes pod lifecycle issues, container crashes, and runtime failures. 
              From CrashLoopBackOff to ImagePullBackOff - comprehensive solutions for production environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-white text-orange-600 hover:bg-orange-50">
                <Link href="/errors?category=runtime">
                  View All Runtime Errors
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link href="#troubleshooting-workflow">
                  <Zap className="mr-2 h-5 w-5" />
                  Emergency Workflow
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Core Concepts */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Concepts</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Understanding these fundamental concepts will help you diagnose and resolve runtime issues more effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {runtimeConcepts.map((concept) => (
              <Card key={concept.title} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <concept.icon className="h-5 w-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">{concept.title}</CardTitle>
                  </div>
                  <CardDescription>{concept.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {concept.topics.map((topic) => (
                      <div key={topic} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-sm text-slate-600">{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Troubleshooting Workflow */}
        <section id="troubleshooting-workflow" className="mb-16">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-slate-900 mb-4">
                Emergency Troubleshooting Workflow
              </CardTitle>
              <CardDescription className="text-lg">
                Step-by-step process to diagnose runtime issues quickly in production environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {troubleshootingWorkflow.map((step, index) => (
                  <div key={step.step} className="relative">
                    {index < troubleshootingWorkflow.length - 1 && (
                      <div className="hidden lg:block absolute top-6 left-full w-6 h-0.5 bg-orange-200 transform translate-y-1/2 -translate-x-3"></div>
                    )}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg">
                        {step.step}
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">{step.title}</h4>
                      <div className="bg-slate-900 text-green-400 text-xs p-3 rounded-lg font-mono mb-3 overflow-x-auto">
                        {step.command}
                      </div>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Common Scenarios */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Scenarios</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Real-world runtime issues you'll encounter and how to resolve them quickly.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {commonScenarios.map((scenario, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">{scenario.scenario}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium text-red-700 mb-2">Symptoms:</h5>
                    <div className="flex flex-wrap gap-1">
                      {scenario.symptoms.map((symptom) => (
                        <Badge key={symptom} variant="destructive" className="text-xs bg-red-50 text-red-700 border-red-200">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-amber-700 mb-2">Common Causes:</h5>
                    <div className="flex flex-wrap gap-1">
                      {scenario.causes.map((cause) => (
                        <Badge key={cause} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                          {cause}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 className="font-medium text-green-800 mb-1">Quick Fix:</h5>
                    <p className="text-sm text-green-700">{scenario.quickFix}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Error List */}
        <section>
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">All Runtime Errors</CardTitle>
                  <CardDescription>
                    Complete list of documented runtime and execution errors with solutions
                  </CardDescription>
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  {runtimeErrors.length} errors
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {runtimeErrors.slice(0, 8).map((error) => (
                  <Link 
                    key={error.canonical_slug}
                    href={`/errors/${error.canonical_slug}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all group"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 group-hover:text-orange-700 transition-colors">
                        {error.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {error.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {error.tool}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          Updated {new Date(error.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>

              {runtimeErrors.length > 8 && (
                <div className="mt-6 text-center">
                  <Button asChild variant="outline" size="lg">
                    <Link href="/errors?category=runtime">
                      View All {runtimeErrors.length} Runtime Errors
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
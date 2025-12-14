import Link from "next/link"
import { Metadata } from "next"
import { 
  Activity,
  Network,
  Settings,
  Shield,
  Grid3X3,
  Server,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { safeFindErrors } from "@/lib/dbFallback"

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Kubernetes Error Documentation Hub - Complete Troubleshooting Guide",
  description: "Comprehensive Kubernetes error documentation with 50+ documented errors, troubleshooting guides, and step-by-step solutions for production environments.",
  keywords: [
    "kubernetes errors",
    "kubernetes troubleshooting", 
    "k8s debugging",
    "pod errors",
    "kubernetes deployment issues",
    "container orchestration problems",
    "kubernetes best practices",
    "production kubernetes"
  ],
  alternates: {
    canonical: "/kubernetes"
  }
}

// Category definitions with rich metadata
const categories = [
  {
    id: "runtime",
    title: "Runtime & Execution",
    description: "Pod lifecycle, container crashes, resource limitations, and application runtime failures",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    count: 16,
    severity: "Critical",
    commonIssues: ["CrashLoopBackOff", "ImagePullBackOff", "Container Creation Failed"],
    href: "/kubernetes/runtime"
  },
  {
    id: "network", 
    title: "Network & Connectivity",
    description: "DNS resolution, service communication, ingress, and cluster networking issues",
    icon: Network,
    color: "text-blue-600",
    bgColor: "bg-blue-50", 
    borderColor: "border-blue-200",
    count: 9,
    severity: "High",
    commonIssues: ["Service Unavailable", "DNS Resolution Failed", "Network Policy Blocked"],
    href: "/kubernetes/network"
  },
  {
    id: "config",
    title: "Configuration",
    description: "ConfigMap, Secret, YAML validation, and configuration-related startup failures",
    icon: Settings,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200", 
    count: 7,
    severity: "Medium",
    commonIssues: ["Invalid YAML", "ConfigMap Not Found", "Secret Mount Failed"],
    href: "/kubernetes/config"
  },
  {
    id: "auth",
    title: "Authentication & Authorization", 
    description: "RBAC issues, certificate problems, and permission-related access failures",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    count: 6,
    severity: "Critical",
    commonIssues: ["Forbidden Access", "Certificate Expired", "RBAC Denied"],
    href: "/kubernetes/auth"
  },
  {
    id: "scheduler",
    title: "Scheduling & Resources",
    description: "Pod scheduling failures, resource constraints, node affinity, and placement issues",
    icon: Grid3X3,
    color: "text-indigo-600", 
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    count: 5,
    severity: "High",
    commonIssues: ["Insufficient Resources", "Node Selector Failed", "Affinity Rules"],
    href: "/kubernetes/scheduler"
  },
  {
    id: "cluster",
    title: "Cluster Management",
    description: "Node problems, cluster-wide issues, and infrastructure-level failures",
    icon: Server,
    color: "text-slate-600",
    bgColor: "bg-slate-50", 
    borderColor: "border-slate-200",
    count: 4,
    severity: "Critical",
    commonIssues: ["Node Not Ready", "Cluster Autoscaler Failed", "Control Plane Issues"],
    href: "/kubernetes/cluster"
  },
  {
    id: "storage",
    title: "Storage & Volumes",
    description: "Persistent volume claims, storage class problems, and volume mounting errors",
    icon: HardDrive,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200", 
    count: 3,
    severity: "High",
    commonIssues: ["Volume Mount Failed", "PVC Pending", "Storage Class Error"],
    href: "/kubernetes/storage"
  }
]

const quickStats = [
  { label: "Total Errors", value: "50+", icon: AlertTriangle, color: "text-red-600" },
  { label: "Categories", value: "7", icon: Grid3X3, color: "text-blue-600" },
  { label: "Solutions", value: "100%", icon: CheckCircle2, color: "text-green-600" },
  { label: "Updated", value: "Daily", icon: TrendingUp, color: "text-purple-600" }
]

const popularErrors = [
  { title: "CrashLoopBackOff", category: "runtime", visits: "12.5k" },
  { title: "ImagePullBackOff", category: "runtime", visits: "8.2k" },
  { title: "Service Unavailable", category: "network", visits: "6.1k" },
  { title: "Forbidden Access", category: "auth", visits: "4.8k" },
  { title: "Node Not Ready", category: "cluster", visits: "3.9k" }
]

export default async function KubernetesHub() {
  // Get total error count for dynamic content
  const allErrors = await safeFindErrors()
  const kubernetesErrors = allErrors.filter(error => error.tool === 'kubernetes')
  const totalCount = kubernetesErrors.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Zap className="w-3 h-3 mr-1" />
              Most Comprehensive Kubernetes Error Database
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Kubernetes Error
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Documentation Hub
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
              Complete troubleshooting guide with <strong>{totalCount} documented errors</strong>, 
              step-by-step solutions, and real-world examples for production environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all">
                <Link href="/errors?tool=kubernetes">
                  Browse All Errors
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link href="/kubernetes/getting-started">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Getting Started Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0">
              <CardContent className="p-6 text-center">
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Error Categories Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Error Categories
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive coverage of all Kubernetes error types with detailed troubleshooting guides and solutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className={`${category.bgColor} ${category.borderColor} border-b`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 ${category.bgColor} rounded-xl border ${category.borderColor}`}>
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {category.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {category.count} errors
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${
                            category.severity === 'Critical' ? 'border-red-200 text-red-700' :
                            category.severity === 'High' ? 'border-orange-200 text-orange-700' :
                            'border-blue-200 text-blue-700'
                          }`}>
                            {category.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Common Issues:</h4>
                    <div className="flex flex-wrap gap-1">
                      {category.commonIssues.map((issue) => (
                        <Badge key={issue} variant="outline" className="text-xs bg-slate-50 text-slate-600">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-indigo-50 group-hover:text-indigo-600">
                    <Link href={category.href}>
                      Explore Category
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Errors & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Popular Errors */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Most Popular Errors
                </CardTitle>
                <CardDescription>
                  Frequently accessed error documentation based on community usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularErrors.map((error, index) => (
                  <Link 
                    key={error.title}
                    href={`/errors?q=${encodeURIComponent(error.title)}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {error.title}
                        </div>
                        <div className="text-xs text-slate-500 capitalize">{error.category}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {error.visits} views
                    </div>
                  </Link>
                ))}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/errors?tool=kubernetes">
                    View All Kubernetes Errors
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Jump-start your troubleshooting process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/kubernetes/troubleshooting-checklist">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Emergency Checklist
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/kubernetes/best-practices">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Best Practices
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/kubernetes/learning-paths">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Learning Paths
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/analysis">
                    <Users className="mr-2 h-4 w-4" />
                    Community Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
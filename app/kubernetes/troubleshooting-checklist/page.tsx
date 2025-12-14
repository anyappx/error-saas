import { 
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Search,
  Activity,
  Network,
  Shield,
  Settings,
  HardDrive,
  Server,
  Clock,
  Zap,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const emergencySteps = [
  {
    phase: "Immediate Assessment",
    timeframe: "0-5 minutes",
    priority: "Critical",
    color: "red",
    steps: [
      {
        title: "Check Cluster Health",
        command: "kubectl get nodes",
        description: "Verify all nodes are Ready and available",
        category: "cluster"
      },
      {
        title: "Identify Affected Pods", 
        command: "kubectl get pods --all-namespaces | grep -v Running",
        description: "Find pods in error states across all namespaces",
        category: "runtime"
      },
      {
        title: "Check Control Plane",
        command: "kubectl get componentstatuses",
        description: "Verify control plane components are healthy",
        category: "cluster"
      },
      {
        title: "Review Recent Events",
        command: "kubectl get events --sort-by='.lastTimestamp' | tail -20",
        description: "Check for recent cluster events and warnings",
        category: "general"
      }
    ]
  },
  {
    phase: "Deep Investigation",
    timeframe: "5-15 minutes",
    priority: "High", 
    color: "orange",
    steps: [
      {
        title: "Analyze Pod Details",
        command: "kubectl describe pod <pod-name> -n <namespace>",
        description: "Get detailed information about failing pods",
        category: "runtime"
      },
      {
        title: "Check Pod Logs",
        command: "kubectl logs <pod-name> -n <namespace> --previous",
        description: "Examine current and previous container logs",
        category: "runtime"
      },
      {
        title: "Resource Utilization",
        command: "kubectl top nodes && kubectl top pods --all-namespaces",
        description: "Check CPU and memory usage across cluster",
        category: "performance"
      },
      {
        title: "Service Connectivity",
        command: "kubectl get svc,ep -n <namespace>",
        description: "Verify services and endpoints configuration",
        category: "network"
      },
      {
        title: "Storage Status",
        command: "kubectl get pv,pvc --all-namespaces",
        description: "Check persistent volume claims and status",
        category: "storage"
      }
    ]
  },
  {
    phase: "Root Cause Analysis", 
    timeframe: "15-30 minutes",
    priority: "Medium",
    color: "blue",
    steps: [
      {
        title: "Network Policy Review",
        command: "kubectl get networkpolicy --all-namespaces",
        description: "Check for restrictive network policies",
        category: "network"
      },
      {
        title: "RBAC Verification",
        command: "kubectl auth can-i <verb> <resource> --as=<user>",
        description: "Test permissions for specific users/services",
        category: "auth"
      },
      {
        title: "ConfigMap/Secret Check",
        command: "kubectl get configmap,secret -n <namespace>",
        description: "Verify configuration resources exist",
        category: "config"
      },
      {
        title: "Image Pull Status",
        command: "kubectl get pods -o jsonpath='{.items[*].status.containerStatuses[*].state}'",
        description: "Check for image pull failures",
        category: "registry"
      },
      {
        title: "Node Conditions",
        command: "kubectl describe nodes | grep -A5 Conditions",
        description: "Review node health conditions",
        category: "cluster"
      }
    ]
  }
]

const categoryChecks = [
  {
    category: "Runtime Issues",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    checks: [
      { item: "Pod status is Running/Ready", command: "kubectl get pods" },
      { item: "Container restart count is low", command: "kubectl get pods -o wide" },
      { item: "No CrashLoopBackOff errors", command: "kubectl describe pod <name>" },
      { item: "Resource requests/limits are reasonable", command: "kubectl describe pod <name>" },
      { item: "Probes are configured correctly", command: "kubectl get pod <name> -o yaml" }
    ]
  },
  {
    category: "Network Connectivity", 
    icon: Network,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    checks: [
      { item: "Services have valid endpoints", command: "kubectl get endpoints" },
      { item: "DNS resolution works", command: "nslookup <service>.<namespace>.svc.cluster.local" },
      { item: "Network policies allow traffic", command: "kubectl get networkpolicy" },
      { item: "Ingress configuration is correct", command: "kubectl get ingress" },
      { item: "Load balancer services are accessible", command: "kubectl get svc -o wide" }
    ]
  },
  {
    category: "Authentication & Security",
    icon: Shield, 
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    checks: [
      { item: "RBAC permissions are sufficient", command: "kubectl auth can-i <action> <resource>" },
      { item: "Service accounts exist", command: "kubectl get serviceaccount" },
      { item: "Secrets are properly mounted", command: "kubectl describe pod <name>" },
      { item: "Certificates are not expired", command: "kubectl get certificates" },
      { item: "Pod security policies allow execution", command: "kubectl get psp" }
    ]
  },
  {
    category: "Configuration",
    icon: Settings,
    color: "text-purple-600", 
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    checks: [
      { item: "ConfigMaps are available", command: "kubectl get configmap" },
      { item: "Environment variables are set", command: "kubectl describe pod <name>" },
      { item: "Volume mounts are correct", command: "kubectl get pod <name> -o yaml" },
      { item: "Resource quotas are not exceeded", command: "kubectl get resourcequota" },
      { item: "Namespace exists and is active", command: "kubectl get namespace" }
    ]
  },
  {
    category: "Storage & Persistence",
    icon: HardDrive,
    color: "text-amber-600",
    bgColor: "bg-amber-50", 
    borderColor: "border-amber-200",
    checks: [
      { item: "PVCs are bound to PVs", command: "kubectl get pvc" },
      { item: "Storage classes are available", command: "kubectl get storageclass" },
      { item: "Volumes are properly mounted", command: "kubectl describe pod <name>" },
      { item: "Disk space is sufficient", command: "df -h" },
      { item: "CSI drivers are healthy", command: "kubectl get csidrivers" }
    ]
  },
  {
    category: "Cluster Health",
    icon: Server,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200", 
    checks: [
      { item: "All nodes are Ready", command: "kubectl get nodes" },
      { item: "Control plane components are healthy", command: "kubectl get componentstatuses" },
      { item: "Cluster DNS is working", command: "kubectl get pods -n kube-system" },
      { item: "etcd cluster is healthy", command: "kubectl get pods -n kube-system | grep etcd" },
      { item: "Network plugin is operational", command: "kubectl get pods -n kube-system" }
    ]
  }
]

const commonCommands = [
  {
    category: "Pod Inspection",
    commands: [
      { cmd: "kubectl get pods -o wide", desc: "List pods with node information" },
      { cmd: "kubectl describe pod <name>", desc: "Detailed pod information" },
      { cmd: "kubectl logs <pod> -f", desc: "Follow pod logs in real-time" },
      { cmd: "kubectl exec -it <pod> -- /bin/bash", desc: "Shell into running container" }
    ]
  },
  {
    category: "Service Debugging",
    commands: [
      { cmd: "kubectl get svc,ep", desc: "List services and endpoints" },
      { cmd: "kubectl port-forward svc/<name> 8080:80", desc: "Test service connectivity" },
      { cmd: "kubectl run test --image=busybox -it --rm", desc: "Create test pod for debugging" },
      { cmd: "nslookup <service>.<namespace>.svc.cluster.local", desc: "Test DNS resolution" }
    ]
  },
  {
    category: "Resource Management",
    commands: [
      { cmd: "kubectl top nodes", desc: "Node resource utilization" },
      { cmd: "kubectl top pods --all-namespaces", desc: "Pod resource usage" },
      { cmd: "kubectl get events --sort-by='.lastTimestamp'", desc: "Recent cluster events" },
      { cmd: "kubectl get all -n <namespace>", desc: "All resources in namespace" }
    ]
  }
]

export default function TroubleshootingChecklistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-red-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center text-sm text-slate-600">
            <Link href="/kubernetes" className="hover:text-slate-900 transition-colors">
              Kubernetes
            </Link>
            <span className="mx-2">/</span>
            <span className="text-red-600 font-medium">Emergency Troubleshooting Checklist</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-white/30">
                Production Ready
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Emergency Troubleshooting
              <span className="block text-orange-200">Checklist</span>
            </h1>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Complete step-by-step checklist for rapid Kubernetes incident resolution. 
              Designed for production environments with time-critical procedures and essential commands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-white text-red-600 hover:bg-red-50">
                <Link href="#emergency-steps">
                  Start Emergency Procedure
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link href="#category-checks">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Category Checklists
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Emergency Steps */}
        <section id="emergency-steps" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Emergency Response Phases</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Follow these time-based phases for systematic incident resolution. Each phase builds on the previous to quickly isolate and resolve issues.
            </p>
          </div>

          <div className="space-y-8">
            {emergencySteps.map((phase, phaseIndex) => (
              <Card key={phaseIndex} className={`shadow-lg border-0 border-l-4 ${
                phase.color === 'red' ? 'border-l-red-500 bg-red-50/50' :
                phase.color === 'orange' ? 'border-l-orange-500 bg-orange-50/50' :
                'border-l-blue-500 bg-blue-50/50'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-slate-900 mb-2">
                        Phase {phaseIndex + 1}: {phase.phase}
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <Badge className={`${
                          phase.color === 'red' ? 'bg-red-100 text-red-700 border-red-200' :
                          phase.color === 'orange' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {phase.timeframe}
                        </Badge>
                        <Badge variant="outline" className={`${
                          phase.priority === 'Critical' ? 'border-red-200 text-red-700' :
                          phase.priority === 'High' ? 'border-orange-200 text-orange-700' :
                          'border-blue-200 text-blue-700'
                        }`}>
                          {phase.priority} Priority
                        </Badge>
                      </div>
                    </div>
                    <AlertTriangle className={`h-8 w-8 ${
                      phase.color === 'red' ? 'text-red-600' :
                      phase.color === 'orange' ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {phase.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          phase.color === 'red' ? 'bg-red-500' :
                          phase.color === 'orange' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}>
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 mb-2">{step.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{step.description}</p>
                          <div className="bg-slate-900 text-green-400 text-sm p-3 rounded-lg font-mono overflow-x-auto relative group">
                            <code>{step.command}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Category Checklists */}
        <section id="category-checks" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Category-Specific Checklists</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Systematic checks for each major error category. Use these detailed checklists to verify specific aspects of your cluster.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {categoryChecks.map((category) => (
              <Card key={category.category} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className={`${category.bgColor} ${category.borderColor} border-b`}>
                  <CardTitle className="flex items-center gap-3">
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {category.checks.map((check, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm text-slate-900 mb-1">{check.item}</div>
                          <code className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {check.command}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Common Commands Reference */}
        <section className="mb-16">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Terminal className="h-6 w-6 text-indigo-600" />
                Essential Commands Reference
              </CardTitle>
              <CardDescription>
                Copy-paste ready commands for common troubleshooting scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                {commonCommands.map((commandGroup) => (
                  <div key={commandGroup.category}>
                    <h4 className="font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                      {commandGroup.category}
                    </h4>
                    <div className="space-y-3">
                      {commandGroup.commands.map((cmd, index) => (
                        <div key={index} className="group">
                          <div className="bg-slate-900 text-green-400 text-xs p-3 rounded-lg font-mono overflow-x-auto relative">
                            <code>{cmd.cmd}</code>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{cmd.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Related Resources */}
        <section>
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Need More Help?</h3>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Explore our comprehensive error database and learning resources for deeper troubleshooting knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/errors">
                    <Search className="mr-2 h-5 w-5" />
                    Browse Error Database
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/learning-paths">
                    Learn Advanced Troubleshooting
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
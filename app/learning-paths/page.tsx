import Link from "next/link"
import { Metadata } from "next"
import { 
  BookOpen,
  ArrowRight,
  Clock,
  Users,
  Award,
  Target,
  Zap,
  Shield,
  Network,
  Activity,
  Settings,
  Server,
  HardDrive,
  CheckCircle2,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Kubernetes Learning Paths - Master Error Troubleshooting",
  description: "Structured learning paths for Kubernetes troubleshooting: from beginner to expert. Master pod errors, networking, security, and production debugging.",
  keywords: [
    "kubernetes learning",
    "troubleshooting training",
    "k8s certification",
    "kubernetes mastery",
    "devops learning paths",
    "production debugging",
    "kubernetes skills"
  ],
  alternates: {
    canonical: "/learning-paths"
  }
}

const learningPaths = [
  {
    id: "kubernetes-beginner",
    title: "Kubernetes Troubleshooting Fundamentals", 
    description: "Master the basics of Kubernetes error diagnosis and resolution",
    level: "Beginner",
    duration: "2-3 weeks",
    students: "12.5k",
    rating: 4.8,
    color: "blue",
    icon: BookOpen,
    skills: ["Pod lifecycle", "Basic debugging", "kubectl commands", "Log analysis"],
    modules: [
      { title: "Understanding Pod States", duration: "45 min", type: "video" },
      { title: "Essential kubectl Commands", duration: "30 min", type: "interactive" },
      { title: "Reading Pod Events", duration: "25 min", type: "guide" },
      { title: "Basic Log Analysis", duration: "40 min", type: "lab" },
      { title: "Common Pod Errors", duration: "50 min", type: "case-study" }
    ],
    prerequisites: ["Basic Kubernetes concepts", "Command line familiarity"],
    href: "/learning-paths/kubernetes-beginner"
  },
  {
    id: "networking-master",
    title: "Kubernetes Networking Deep Dive",
    description: "Become an expert in diagnosing and fixing network-related issues",
    level: "Intermediate",
    duration: "3-4 weeks", 
    students: "8.2k",
    rating: 4.9,
    color: "cyan",
    icon: Network,
    skills: ["Service debugging", "DNS resolution", "Network policies", "Ingress issues"],
    modules: [
      { title: "Service Discovery Fundamentals", duration: "60 min", type: "video" },
      { title: "DNS Troubleshooting", duration: "45 min", type: "lab" },
      { title: "Network Policy Debugging", duration: "55 min", type: "interactive" },
      { title: "Ingress Controller Issues", duration: "50 min", type: "case-study" },
      { title: "Service Mesh Debugging", duration: "65 min", type: "advanced" }
    ],
    prerequisites: ["Kubernetes fundamentals", "Basic networking knowledge"],
    href: "/learning-paths/networking-master"
  },
  {
    id: "security-hardening", 
    title: "Security & RBAC Troubleshooting",
    description: "Master authentication, authorization, and security-related error resolution",
    level: "Intermediate",
    duration: "2-3 weeks",
    students: "6.8k", 
    rating: 4.7,
    color: "green",
    icon: Shield,
    skills: ["RBAC debugging", "Certificate issues", "Security policies", "Audit logs"],
    modules: [
      { title: "RBAC Fundamentals", duration: "40 min", type: "guide" },
      { title: "Certificate Troubleshooting", duration: "55 min", type: "lab" },
      { title: "Security Context Issues", duration: "35 min", type: "interactive" },
      { title: "Pod Security Standards", duration: "45 min", type: "video" },
      { title: "Audit Log Analysis", duration: "50 min", type: "case-study" }
    ],
    prerequisites: ["Kubernetes basics", "Security awareness"],
    href: "/learning-paths/security-hardening"
  },
  {
    id: "production-debugging",
    title: "Production Debugging & Performance",
    description: "Advanced troubleshooting techniques for production environments",
    level: "Advanced",
    duration: "4-5 weeks",
    students: "4.1k",
    rating: 4.9,
    color: "purple",
    icon: Activity,
    skills: ["Performance debugging", "Resource optimization", "Cluster scaling", "Incident response"],
    modules: [
      { title: "Resource Bottleneck Analysis", duration: "70 min", type: "advanced" },
      { title: "Cluster Autoscaler Debugging", duration: "60 min", type: "lab" },
      { title: "Memory & CPU Profiling", duration: "65 min", type: "interactive" },
      { title: "Distributed Tracing", duration: "55 min", type: "video" },
      { title: "Incident Response Playbooks", duration: "80 min", type: "case-study" }
    ],
    prerequisites: ["Advanced K8s knowledge", "Production experience"],
    href: "/learning-paths/production-debugging"
  },
  {
    id: "storage-expert",
    title: "Storage & Persistence Mastery",
    description: "Deep dive into persistent volume issues and storage troubleshooting",
    level: "Intermediate",
    duration: "2-3 weeks",
    students: "3.9k",
    rating: 4.6,
    color: "amber",
    icon: HardDrive,
    skills: ["PV/PVC debugging", "Storage classes", "CSI drivers", "Backup strategies"],
    modules: [
      { title: "Persistent Volume Lifecycle", duration: "45 min", type: "guide" },
      { title: "Storage Class Configuration", duration: "50 min", type: "lab" },
      { title: "CSI Driver Troubleshooting", duration: "60 min", type: "advanced" },
      { title: "Volume Mount Issues", duration: "40 min", type: "interactive" },
      { title: "Backup & Recovery", duration: "55 min", type: "case-study" }
    ],
    prerequisites: ["Storage basics", "Kubernetes volumes"],
    href: "/learning-paths/storage-expert"
  },
  {
    id: "cluster-administration",
    title: "Cluster Administration & Operations", 
    description: "Master cluster-level troubleshooting and operations",
    level: "Advanced",
    duration: "3-4 weeks",
    students: "5.2k",
    rating: 4.8,
    color: "slate",
    icon: Server,
    skills: ["Node debugging", "Control plane issues", "Cluster upgrades", "Backup strategies"],
    modules: [
      { title: "Control Plane Debugging", duration: "65 min", type: "advanced" },
      { title: "Node Troubleshooting", duration: "55 min", type: "lab" },
      { title: "etcd Operations", duration: "70 min", type: "video" },
      { title: "Cluster Upgrade Issues", duration: "60 min", type: "interactive" },
      { title: "Disaster Recovery", duration: "75 min", type: "case-study" }
    ],
    prerequisites: ["Advanced K8s", "System administration"],
    href: "/learning-paths/cluster-administration"
  }
]

const skillLevels = {
  "Beginner": { color: "bg-blue-100 text-blue-800 border-blue-200" },
  "Intermediate": { color: "bg-amber-100 text-amber-800 border-amber-200" },
  "Advanced": { color: "bg-purple-100 text-purple-800 border-purple-200" }
}

const moduleTypes = {
  "video": { icon: "📹", label: "Video" },
  "interactive": { icon: "⚡", label: "Interactive" },
  "guide": { icon: "📖", label: "Guide" },
  "lab": { icon: "🧪", label: "Hands-on Lab" },
  "case-study": { icon: "📊", label: "Case Study" },
  "advanced": { icon: "🎯", label: "Advanced" }
}

export default function LearningPathsPage() {
  const totalStudents = learningPaths.reduce((sum, path) => sum + parseFloat(path.students.replace('k', '')), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Award className="w-3 h-3 mr-1" />
              Trusted by {Math.round(totalStudents)}k+ Engineers
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Master Kubernetes
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Troubleshooting
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-indigo-100 leading-relaxed">
              Structured learning paths from <strong>beginner to expert</strong>. 
              Build production-ready debugging skills with hands-on labs and real-world scenarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all">
                <Link href="#learning-paths">
                  Explore Learning Paths
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link href="/kubernetes">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Error Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">6</div>
              <div className="text-sm text-slate-600">Learning Paths</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{Math.round(totalStudents)}k+</div>
              <div className="text-sm text-slate-600">Students</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-amber-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">4.8</div>
              <div className="text-sm text-slate-600">Avg Rating</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">95%</div>
              <div className="text-sm text-slate-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Learning Paths Grid */}
        <section id="learning-paths">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Structured curricula designed by Kubernetes experts. Each path includes hands-on labs, 
              real-world scenarios, and practical troubleshooting exercises.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {learningPaths.map((path) => (
              <Card key={path.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-1 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${
                  path.color === 'blue' ? 'from-blue-400 to-blue-600' :
                  path.color === 'cyan' ? 'from-cyan-400 to-cyan-600' :
                  path.color === 'green' ? 'from-green-400 to-green-600' :
                  path.color === 'purple' ? 'from-purple-400 to-purple-600' :
                  path.color === 'amber' ? 'from-amber-400 to-amber-600' :
                  'from-slate-400 to-slate-600'
                }`}></div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      path.color === 'blue' ? 'bg-blue-100' :
                      path.color === 'cyan' ? 'bg-cyan-100' :
                      path.color === 'green' ? 'bg-green-100' :
                      path.color === 'purple' ? 'bg-purple-100' :
                      path.color === 'amber' ? 'bg-amber-100' :
                      'bg-slate-100'
                    }`}>
                      <path.icon className={`h-6 w-6 ${
                        path.color === 'blue' ? 'text-blue-600' :
                        path.color === 'cyan' ? 'text-cyan-600' :
                        path.color === 'green' ? 'text-green-600' :
                        path.color === 'purple' ? 'text-purple-600' :
                        path.color === 'amber' ? 'text-amber-600' :
                        'text-slate-600'
                      }`} />
                    </div>
                    <Badge className={skillLevels[path.level as keyof typeof skillLevels].color}>
                      {path.level}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl mb-3 group-hover:text-indigo-600 transition-colors">
                    {path.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {path.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Clock className="h-4 w-4 text-slate-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-slate-900">{path.duration}</div>
                      <div className="text-xs text-slate-500">Duration</div>
                    </div>
                    <div>
                      <Users className="h-4 w-4 text-slate-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-slate-900">{path.students}</div>
                      <div className="text-xs text-slate-500">Students</div>
                    </div>
                    <div>
                      <Star className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-slate-900">{path.rating}</div>
                      <div className="text-xs text-slate-500">Rating</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h5 className="font-medium text-slate-900 mb-3">Skills You'll Master:</h5>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs bg-slate-50 text-slate-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Modules Preview */}
                  <div>
                    <h5 className="font-medium text-slate-900 mb-3">Course Modules:</h5>
                    <div className="space-y-2">
                      {path.modules.slice(0, 3).map((module, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <span className="text-lg">{moduleTypes[module.type as keyof typeof moduleTypes].icon}</span>
                          <span className="flex-1 text-slate-700">{module.title}</span>
                          <span className="text-xs text-slate-500">{module.duration}</span>
                        </div>
                      ))}
                      {path.modules.length > 3 && (
                        <div className="text-xs text-slate-500 pt-1">
                          +{path.modules.length - 3} more modules
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button asChild className="w-full group-hover:shadow-lg transition-all">
                      <Link href={path.href}>
                        Start Learning Path
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-20 text-center">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-xl">
            <CardContent className="p-12">
              <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to Become a Kubernetes Troubleshooting Expert?
              </h3>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Join thousands of engineers who have mastered Kubernetes troubleshooting 
                through our comprehensive learning paths and hands-on practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/learning-paths/kubernetes-beginner">
                    Start with Fundamentals
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/errors">
                    Browse Error Database
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
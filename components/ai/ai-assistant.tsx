"use client"

import * as React from "react"
import { 
  Bot, 
  Send, 
  X, 
  Loader2, 
  Sparkles, 
  Code, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'code' | 'suggestion' | 'analysis'
}

interface AIAssistantProps {
  onClose?: () => void
}

const suggestedActions = [
  {
    title: "Analyze Current Page",
    description: "Get insights about the current error or incident",
    icon: Sparkles,
    action: "analyze-page"
  },
  {
    title: "Generate Fix Command",
    description: "Create kubectl/docker commands to resolve issues",
    icon: Code,
    action: "generate-fix"
  },
  {
    title: "Explain Error Pattern",
    description: "Deep dive into error patterns and root causes",
    icon: FileText,
    action: "explain-pattern"
  },
  {
    title: "Incident Response",
    description: "Get incident response recommendations",
    icon: AlertTriangle,
    action: "incident-response"
  }
]

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for error intelligence and incident management. How can I help you today?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message?: string) => {
    const content = message || input.trim()
    if (!content) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(content),
        timestamp: new Date(),
        type: getResponseType(content)
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('imagepullbackoff') || lowerInput.includes('image')) {
      return `I can help you troubleshoot ImagePullBackOff errors. This typically occurs when Kubernetes cannot pull the container image. Here are the main steps:

1. Check if the image name and tag are correct
2. Verify image registry accessibility
3. Check authentication credentials
4. Ensure network connectivity

Would you like me to generate specific kubectl commands to diagnose this?`
    }
    
    if (lowerInput.includes('crashloopbackoff')) {
      return `CrashLoopBackOff indicates your pod is repeatedly crashing. Let me help you debug this:

1. Check pod logs: \`kubectl logs <pod-name> --previous\`
2. Verify resource limits and requests
3. Check application configuration
4. Review health checks

Would you like me to analyze the specific logs or configuration?`
    }
    
    if (lowerInput.includes('analyze') || lowerInput.includes('current')) {
      return `I'm analyzing the current page context. Based on the error information displayed, here are my insights:

• **Error Type**: Kubernetes scheduling error
• **Severity**: High
• **Affected Resources**: Pod deployment
• **Recommended Actions**:
  - Check node resources
  - Verify node selectors
  - Review resource quotas

Would you like detailed remediation steps?`
    }
    
    if (lowerInput.includes('fix') || lowerInput.includes('command')) {
      return `Here are the kubectl commands to resolve this issue:

\`\`\`bash
# Check node resources
kubectl get nodes -o wide
kubectl describe nodes

# Check pod status
kubectl get pods -o wide
kubectl describe pod <pod-name>

# Check resource quotas
kubectl get resourcequota
\`\`\`

Run these commands and let me know the output for further assistance.`
    }
    
    return `I understand you're asking about "${input}". Let me help you with that. Based on our error intelligence database, I can provide specific guidance for Kubernetes, Docker, and infrastructure issues. What specific problem are you facing?`
  }

  const getResponseType = (input: string): Message['type'] => {
    if (input.toLowerCase().includes('command') || input.toLowerCase().includes('fix')) {
      return 'code'
    }
    if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('pattern')) {
      return 'analysis'
    }
    return 'text'
  }

  const handleSuggestedAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      'analyze-page': 'Analyze the current page and provide insights',
      'generate-fix': 'Generate fix commands for the current error',
      'explain-pattern': 'Explain the error pattern and root causes',
      'incident-response': 'Provide incident response recommendations'
    }
    
    handleSend(actionMessages[action])
  }

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'code': return Code
      case 'analysis': return Sparkles
      case 'suggestion': return CheckCircle
      default: return Bot
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Error Intelligence & Support</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => {
          const Icon = getMessageIcon(message.type)
          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.type === 'code' ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {message.content}
                  </pre>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
                <div className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-xs font-medium">You</span>
                </div>
              )}
            </div>
          )
        })}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="max-w-[80%] rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      {messages.length === 1 && (
        <div className="border-t p-4">
          <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            {suggestedActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.action}
                  variant="ghost"
                  size="sm"
                  className="h-auto justify-start p-3 text-left"
                  onClick={() => handleSuggestedAction(action.action)}
                >
                  <Icon className="h-4 w-4 mr-3 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about errors, incidents, or troubleshooting..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
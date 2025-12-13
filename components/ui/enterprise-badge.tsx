import { Badge } from "./badge"
import { Crown } from "lucide-react"
import { cn } from "../../lib/utils"

interface EnterpriseBadgeProps {
  className?: string
  variant?: "default" | "outline"
  size?: "sm" | "default"
}

export function EnterpriseBadge({ 
  className, 
  variant = "outline",
  size = "default" 
}: EnterpriseBadgeProps) {
  return (
    <Badge 
      variant={variant}
      className={cn(
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        size === "sm" && "text-xs px-1.5 py-0.5",
        className
      )}
    >
      <Crown className={cn("mr-1", size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")} />
      Enterprise
    </Badge>
  )
}
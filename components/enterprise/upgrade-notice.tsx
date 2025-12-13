import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { EnterpriseBadge } from "../ui/enterprise-badge"
import { ArrowRight } from "lucide-react"

interface UpgradeNoticeProps {
  feature: string
  description: string
  className?: string
}

export function UpgradeNotice({ 
  feature, 
  description, 
  className 
}: UpgradeNoticeProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">{feature}</h4>
              <EnterpriseBadge size="sm" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/pricing">
              View Plans
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
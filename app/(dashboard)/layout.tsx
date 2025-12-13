"use client"

import { EnterpriseLayout } from "@/components/layout/enterprise-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EnterpriseLayout>{children}</EnterpriseLayout>
}
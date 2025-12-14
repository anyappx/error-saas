import { DocLayout } from "../../components/layout/doc-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DocLayout>{children}</DocLayout>
}
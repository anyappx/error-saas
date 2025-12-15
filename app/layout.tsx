import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kubernetes Error Documentation',
  description: 'Comprehensive documentation and troubleshooting guide for Kubernetes errors, issues, and operational challenges.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
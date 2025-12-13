import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kubernetes Error Fix Atlas',
  description: 'Get instant explanations and fixes for Kubernetes errors'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { cn } from '../lib/utils'
import { ThemeProvider } from '../components/providers/theme-provider'
import { ToastProvider } from '../components/providers/toast-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Kubernetes Error Documentation',
    template: '%s | Kubernetes Error Docs'
  },
  description: 'Comprehensive documentation and troubleshooting guide for Kubernetes errors, issues, and operational challenges.',
  keywords: [
    'kubernetes errors',
    'kubernetes troubleshooting',
    'k8s documentation',
    'container orchestration',
    'kubernetes debugging',
    'devops documentation',
    'infrastructure troubleshooting'
  ],
  authors: [{ name: 'Kubernetes Documentation Team' }],
  creator: 'Kubernetes Error Documentation',
  metadataBase: new URL('https://k8s-errors.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://k8s-errors.dev',
    title: 'Kubernetes Error Documentation',
    description: 'Comprehensive documentation for Kubernetes errors and troubleshooting',
    siteName: 'Kubernetes Error Docs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kubernetes Error Documentation',
    description: 'Comprehensive documentation for Kubernetes errors and troubleshooting',
    creator: '@k8s_docs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={cn(
        'min-h-screen font-sans antialiased stripe-font-primary stripe-bg-primary',
        inter.variable,
        jetbrainsMono.variable
      )}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
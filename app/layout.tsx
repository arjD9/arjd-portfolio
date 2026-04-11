import React from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arjun Dindigal',
  description: 'Mechatronics Engineer — design, fabrication, and code.',
  openGraph: {
    title: 'Arjun Dindigal',
    description: 'Mechatronics Engineering student at Waterloo. Building things that move, compute, and last.',
    url: 'https://arjundindigal.github.io',
    siteName: 'Arjun Dindigal',
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clipstash — Copy-Paste Across All Your Devices',
  description: 'Save and sync clipboard content across all your devices with no friction.',
  // Add this block to point to your PNG file
  icons: {
    icon: '/clipstash-logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
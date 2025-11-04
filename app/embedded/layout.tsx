import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LegalEase AI - Embedded',
  description: 'Legal Document Translation',
}

export default function EmbeddedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen overflow-auto">
          {children}
        </div>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { Martian_Mono } from 'next/font/google'

const martianMono = Martian_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-martian',
  adjustFontFallback: false
})

export const metadata: Metadata = {
  title: 'Time of code',
  description: 'Programming tutorials and resources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${martianMono.variable}`}>
      <body className={`${martianMono.className}`}>
        {children}
      </body>
    </html>
  )
}
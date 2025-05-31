import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
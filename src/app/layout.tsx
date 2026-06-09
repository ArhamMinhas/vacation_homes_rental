import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "StayFinder — Vacation Homes Rental",
  description: "Find and book your perfect vacation home",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

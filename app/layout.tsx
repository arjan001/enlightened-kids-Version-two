import type React from "react"
import type { Metadata } from "next"
import { Fredoka, Quicksand } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/cart-context"

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
})

export const metadata: Metadata = {
  title: "Enlightened Kids Africa",
  description: "Enlightened Kids Africa",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fredoka.variable} ${quicksand.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>{children}</CartProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter, Fredoka, Quicksand } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"

const inter = Inter({ subsets: ["latin"] })

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
})
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
})

export const metadata: Metadata = {
  title: "Enlightened Kids Africa",
  description: "Empowering children through culturally rich stories and educational content",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/enlightened-kids-africa-logo-symbol.svg" sizes="any" type="image/svg+xml" />
      </head>
      <body className={`${fredoka.variable} ${quicksand.variable} font-fredoka`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}

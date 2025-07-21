import type React from "react"
import type { Metadata } from "next"
import { Fredoka, Quicksand } from "next/font/google" // Import Fredoka and Quicksand
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { cn } from "@/lib/utils" // Import cn utility

// Define Fredoka font with semibold (600) weight and CSS variable
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["600"], // Semibold
  variable: "--font-fredoka",
})

// Define Quicksand font with medium (500) weight and CSS variable
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500"], // Medium
  variable: "--font-quicksand",
})

export const metadata: Metadata = {
  title: "Enlightened Kids Africa",
  description: "Empowering children through culturally rich stories and educational content",
  generator: "v0.dev",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(fredoka.variable, quicksand.variable)}>
      <body className={cn("font-fredoka", fredoka.className)}>
        {" "}
        {/* Apply Fredoka as default body font and its class */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}

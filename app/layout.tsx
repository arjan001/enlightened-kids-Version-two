import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google" // Import Roboto_Mono
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import Header from "@/components/header" // Import Header
import Footer from "@/components/footer" // Import Footer

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" }) // Define Inter as a CSS variable
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" }) // Define Roboto Mono as a CSS variable

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
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>
        <CartProvider>
          <Header /> {/* Render Header here */}
          {children}
          <Footer /> {/* Render Footer here */}
        </CartProvider>
      </body>
    </html>
  )
}

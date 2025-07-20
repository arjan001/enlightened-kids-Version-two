import type React from "react"
import type { Metadata } from "next"
import { Fredoka, Quicksand } from "next/font/google" // Import Fredoka and Quicksand
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

// Configure Fredoka for primary font (semibold)
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Include semibold (600)
  variable: "--font-fredoka",
})

// Configure Quicksand for secondary font (medium)
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Include medium (500)
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${fredoka.variable} ${quicksand.variable}`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  )
}

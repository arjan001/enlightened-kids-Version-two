"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 text-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105">
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-indigo-700 mb-4 animate-bounce">404</h1>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {
            "Oops! The page you're looking for seems to have vanished into the digital ether. It might have been moved, deleted, or never existed."
          }
        </p>
        <Link href="/" passHref>
          <Button className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 ease-in-out transform hover:-translate-y-1">
            Go to Homepage
          </Button>
        </Link>
      </div>

      {/* Scroll to top button - positioned absolutely */}
      <button
        className="absolute bottom-8 right-8 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  )
}

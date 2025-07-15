"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-center px-4 py-12">
      <style jsx>{`
        .oops-text {
          font-size: 10rem; /* Adjust as needed for responsiveness */
          font-weight: 900;
          line-height: 1;
          color: #3a2d6b; /* A deep, dark purple to mimic the original feel without the image */
          margin-bottom: 1rem;
          text-shadow: 
            -1px -1px 0 #2a1f4d,  
            1px -1px 0 #2a1f4d,
            -1px 1px 0 #2a1f4d,
            1px 1px 0 #2a1f4d,
            2px 2px 4px rgba(0,0,0,0.3); /* Subtle shadow for depth */
        }
        @media (max-width: 768px) {
          .oops-text {
            font-size: 6rem;
          }
        }
        @media (max-width: 480px) {
          .oops-text {
            font-size: 4rem;
          }
        }
      `}</style>
      <h1 className="oops-text">Oops!</h1>
      <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 text-lg max-w-md mb-8">
        {"The page you are looking for might have been removed had its name changed or is temporarily unavailable."}
      </p>
      <Link href="/" passHref>
        <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg">
          GO TO HOMEPAGE
        </Button>
      </Link>

      {/* Scroll to top button - positioned absolutely */}
      <button
        className="absolute bottom-8 right-8 bg-gray-200 p-3 rounded-full shadow-md hover:bg-gray-300 transition-colors duration-200"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  )
}

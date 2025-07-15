"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-center px-4 py-12">
      <style jsx>{`
        .oops-galaxy-text {
          font-size: 10rem; /* Large size for impact */
          font-weight: 900; /* Extra bold */
          line-height: 1;
          margin-bottom: 1rem;
          background-image: url('/galaxy-background.png'); /* Use the provided galaxy image */
          background-size: cover;
          background-position: center;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent; /* Make text transparent to show background */
          text-shadow: 
            -1px -1px 0 #000,  /* Outline for better contrast */
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
        }
        @media (max-width: 768px) {
          .oops-galaxy-text {
            font-size: 6rem;
          }
        }
        @media (max-width: 480px) {
          .oops-galaxy-text {
            font-size: 4rem;
          }
        }
      `}</style>
      <h1 className="oops-galaxy-text">Oops!</h1>
      <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase mb-4">404 - PAGE NOT FOUND</h2>
      <p className="text-gray-600 text-lg max-w-md mb-8">
        {"The page you are looking for might have been removed had its name changed or is temporarily unavailable."}
      </p>
      <Link href="/" passHref>
        <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg uppercase">
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

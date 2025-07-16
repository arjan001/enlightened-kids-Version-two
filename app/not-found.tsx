import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      {/* Stars/Cosmic Dust */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-1 w-1 animate-pulse rounded-full bg-white shadow-white" />
        <div className="absolute top-1/2 right-1/3 h-0.5 w-0.5 animate-pulse rounded-full bg-white shadow-white animation-delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-white animation-delay-2000" />
        <div className="absolute top-1/3 right-1/4 h-0.5 w-0.5 animate-pulse rounded-full bg-white shadow-white animation-delay-3000" />
        <div className="absolute bottom-1/2 left-1/2 h-1 w-1 animate-pulse rounded-full bg-white shadow-white animation-delay-4000" />
        <div className="absolute top-2/3 left-1/5 h-0.5 w-0.5 animate-pulse rounded-full bg-white shadow-white animation-delay-5000" />
        <div className="absolute top-1/5 right-1/5 h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-white animation-delay-6000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-9xl font-extrabold tracking-widest text-white drop-shadow-lg">404</h1>
        <div className="absolute rotate-12 rounded-md bg-orange-500 px-2 text-sm tracking-wider text-white">
          PAGE NOT FOUND
        </div>
        <p className="mt-5 text-lg text-gray-300">Oops! The page you're looking for doesn't exist.</p>
        <Link href="/">
          <Button className="mt-8 rounded-full bg-orange-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-purple-900">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

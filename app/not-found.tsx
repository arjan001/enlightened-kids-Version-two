"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Rocket } from "lucide-react"

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#050816] to-[#000] text-white">
      {/* Starfield */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-[spin_120s_linear_infinite] bg-[url('/placeholder.svg?height=800&width=800')] opacity-20"
        style={{
          maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 70%)",
        }}
      />

      <h1 className="text-[10rem] leading-none tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">404</h1>
      <p className="mb-8 text-center text-xl sm:text-2xl">
        Lost in space. The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>

      <Button asChild size="lg" className="gap-2">
        <Link href="/">
          <Rocket className="h-5 w-5" />
          Take me home
        </Link>
      </Button>

      <div className="mt-16 flex flex-wrap gap-4 opacity-60">
        {[...Array(8)].map((_, i) => (
          <Star key={i} className="h-4 w-4 animate-pulse" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </div>
    </main>
  )
}

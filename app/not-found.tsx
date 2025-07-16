"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <section
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-center",
      )}
    >
      {/* Star field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-[starfield_100s_linear_infinite]"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)",
          backgroundPosition: "0 0, 25px 25px",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Cosmic gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.indigo.600)/40,transparent)]"
      />

      <h1 className="z-10 text-8xl font-black tracking-tight text-foreground drop-shadow-lg sm:text-9xl">404</h1>
      <p className="z-10 mt-4 max-w-md text-balance text-lg text-muted-foreground md:text-xl">
        Oops! The page you’re looking for drifted off into space.
      </p>

      <Button asChild size="lg" className="z-10 mt-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </section>
  )
}

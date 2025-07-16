"use client"

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
      {/* Decorative stars */}
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-[url('/placeholder.svg?height=800&width=800')] opacity-10" />

      <h1 className="z-10 text-9xl font-extrabold tracking-wider text-white/90">404</h1>
      <p className="z-10 mt-4 max-w-lg text-center text-lg text-white/80">
        Oops! The page you&rsquo;re looking for has drifted off into space.
      </p>

      <a
        href="/"
        className="z-10 mt-8 rounded-md bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/20"
      >
        Take me home
      </a>

      {/* Subtle moving nebula effect */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-purple-500 opacity-30 blur-3xl"
        style={{ animation: "spin 40s linear infinite" }}
      />
      <style jsx>{`
        @keyframes spin {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }
      `}</style>
    </main>
  )
}

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Galaxy Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 blur-sm"
        style={{
          backgroundImage: `url(/galaxy-background.png)`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 text-center p-8 rounded-lg shadow-xl bg-black/20 backdrop-blur-md border border-white/10">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-pulse">404</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6">Oops! The page you are looking for could not be found.</p>
        <Link href="/" className="inline-block">
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors duration-300 shadow-md">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  )
}

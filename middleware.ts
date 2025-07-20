import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

/**
 * Global middleware that protects /admin routes.
 */
export async function middleware(request: NextRequest) {
  // The createClient function in lib/supabase/middleware.ts returns { supabase, response }
  // We need to capture both the supabase client and the modified response.
  const { supabase, response } = await createClient(request)

  // This check ensures that 'supabase' is defined before attempting to call 'getSession' on it.
  // If for any reason the client creation fails, it will redirect to login.
  if (!supabase) {
    console.error("Supabase client was not initialized in middleware. Redirecting to login.")
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // 1. Block unauthenticated access to /admin/*
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // 2. Prevent authenticated users from returning to the login page
  if (pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
}

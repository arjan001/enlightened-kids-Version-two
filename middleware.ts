import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

/**
 * Global middleware that protects /admin routes.
 */
export async function middleware(request: NextRequest) {
  // Initialise Supabase with request/response cookie helpers
  // This createClient function returns { supabase, response }
  const { supabase, response: supabaseResponse } = await createClient(request) // Capture the response from createClient

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

  return supabaseResponse // Return the response object that Supabase potentially modified
}

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
}

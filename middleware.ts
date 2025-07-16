import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createClient(request, response)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (request.nextUrl.pathname.startsWith("/admin") && !session) {
    const redirectUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Check if the user is trying to access the login page while already logged in
  if (request.nextUrl.pathname === "/admin/login" && session) {
    const redirectUrl = new URL("/admin", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
}

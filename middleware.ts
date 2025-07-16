import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createClient(request, response)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect everything under /admin
  if (request.nextUrl.pathname.startsWith("/admin") && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Prevent authenticated users from visiting the login page
  if (request.nextUrl.pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
}

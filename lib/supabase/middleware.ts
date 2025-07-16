import { createMiddlewareClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"

/**
 * Returns a Supabase client that works inside Next.js middleware.
 *
 * The helper automatically keeps cookies in-sync so that
 * `supabase.auth.getSession()` works without any extra wiring.
 */
export function createClient(request: NextRequest, response: NextResponse) {
  return createMiddlewareClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    request,
    response,
  })
}

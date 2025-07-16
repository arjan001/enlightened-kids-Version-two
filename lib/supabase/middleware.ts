import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import type { NextRequest, NextResponse } from "next/server"

/**
 * Returns a Supabase client that works inside Next.js middleware.
 * The auth-helpers package automatically keeps cookies in sync, so
 * `supabase.auth.getSession()` works without extra wiring.
 */
export function createClient(req: NextRequest, res: NextResponse) {
  return createMiddlewareClient({ req, res })
}

import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"
import type { NextRequest, NextResponse } from "next/server"

/**
 * Supabase helper for Next.js middleware.
 *
 * Uses the standard ESM SDK (`@supabase/supabase-js`) instead of the
 * experimental `@supabase/ssr`, which is not available in the preview runtime.
 *
 * Because middleware is a stateless environment, we disable automatic session
 * persistence and URL-based session detection.
 */
export function createClient(_request: NextRequest, _response: NextResponse): SupabaseClient {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

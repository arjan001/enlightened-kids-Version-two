import { createServerClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"

/**
 * Factory that returns a Supabase client for Next.js middleware.
 * It keeps cookies in-sync using the getAll / setAll helpers
 * recommended by Supabase for the App Router.
 */
export function createClient(request: NextRequest, response: NextResponse) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      // Read ALL cookies that came with the request
      getAll() {
        return request.cookies.getAll()
      },

      /**
       * Write ALL cookies that Supabase wants to set on the response.
       * We **must** loop and set them individually; do NOT use get / set / remove.
       */
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}

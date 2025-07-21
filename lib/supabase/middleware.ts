import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export function createClient(request: NextRequest) {
  // Create the response object once at the beginning.
  // This 'response' object will be mutated directly by the Supabase cookie handlers.
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Explicitly check if environment variables are set and not empty.
  // If not, return a null supabase client to prevent runtime errors.
  if (!supabaseUrl || supabaseUrl.trim() === "" || !supabaseAnonKey || supabaseAnonKey.trim() === "") {
    console.error(
      "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing or empty for middleware. Returning null Supabase client.",
    )
    // Return null for supabase if env vars are missing, but still return the response object.
    return { supabase: null, response }
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        // Directly set the cookie on the request and the *original* response object.
        // DO NOT reassign 'response' here.
        request.cookies.set({ name, value, ...options })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        // Directly remove the cookie from the request and the *original* response object.
        // DO NOT reassign 'response' here.
        request.cookies.set({ name, value: "", ...options })
        response.cookies.set({ name, value: "", ...options })
      },
    },
  })

  return { supabase, response }
}

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export function createClient(request: NextRequest) {
  // Create an unmodified response. This is important for the initial response
  // before any cookies are set or removed by Supabase.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the request's cookies and the response's cookies.
          // This ensures that the updated cookie is available for subsequent checks in the same request
          // and is also sent back to the client in the response headers.
          request.cookies.set({ name, value, ...options })
          // Recreate the response to ensure the new cookies are included.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, remove it from the request's cookies and the response's cookies.
          request.cookies.set({ name, value: "", ...options })
          // Recreate the response to ensure the cookie removal is included.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    },
  )

  return { supabase, response }
}

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server actions
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
            // This error is typically caused by an attempt to set a cookie from a Client Component.
            // Many of these are fixed by moving `createClient()` to a Server Action or Server Component.
            console.warn("Attempted to set cookie from client component:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
            // This error is typically caused by an attempt to set a cookie from a Client Component.
            // Many of these are fixed by moving `createClient()` to a Server Action or Server Component.
            console.warn("Attempted to remove cookie from client component:", error)
          }
        },
      },
    },
  )
}

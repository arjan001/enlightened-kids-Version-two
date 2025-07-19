import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Declare a variable to hold the single client instance
let supabase: SupabaseClient | undefined

export function createClient() {
  // If the client instance already exists, return it
  if (supabase) {
    return supabase
  }

  // Otherwise, create a new client instance and store it
  supabase = supabaseCreateClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return supabase
}

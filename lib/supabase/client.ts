import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

export function getClient() {
  return supabaseCreateClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

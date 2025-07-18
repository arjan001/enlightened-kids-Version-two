import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

export function getSupabaseClient(): SupabaseClient {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // still service-role on the server
  )
}

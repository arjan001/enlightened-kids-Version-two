import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/products/first
 * Returns the very first product row so the “/books” page
 * can render without importing server-side helpers in the client bundle.
 */
export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single()

  if (error) {
    console.error("Failed to fetch first product:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

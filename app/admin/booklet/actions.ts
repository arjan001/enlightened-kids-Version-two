"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server" // anon / public client  – safe for storage
import { createClient as createAdminClient } from "@supabase/supabase-js" // privileged client for DB writes

// Helper: privileged client that bypasses RLS (server-side only)
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key (never sent to browser)
    { auth: { persistSession: false } },
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   fetch latest booklet (public read – OK with RLS)
   ────────────────────────────────────────────────────────────────────────── */
export async function getBooklet() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("booklets")
    .select("id, name, url, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // “no rows” error => code PGRST116 – treat as empty
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching booklet:", error)
    return null
  }
  return data
}

/* ────────────────────────────────────────────────────────────────────────────
   upload / replace booklet
   ────────────────────────────────────────────────────────────────────────── */
export async function uploadBooklet(formData: FormData) {
  const supabase = createClient() // anon (public) – fine for storage
  const supabaseAdmin = getAdminClient() // privileged – for table writes

  const file = formData.get("bookletFile") as File | null
  const currentBookletId = formData.get("currentBookletId") as string | null
  const currentBookletUrl = formData.get("currentBookletUrl") as string | null

  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." }
  }

  /* ── 1. Upload the new file to Storage ─────────────────────────────── */
  const fileExt = file.name.split(".").pop()
  const fileName = `booklet-${Date.now()}.${fileExt}`
  const storageKey = `booklets/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from("booklets")
    .upload(storageKey, file, { cacheControl: "3600", upsert: false })

  if (uploadError) {
    console.error("Storage Upload Error:", uploadError)
    return { success: false, error: `Failed to upload file: ${uploadError.message}` }
  }

  const { data: publicUrlData } = supabase.storage.from("booklets").getPublicUrl(storageKey)
  const publicUrl = publicUrlData.publicUrl

  /* ── 2. Delete previous file from Storage (if replacing) ───────────── */
  if (currentBookletUrl) {
    const segments = currentBookletUrl.split("/")
    const oldStorageKey = `${segments.at(-2)}/${segments.at(-1)}`
    const { error: delErr } = await supabase.storage.from("booklets").remove([oldStorageKey])
    if (delErr) console.warn("Could not delete old booklet file:", delErr.message)
  }

  /* ── 3. Insert or Update row using admin client (bypasses RLS) ─────── */
  if (currentBookletId) {
    // update existing record
    const { error: updateError } = await supabaseAdmin
      .from("booklets")
      .update({ name: file.name, url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", currentBookletId)

    if (updateError) {
      console.error("DB Update Error:", updateError)
      return { success: false, error: `Failed to update booklet record: ${updateError.message}` }
    }
  } else {
    // insert new record
    const { error: insertError } = await supabaseAdmin.from("booklets").insert({ name: file.name, url: publicUrl })

    if (insertError) {
      console.error("DB Insert Error:", insertError)
      return { success: false, error: `Failed to insert booklet record: ${insertError.message}` }
    }
  }

  /* ── 4. Re-validate cache & done ───────────────────────────────────── */
  revalidatePath("/admin/booklet")
  return {
    success: true,
    message: currentBookletId ? "Booklet replaced successfully!" : "Booklet uploaded successfully!",
  }
}

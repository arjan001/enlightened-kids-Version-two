"use client"

import { createClient } from "@/lib/supabase/client"

const BLOG_BUCKET_NAME = "blog-bucket"
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function uploadBlogImage(file: File): Promise<string> {
  if (file.size > MAX_SIZE) throw new Error("Image is too large (max 5 MB)")

  const supabase = createClient()
  const filePath = `${crypto.randomUUID()}.${file.name.split(".").pop()}`

  const { error } = await supabase.storage.from(BLOG_BUCKET_NAME).upload(filePath, file, { upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from(BLOG_BUCKET_NAME).getPublicUrl(filePath)

  return data.publicUrl
}

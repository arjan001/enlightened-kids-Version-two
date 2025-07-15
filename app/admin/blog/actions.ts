"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

const BLOG_BUCKET_NAME = "blog-bucket" // <-- your Storage bucket
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

/* -------------------------------- Helpers -------------------------------- */

async function uploadBlogImageInternal(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Please upload files under 5 MB.`)
  }

  const ext = file.name.split(".").pop() ?? "png"
  const fileName = `${uuidv4()}.${ext}`

  const supabase = createClient() // service-role key on the server
  try {
    const { data, error } = await supabase.storage.from(BLOG_BUCKET_NAME).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    })

    if (error) throw error

    const { data: publicUrl } = supabase.storage.from(BLOG_BUCKET_NAME).getPublicUrl(data.path)

    return publicUrl.publicUrl
  } catch (err: any) {
    // Supabase sometimes returns HTML (e.g. 413) → JSON parse fails
    const friendly =
      err?.message?.includes("413") || err?.status === 413 ? "Image too large for the Storage plan limit." : err.message

    throw new Error(`Failed to upload blog image: ${friendly}`)
  }
}

async function deleteBlogImageInternal(imageUrl?: string) {
  if (!imageUrl) return
  const parts = imageUrl.split("/")
  const idx = parts.indexOf(BLOG_BUCKET_NAME)
  if (idx === -1 || idx + 1 >= parts.length) return

  const supabase = createClient()
  await supabase.storage.from(BLOG_BUCKET_NAME).remove([parts.slice(idx + 1).join("/")])
}

/* --------------------------- Blog CRUD actions --------------------------- */

export async function getBlogPosts() {
  const supabase = createClient()
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch blog posts: ${error.message}`)
  return data
}

export async function getBlogPostById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

  if (error) return null
  return data
}

export async function addBlogPost(formData: FormData) {
  const supabase = createClient()

  const title = String(formData.get("title"))
  const author = String(formData.get("author") ?? "")
  const content = String(formData.get("content") ?? "")
  const is_published = formData.get("isPublished") === "on"

  /* ---------- image ---------- */
  let image_url: string | null = null
  const file = formData.get("image") as File | null
  if (file?.size) {
    image_url = await uploadBlogImageInternal(file)
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ title, author, content, image_url, is_published })
    .select()
    .single()

  if (error) throw new Error(`Failed to add blog post: ${error.message}`)

  revalidatePath("/admin/blog")
  if (is_published) revalidatePath("/blog")

  return { success: true, data }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = createClient()

  const title = String(formData.get("title"))
  const author = String(formData.get("author") ?? "")
  const content = String(formData.get("content") ?? "")
  const is_published = formData.get("isPublished") === "on"
  const currentUrl = String(formData.get("currentImageUrl") ?? "")

  let image_url: string | null = currentUrl
  const file = formData.get("image") as File | null

  if (file?.size) {
    if (image_url) await deleteBlogImageInternal(image_url)
    image_url = await uploadBlogImageInternal(file)
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ title, author, content, image_url, is_published })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update blog post: ${error.message}`)

  revalidatePath("/admin/blog")
  revalidatePath(`/blog/${id}`)
  revalidatePath("/blog")

  return { success: true, data }
}

export async function deleteBlogPost(id: string, imageUrl?: string) {
  const supabase = createClient()
  if (imageUrl) await deleteBlogImageInternal(imageUrl)

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete blog post: ${error.message}`)

  revalidatePath("/admin/blog")
  revalidatePath(`/blog/${id}`)
  revalidatePath("/blog")
  return { success: true }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const BLOG_BUCKET_NAME = "blog-bucket"

interface BlogPostFormFields {
  title: string
  excerpt?: string
  content: string
  author: string
  tags?: string[]
  category?: string
  read_time?: string
  published_at?: string // Date string
  is_published: boolean
}

export async function getBlogPosts(onlyPublished = false) {
  const supabase = createClient()
  let query = supabase.from("blog_posts").select("*").order("published_at", { ascending: false })

  if (onlyPublished) {
    query = query.eq("is_published", true)
  }

  const { data, error } = await query
  if (error) {
    console.error("Error fetching blog posts:", error)
    throw new Error(`Failed to fetch blog posts: ${error.message}`)
  }
  return data
}

export async function addBlogPost(formData: FormData) {
  const supabase = createClient()

  const tagsString = String(formData.get("tags") ?? "")
  const tagsArray = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

  const fields: BlogPostFormFields = {
    title: String(formData.get("title")),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content")),
    author: String(formData.get("author")),
    tags: tagsArray, // This is correctly handled as an array, nullable in schema
    category: String(formData.get("category") ?? ""),
    read_time: String(formData.get("readTime") ?? ""),
    published_at: String(formData.get("publishedAt") ?? new Date().toISOString()),
    is_published: formData.get("isPublished") === "on",
  }

  const image_url = String(formData.get("imageUrl") ?? "")

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...fields, image_url })
    .select()
    .single()
  if (error) {
    console.error("Error adding blog post:", error)
    return { success: false, message: `Failed to add blog post: ${error.message}` }
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return { success: true, message: "Blog post added successfully!", data }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = createClient()

  const tagsString = String(formData.get("tags") ?? "")
  const tagsArray = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

  const fields: BlogPostFormFields = {
    title: String(formData.get("title")),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content")),
    author: String(formData.get("author")),
    tags: tagsArray, // This is correctly handled as an array, nullable in schema
    category: String(formData.get("category") ?? ""),
    read_time: String(formData.get("readTime") ?? ""),
    published_at: String(formData.get("publishedAt") ?? new Date().toISOString()),
    is_published: formData.get("isPublished") === "on",
  }

  const image_url = String(formData.get("imageUrl") ?? "")

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ ...fields, image_url, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) {
    console.error("Error updating blog post:", error)
    return { success: false, message: `Failed to update blog post: ${error.message}` }
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return { success: true, message: "Blog post updated successfully!", data }
}

export async function deleteBlogPost(id: string, imageUrl?: string) {
  const supabase = createClient()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, message: `Failed to delete blog post: ${error.message}` }
  }
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return { success: true, message: "Blog post deleted successfully!" }
}

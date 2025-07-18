"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addBlogPost(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const imageUrl = formData.get("imageUrl") as string
  const category = formData.get("category") as string
  const readTime = Number.parseInt(formData.get("readTime") as string)
  const isPublished = formData.get("isPublished") === "on"

  const { error } = await supabase.from("blog_posts").insert({
    title,
    content,
    image_url: imageUrl,
    category,
    read_time: readTime,
    is_published: isPublished,
    author_id: user.id,
  })

  if (error) {
    console.error("Error creating blog post:", error)
    return { success: false, message: "Failed to create blog post." }
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath("/") // Revalidate homepage to show new blog posts
  return { success: true, message: "Blog post created successfully!" }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const imageUrl = formData.get("imageUrl") as string
  const category = formData.get("category") as string
  const readTime = Number.parseInt(formData.get("readTime") as string)
  const isPublished = formData.get("isPublished") === "on"

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      content,
      image_url: imageUrl,
      category,
      read_time: readTime,
      is_published: isPublished,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating blog post:", error)
    return { success: false, message: "Failed to update blog post." }
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath("/") // Revalidate homepage to show updated blog posts
  return { success: true, message: "Blog post updated successfully!" }
}

export async function deleteBlogPost(id: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, message: "Failed to delete blog post." }
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath("/") // Revalidate homepage to remove deleted blog posts
  return { success: true, message: "Blog post deleted successfully!" }
}

export async function getBlogPosts() {
  const supabase = createClient()
  const { data: blogPosts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
  return blogPosts
}

export async function getBlogPostById(id: string) {
  const supabase = createClient()
  const { data: blogPost, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching blog post by ID:", error)
    return null
  }
  return blogPost
}

export async function getPublishedBlogPosts() {
  const supabase = createClient()
  const { data: blogPosts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(2) // Limit to 2 for the homepage section

  if (error) {
    console.error("Error fetching published blog posts:", error)
    return []
  }
  return blogPosts
}

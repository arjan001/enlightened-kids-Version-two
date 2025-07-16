"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { BOOKS_BUCKET_NAME } from "@/constants" // Declare the variable here

export interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  created_at: string
  updated_at: string | null
}

export interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  image_url: string | null
  created_at: string
  is_published: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export async function getCustomers() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, customer_first_name, customer_last_name, customer_email, customer_phone, customer_address, customer_city, customer_postal_code, created_at",
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    throw new Error(`Failed to fetch customers: ${error.message}`)
  }
  return data
}

export async function getBlogPosts() {
  const supabase = createClient()
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    throw new Error(`Failed to fetch blog posts: ${error.message}`)
  }
  return data
}

export async function getContactMessages() {
  const supabase = createClient()
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contact messages:", error)
    throw new Error(`Failed to delete contact message: ${error.message}`)
  }
  return data
}

export async function deleteBlogPost(id: string, imageUrl?: string) {
  const supabase = createClient()
  if (imageUrl) {
    await deleteImage(imageUrl)
  }
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) {
    console.error("Error deleting blog post:", error)
    throw new Error(`Failed to delete blog post: ${error.message}`)
  }
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteContactMessage(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)
  if (error) {
    console.error("Error deleting contact message:", error)
    throw new Error(`Failed to delete contact message: ${error.message}`)
  }
  revalidatePath("/admin")
  return { success: true }
}

async function deleteImage(imageUrl: string | undefined) {
  const supabase = createClient()
  if (!imageUrl) return

  const urlParts = imageUrl.split("/")
  const bucketIndex = urlParts.indexOf(BOOKS_BUCKET_NAME)
  if (bucketIndex === -1 || bucketIndex + 1 >= urlParts.length) {
    console.warn("Could not parse image path from URL for deletion:", imageUrl)
    return
  }
  const imagePath = urlParts.slice(bucketIndex + 1).join("/")

  if (imagePath) {
    const { error } = await supabase.storage.from(BOOKS_BUCKET_NAME).remove([imagePath])
    if (error) {
      console.warn("Failed to remove old image from storage:", error)
    }
  }
}

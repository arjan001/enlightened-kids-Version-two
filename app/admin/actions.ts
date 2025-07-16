"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  // country: string | null; // Removed as per user request
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

export async function getCustomers(): Promise<Customer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("customers")
    .select("id, first_name, last_name, email, phone, address, city, postal_code, created_at, updated_at") // Removed country
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }
  return data as Customer[]
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
  return data as BlogPost[]
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contact messages:", error)
    return []
  }
  return data as ContactMessage[]
}

export async function deleteBlogPost(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, message: "Failed to delete blog post." }
  }

  revalidatePath("/admin/blog")
  return { success: true, message: "Blog post deleted successfully." }
}

export async function deleteContactMessage(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)

  if (error) {
    console.error("Error deleting contact message:", error)
    return { success: false, message: "Failed to delete contact message." }
  }

  revalidatePath("/admin/contact")
  return { success: true, message: "Contact message deleted successfully." }
}

export async function updateBlogPostPublishStatus(id: string, isPublished: boolean) {
  const supabase = createClient()
  const { error } = await supabase.from("blog_posts").update({ is_published: isPublished }).eq("id", id)

  if (error) {
    console.error("Error updating publish status:", error)
    return { success: false, message: "Failed to update publish status." }
  }

  revalidatePath("/admin/blog")
  return { success: true, message: "Publish status updated successfully." }
}

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// Define interfaces for data structures
export interface BlogPost {
  id: string
  created_at: string
  title: string
  author: string
  content: string
  image_url: string | null
  is_published: boolean
}

export interface Product {
  id: string
  created_at: string
  name: string
  description: string
  price: number
  image_url: string | null
  category: string
  stock: number
}

export interface ContactMessage {
  id: string
  created_at: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
}

export interface Customer {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone_number: string | null
  street_address: string | null
  city: string | null
  postal_code: string | null
}

export interface Order {
  id: string
  created_at: string
  customer_id: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  ordered_products: any[] // JSONB type, can be more specific if needed
  total_amount: number
  shipping_cost: number
  payment_method: string
  order_notes: string | null
  status: string
}

// Helper to get Supabase client
function getSupabaseAdminClient() {
  const cookieStore = cookies()
  return createClient(cookieStore)
}

// Blog Post Actions
export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
  return data
}

export async function addBlogPost(formData: FormData) {
  const supabase = getSupabaseAdminClient()
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const content = formData.get("content") as string
  const imageUrl = formData.get("imageUrl") as string
  const isPublished = formData.get("isPublished") === "on"

  const { error } = await supabase
    .from("blog_posts")
    .insert({ title, author, content, image_url: imageUrl, is_published: isPublished })

  if (error) {
    console.error("Error adding blog post:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/blog")
  return { success: true }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = getSupabaseAdminClient()
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const content = formData.get("content") as string
  const imageUrl = formData.get("imageUrl") as string
  const isPublished = formData.get("isPublished") === "on"

  const { error } = await supabase
    .from("blog_posts")
    .update({ title, author, content, image_url: imageUrl, is_published: isPublished })
    .eq("id", id)

  if (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/blog")
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/blog")
  return { success: true }
}

// Product Actions
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data
}

export async function addProduct(formData: FormData) {
  const supabase = getSupabaseAdminClient()
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const imageUrl = formData.get("imageUrl") as string
  const category = formData.get("category") as string
  const stock = Number.parseInt(formData.get("stock") as string)

  const { error } = await supabase
    .from("products")
    .insert({ name, description, price, image_url: imageUrl, category, stock })

  if (error) {
    console.error("Error adding product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = getSupabaseAdminClient()
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const imageUrl = formData.get("imageUrl") as string
  const category = formData.get("category") as string
  const stock = Number.parseInt(formData.get("stock") as string)

  const { error } = await supabase
    .from("products")
    .update({ name, description, price, image_url: imageUrl, category, stock })
    .eq("id", id)

  if (error) {
    console.error("Error updating product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

// Contact Message Actions
export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching contact messages:", error)
    return []
  }
  return data
}

export async function updateContactMessageStatus(id: string, isRead: boolean) {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id)

  if (error) {
    console.error("Error updating contact message status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/contact")
  return { success: true }
}

export async function deleteContactMessage(id: string) {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)

  if (error) {
    console.error("Error deleting contact message:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/contact")
  return { success: true }
}

// Customer Actions
export async function getCustomers(): Promise<Customer[]> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }
  return data
}

// Order Actions
export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }
  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("orders").update({ status }).eq("id", id)

  if (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/orders")
  return { success: true }
}

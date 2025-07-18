"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { BOOKS_BUCKET_NAME } from "@/constants"
import { createClient } from "@/lib/supabase/server" // server-side client
import type { SupabaseClient } from "@supabase/supabase-js" // Declare SupabaseClient

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface Customer {
  id: string
  customer_name: string
  customer_email: string
  phone_number: string | null
  shipping_address_line1: string | null
  shipping_city: string | null
  shipping_country: string | null
  created_at: string // aliased from order_date
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

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  phone_number: string | null
  shipping_address_line1: string
  shipping_city: string
  shipping_country: string
  total_amount: number
  status: "pending" | "completed" | "shipped" | "cancelled"
  order_date: string
  order_items: Array<{
    product_id: string
    title: string
    quantity: number
    price: number
  }>
}

/* -------------------------------------------------------------------------- */
/*                                DASHBOARD DATA                              */
/* -------------------------------------------------------------------------- */

export async function getCustomers() {
  const supabase: SupabaseClient = createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        customer_name,
        customer_email,
        phone_number,
        shipping_address_line1,
        shipping_city,
        shipping_country,
        created_at:order_date
      `,
    )
    .order("order_date", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    throw new Error(`Failed to fetch customers: ${error.message}`)
  }

  return data as Customer[]
}

export async function getOrders() {
  const supabase: SupabaseClient = createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        customer_name,
        customer_email,
        phone_number,
        shipping_address_line1,
        shipping_city,
        shipping_country,
        total_amount,
        status,
        order_date,
        order_items:ordered_products
      `,
    )
    .order("order_date", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return data as Order[]
}

/**
 * Fetches the count of orders with 'pending' status.
 */
export async function getPendingOrdersCount(): Promise<number> {
  const supabase: SupabaseClient = createClient()
  const { count, error } = await supabase.from("orders").select("id", { count: "exact" }).eq("status", "pending")

  if (error) {
    console.error("Error fetching pending orders count:", error)
    throw new Error(`Failed to fetch pending orders count: ${error.message}`)
  }

  return count || 0
}

/**
 * Updates the status of an existing order.
 * NOTE: we removed the non-existent updated_at column.
 */
export async function updateOrderStatus(orderId: string, newStatus: Order["status"]) {
  const supabase: SupabaseClient = createClient()

  console.log(`[Server Action] Attempting to update order ${orderId} to status: ${newStatus}`)

  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus }) // ← ONLY the column that exists
    .eq("id", orderId)

  if (error) {
    console.error("[Server Action] Error updating order status:", error)
    throw new Error(`Failed to update order status: ${error.message}`)
  }

  console.log(`[Server Action] Successfully updated order ${orderId}. Supabase response data:`, data)
  revalidatePath("/admin")
  return { success: true }
}

export async function getBlogPosts() {
  const supabase: SupabaseClient = createClient()
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    throw new Error(`Failed to fetch blog posts: ${error.message}`)
  }
  return data as BlogPost[]
}

export async function getContactMessages() {
  const supabase: SupabaseClient = createClient()
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contact messages:", error)
    throw new Error(`Failed to fetch contact messages: ${error.message}`)
  }
  return data as ContactMessage[]
}

/* -------------------------------------------------------------------------- */
/*                                BLOG HELPERS                                */
/* -------------------------------------------------------------------------- */

export async function deleteBlogPost(id: string, imageUrl?: string) {
  const supabase: SupabaseClient = createClient() // Changed to server client
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
  const supabase: SupabaseClient = createClient()
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)
  if (error) {
    console.error("Error deleting contact message:", error)
    throw new Error(`Failed to delete contact message: ${error.message}`)
  }
  revalidatePath("/admin")
  return { success: true }
}

/* -------------------------------------------------------------------------- */
/*                              STORAGE HELPERS                               */
/* -------------------------------------------------------------------------- */

async function deleteImage(imageUrl: string | undefined) {
  const supabase: SupabaseClient = createClient() // Changed to server client
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
    if (error) console.warn("Failed to remove old image from storage:", error)
  }
}

/**
 * Upload a file to Supabase Storage and return the public URL.
 */
async function uploadImage(file: File): Promise<string | null> {
  const supabase: SupabaseClient = createClient()
  if (!file || file.size === 0) return null

  // 🔒 5 MB safety-limit – edit to taste.
  const MAX_SIZE = 5 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    throw new Error("Image is larger than 5 MB. Please upload a smaller file.")
  }

  const extension = file.name.split(".").pop() || "png"
  const filePath = `${randomUUID()}.${extension}`

  try {
    const { error: uploadError } = await supabase.storage
      .from(BOOKS_BUCKET_NAME)
      .upload(filePath, file, { contentType: file.type })

    if (uploadError) throw uploadError
  } catch (err: any) {
    /* Supabase returns plain-text on 413 -> JSON parse fails -> err.message starts with
       ‘Unexpected token’ – turn that into a friendly message. */
    if (err.message?.startsWith("Unexpected token")) {
      throw new Error("Upload failed: file too large (Supabase 413). Try a smaller image.")
    }
    throw new Error(`Failed to upload image: ${err.message}`)
  }

  // Public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BOOKS_BUCKET_NAME).getPublicUrl(filePath)

  return publicUrl
}

/**
 * Create a new product.
 */
export async function addProduct(formData: FormData) {
  const supabase: SupabaseClient = createClient() // Changed to server client

  // Required fields
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const price = Number(formData.get("price") as string)

  // Optional fields
  const description = (formData.get("description") as string) || null
  const category = (formData.get("category") as string) || null
  const stock = Number((formData.get("stock") as string) || 0)
  const age_range = (formData.get("ageRange") as string) || null
  const pages = formData.get("pages") ? Number(formData.get("pages") as string) : null

  // Image (may be empty)
  const imageFile = formData.get("image") as File | null
  const image_url = imageFile ? await uploadImage(imageFile) : null

  const { error } = await supabase.from("products").insert({
    title,
    author,
    price,
    description,
    category,
    stock,
    age_range,
    pages,
    image_url,
    status: "active",
  })

  if (error) throw new Error(`Failed to add product: ${error.message}`)

  return { success: true }
}

/**
 * Fetch all products ordered by newest first.
 */
export async function getProducts() {
  const supabase: SupabaseClient = createClient() // Changed to server client

  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data
}

/**
 * Fetch the very first product in the database
 */
export async function getFirstProduct() {
  const supabase: SupabaseClient = createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching first product:", error)
    throw new Error(`Failed to fetch first product: ${error.message}`)
  }

  return data
}

/**
 * Update an existing product.
 */
export async function updateProduct(id: string, formData: FormData) {
  try {
    // Grab current image URL if supplied
    let image_url = (formData.get("currentImageUrl") as string) || null
    const newFile = formData.get("image") as File | null

    // If a new file was provided, upload it and remove the old one
    if (newFile && newFile.size > 0) {
      if (image_url) await deleteImage(image_url)
      image_url = await uploadImage(newFile)
    }

    const updates: Record<string, unknown> = {
      title: formData.get("title"),
      author: formData.get("author"),
      price: Number(formData.get("price") as string),
      category: formData.get("category"),
      stock: Number(formData.get("stock") as string),
      description: formData.get("description"),
      age_range: formData.get("ageRange"),
      pages: formData.get("pages") ? Number(formData.get("pages") as string) : null,
      image_url,
      updated_at: new Date().toISOString(),
    }

    const supabase: SupabaseClient = createClient() // Declare SupabaseClient
    const { error } = await supabase.from("products").update(updates).eq("id", id)

    if (error) throw new Error(`Failed to update product: ${error.message}`)

    return { success: true }
  } catch (err: any) {
    /* Convert to plain object so Next.js action serialises cleanly */
    return { success: false, error: err.message ?? "Unknown error" }
  }
}

/**
 * Delete a product and its storage image (if any).
 */
export async function deleteProduct(id: string, imageUrl?: string) {
  const supabase: SupabaseClient = createClient() // Changed to server client

  if (imageUrl) await deleteImage(imageUrl)

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete product: ${error.message}`)

  return { success: true }
}

/* -------------------------------------------------------------------------- */
/*                                   AUTH                                     */
/* -------------------------------------------------------------------------- */

export async function signOutUser() {
  const supabase: SupabaseClient = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(`Failed to sign out user: ${error.message}`)
  return { success: true }
}

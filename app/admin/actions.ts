"use server"

/**
 * NOTE:
 * 1. The single `import "@supabase/auth-js"` line makes the optional peer
 *    dependency visible so the bundler doesn’t complain at runtime.
 * 2. Everything in this file runs on the server only – it’s safe to use the
 *    Supabase service-role key here.
 */

import "@supabase/auth-js"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { BOOKS_BUCKET_NAME } from "@/constants"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js"

/* -------------------------------------------------------------------------- */
/*                               ADMIN CLIENTS                                */
/* -------------------------------------------------------------------------- */

function getAdminClient(): SupabaseClient {
  // Service-role key → bypass RLS (server only)
  return createAdminClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type { SupabaseUser }

export interface Customer {
  id: string
  customer_name: string
  customer_email: string
  phone_number: string | null
  shipping_address_line1: string | null
  shipping_city: string | null
  shipping_country: string | null
  created_at: string
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
/*                               DASHBOARD DATA                               */
/* -------------------------------------------------------------------------- */

export async function getProducts() {
  const { data, error } = await createClient().from("products").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data
}

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await createClient()
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

  if (error) throw new Error(`Failed to fetch customers: ${error.message}`)
  return data as Customer[]
}

export async function getOrders(): Promise<Order[]> {
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
 * Fetches a dynamic (mock) site visits count.
 * In a real application, this would fetch from a database or analytics service.
 */
export async function getSiteVisitsCount(): Promise<number> {
  // For demonstration, return a simple dynamic number.
  // In a real app, you'd fetch this from your database or an analytics service.
  return Math.floor(Math.random() * 10000) + 5000 // Returns a number between 5000 and 14999
}

/* -------------------------------------------------------------------------- */
/*                               ORDER HELPERS                                */
/* -------------------------------------------------------------------------- */

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const { error } = await createClient().from("orders").update({ status }).eq("id", id)

  if (error) throw new Error(`Failed to update order: ${error.message}`)

  revalidatePath("/admin")
  return { success: true }
}

/* -------------------------------------------------------------------------- */
/*                              PRODUCT HELPERS                               */
/* -------------------------------------------------------------------------- */

async function uploadImage(file: File): Promise<string | null> {
  const supabase = getAdminClient()

  if (!file || file.size === 0) return null
  if (file.size > 5 * 1024 * 1024) throw new Error("Image is larger than 5 MB. Please upload a smaller file.")

  const extension = file.name.split(".").pop() || "png"
  const filePath = `${randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BOOKS_BUCKET_NAME).upload(filePath, file, { contentType: file.type })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from(BOOKS_BUCKET_NAME).getPublicUrl(filePath)

  return publicUrl
}

async function deleteImage(imageUrl?: string | null) {
  if (!imageUrl) return
  const supabase = getAdminClient()

  const parts = imageUrl.split("/")
  const i = parts.indexOf(BOOKS_BUCKET_NAME)
  if (i === -1 || i + 1 >= parts.length) return

  await supabase.storage.from(BOOKS_BUCKET_NAME).remove([parts.slice(i + 1).join("/")])
}

export async function addProduct(formData: FormData) {
  const supabase = getAdminClient()

  const imageFile = formData.get("image") as File | null
  const image_url = imageFile ? await uploadImage(imageFile) : null

  const { error } = await supabase.from("products").insert({
    title: formData.get("title"),
    author: formData.get("author"),
    price: Number(formData.get("price")),
    description: formData.get("description"),
    category: formData.get("category"),
    stock: Number(formData.get("stock") || 0),
    age_range: formData.get("ageRange"),
    pages: formData.get("pages") ? Number(formData.get("pages")) : null,
    image_url,
    status: "active",
  })

  if (error) throw new Error(`Failed to add product: ${error.message}`)
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = getAdminClient()

  let image_url = formData.get("currentImageUrl") as string | null
  const newImage = formData.get("image") as File | null
  if (newImage && newImage.size > 0) {
    await deleteImage(image_url)
    image_url = await uploadImage(newImage)
  }

  const updates = {
    title: formData.get("title"),
    author: formData.get("author"),
    price: Number(formData.get("price")),
    category: formData.get("category"),
    stock: Number(formData.get("stock") || 0),
    description: formData.get("description"),
    age_range: formData.get("ageRange"),
    pages: formData.get("pages") ? Number(formData.get("pages")) : null,
    image_url,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("products").update(updates).eq("id", id)
  if (error) throw new Error(`Failed to update product: ${error.message}`)

  return { success: true }
}

export async function deleteProduct(id: string, imageUrl?: string | null) {
  const supabase = getAdminClient()
  await deleteImage(imageUrl)

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete product: ${error.message}`)

  return { success: true }
}

/* -------------------------------------------------------------------------- */
/*                                 AUTH HELPERS                               */
/* -------------------------------------------------------------------------- */

export async function signOutUser() {
  const { error } = await createClient().auth.signOut()
  if (error) throw new Error(`Failed to sign out: ${error.message}`)
  return { success: true }
}

/* -------------------------------------------------------------------------- */
/*                             SUPABASE USER LIST                             */
/* -------------------------------------------------------------------------- */

export async function getUsersFromDb(): Promise<SupabaseUser[]> {
  const { data, error } = await getAdminClient().auth.admin.listUsers()

  if (error) throw new Error(`Failed to fetch users: ${error.message}`)
  // Supabase v2 returns `{ users }`
  // @ts-expect-error  — keep TS quiet across versions
  return data?.users ?? (data as SupabaseUser[])
}

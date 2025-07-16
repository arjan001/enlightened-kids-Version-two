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

/* -------------------------------------------------------------------------- */
/*                                   PRODUCT                                  */
/* -------------------------------------------------------------------------- */

import { randomUUID } from "crypto"

/**
 * Upload a file to Supabase Storage and return the public URL.
 */
async function uploadImage(file: File): Promise<string | null> {
  const supabase = createClient()
  if (!file || file.size === 0) return null

  const extension = file.name.split(".").pop() || "png"
  const filePath = `${randomUUID()}.${extension}`

  // Upload
  const { error: uploadError } = await supabase.storage
    .from(BOOKS_BUCKET_NAME)
    .upload(filePath, file, { contentType: file.type })

  if (uploadError) throw new Error(`Failed to upload image: ${uploadError.message}`)

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
  "use server"
  const supabase = createClient()

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

  revalidatePath("/admin")
  return { success: true }
}

/**
 * Fetch all products ordered by newest first.
 */
export async function getProducts() {
  "use server"
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data
}

/**
 * Update an existing product.
 */
export async function updateProduct(id: string, formData: FormData) {
  "use server"
  const supabase = createClient()

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

  const { error } = await supabase.from("products").update(updates).eq("id", id)

  if (error) throw new Error(`Failed to update product: ${error.message}`)

  revalidatePath("/admin")
  return { success: true }
}

/**
 * Delete a product and its storage image (if any).
 */
export async function deleteProduct(id: string, imageUrl?: string) {
  "use server"
  const supabase = createClient()

  if (imageUrl) await deleteImage(imageUrl)

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete product: ${error.message}`)

  revalidatePath("/admin")
  return { success: true }
}

/* -------------------------------------------------------------------------- */
/*                                   AUTH                                     */
/* -------------------------------------------------------------------------- */

/**
 * Server-side sign-out helper so the client can call it via useActionState().
 */
export async function signOutUser() {
  "use server"
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(`Failed to sign out user: ${error.message}`)
  return { success: true }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

const BOOKS_BUCKET_NAME = "books-bucket"

// Helper to upload image and get public URL
async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null

  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${fileName}`

  const supabase = createClient()
  const { data, error } = await supabase.storage.from(BOOKS_BUCKET_NAME).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading image:", error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from(BOOKS_BUCKET_NAME).getPublicUrl(data.path)
  return publicUrlData.publicUrl
}

// Helper to delete image from storage
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

export async function getProducts() {
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching products:", error)
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
  return data
}

export async function addProduct(formData: FormData) {
  const supabase = createClient()

  const title = String(formData.get("title"))
  const description = String(formData.get("description") ?? "")
  const price = Number.parseFloat(String(formData.get("price") ?? "0"))
  const stock = Number.parseInt(String(formData.get("stock") ?? "0"), 10) // Ensure stock is an integer, default to 0
  const category = String(formData.get("category") ?? "")

  let image_url: string | null = null
  const imageFile = formData.get("image") as File | null
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadImage(imageFile)
  }

  const { data, error } = await supabase
    .from("products")
    .insert({ title, description, price, stock, category, image_url })
  if (error) {
    console.error("Error adding product:", error)
    throw new Error(`Failed to add product: ${error.message}`)
  }

  revalidatePath("/admin")
  return { success: true, data }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createClient()

  const title = String(formData.get("title"))
  const description = String(formData.get("description") ?? "")
  const price = Number.parseFloat(String(formData.get("price") ?? "0"))
  const stock = Number.parseInt(String(formData.get("stock") ?? "0"), 10) // Ensure stock is an integer, default to 0
  const category = String(formData.get("category") ?? "")

  let image_url: string | null = String(formData.get("currentImageUrl") ?? "")
  const imageFile = formData.get("image") as File | null

  if (imageFile && imageFile.size > 0) {
    if (image_url) {
      await deleteImage(image_url)
    }
    image_url = await uploadImage(imageFile)
  }

  const { data, error } = await supabase
    .from("products")
    .update({ title, description, price, stock, category, image_url })
    .eq("id", id)
  if (error) {
    console.error("Error updating product:", error)
    throw new Error(`Failed to update product: ${error.message}`)
  }

  revalidatePath("/admin")
  return { success: true, data }
}

export async function deleteProduct(id: string, imageUrl?: string) {
  const supabase = createClient()
  if (imageUrl) {
    await deleteImage(imageUrl)
  }
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) {
    console.error("Error deleting product:", error)
    throw new Error(`Failed to delete product: ${error.message}`)
  }
  revalidatePath("/admin")
  return { success: true }
}

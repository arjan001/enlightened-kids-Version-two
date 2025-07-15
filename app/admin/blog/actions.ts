"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

const BLOG_BUCKET_NAME = "blog-images" // Ensure this matches your Supabase bucket name for blog images

// Helper to upload image and get public URL for blog posts
async function uploadBlogImageInternal(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null

  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${fileName}`

  const supabase = createClient() // This uses the server-side client with service role key
  const { data, error } = await supabase.storage.from(BLOG_BUCKET_NAME).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading blog image:", error)
    throw new Error(`Failed to upload blog image: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from(BLOG_BUCKET_NAME).getPublicUrl(data.path)
  return publicUrlData.publicUrl
}

// Helper to delete image from storage for blog posts
async function deleteBlogImageInternal(imageUrl: string | undefined) {
  const supabase = createClient() // This uses the server-side client with service role key
  if (!imageUrl) return

  const urlParts = imageUrl.split("/")
  const bucketIndex = urlParts.indexOf(BLOG_BUCKET_NAME)
  if (bucketIndex === -1 || bucketIndex + 1 >= urlParts.length) {
    console.warn("Could not parse image path from URL for deletion:", imageUrl)
    return
  }
  const imagePath = urlParts.slice(bucketIndex + 1).join("/")

  if (imagePath) {
    const { error } = await supabase.storage.from(BLOG_BUCKET_NAME).remove([imagePath])
    if (error) {
      console.warn("Failed to remove old blog image from storage:", error)
    }
  }
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

export async function getBlogPostById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()
  if (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error)
    return null
  }
  return data
}

export async function addBlogPost(formData: FormData) {
  const supabase = createClient()

  const title = String(formData.get("title"))
  const author = String(formData.get("author") ?? "")
  const content = String(formData.get("content") ?? "")
  const is_published = formData.get("is_published") === "on" // Check if checkbox is checked

  let image_url: string | null = null
  const imageFile = formData.get("image") as File | null
  if (imageFile && imageFile.size > 0) {
    try {
      image_url = await uploadBlogImageInternal(imageFile)
    } catch (uploadError) {
      console.error("Error during blog image upload:", uploadError)
      return { success: false, error: `Image upload failed: ${(uploadError as Error).message}` }
    }
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ title, author, content, image_url, is_published })
    .select() // Select the inserted data to return it
    .single() // Expect a single row back

  if (error) {
    console.error("Error adding blog post:", error)
    return { success: false, error: `Failed to add blog post: ${error.message}` }
  }

  revalidatePath("/admin/blog")
  if (is_published) {
    revalidatePath("/blog") // Revalidate main blog page if new post is published
  }
  return { success: true, data }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = createClient()

  const title = String(formData.get("title"))
  const author = String(formData.get("author") ?? "")
  const content = String(formData.get("content") ?? "")
  const is_published = formData.get("is_published") === "on"
  const currentImageUrl = String(formData.get("currentImageUrl") ?? "")

  let image_url: string | null = currentImageUrl
  const imageFile = formData.get("image") as File | null

  if (imageFile && imageFile.size > 0) {
    if (image_url) {
      await deleteBlogImageInternal(image_url) // Delete old image if new one is uploaded
    }
    try {
      image_url = await uploadBlogImageInternal(imageFile)
    } catch (uploadError) {
      console.error("Error during blog image update upload:", uploadError)
      return { success: false, error: `Image update failed: ${(uploadError as Error).message}` }
    }
  } else if (formData.get("removeImage") === "on") {
    // Handle explicit image removal
    if (image_url) {
      await deleteBlogImageInternal(image_url)
    }
    image_url = null
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ title, author, content, image_url, is_published })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: `Failed to update blog post: ${error.message}` }
  }

  revalidatePath("/admin/blog")
  revalidatePath(`/blog/${id}`) // Revalidate the specific blog post page
  revalidatePath("/blog") // Revalidate the main blog list page
  return { success: true, data }
}

export async function deleteBlogPost(id: string, imageUrl?: string) {
  const supabase = createClient()
  if (imageUrl) {
    await deleteBlogImageInternal(imageUrl)
  }
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) {
    console.error("Error deleting blog post:", error)
    throw new Error(`Failed to delete blog post: ${error.message}`)
  }
  revalidatePath("/admin/blog")
  revalidatePath(`/blog/${id}`) // Revalidate the specific blog post page
  revalidatePath("/blog") // Revalidate the main blog list page
  return { success: true }
}

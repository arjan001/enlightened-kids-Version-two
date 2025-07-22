"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

// Helper function for image upload/deletion
async function handleImageUpload(
  supabase: ReturnType<typeof createClient>,
  imageFile: File | null,
  currentImageUrl: string | null,
  removeImage: boolean,
) {
  let newImageUrl: string | null = currentImageUrl
  const BUCKET_NAME = "blog-bucket" // Using the correct bucket name

  // 1. Handle image removal
  if (removeImage && currentImageUrl) {
    const oldFileName = currentImageUrl.split("/").pop() // Extract file name from URL
    if (oldFileName) {
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldFileName])
      if (deleteError) {
        console.error("Error deleting old image:", deleteError)
        // Log error but don't block the operation if deletion fails
      }
    }
    newImageUrl = null // Image removed
  }

  // 2. Handle new image upload
  if (imageFile && imageFile.size > 0) {
    // If there was an old image and it wasn't explicitly removed, remove it now before uploading new one
    if (currentImageUrl && !removeImage) {
      const oldFileName = currentImageUrl.split("/").pop()
      if (oldFileName) {
        const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldFileName])
        if (deleteError) {
          console.error("Error deleting old image before new upload:", deleteError)
        }
      }
    }

    const fileExtension = imageFile.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}` // Generate unique file name
    const filePath = fileName

    const { data, error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false, // Do not upsert, we handle deletion manually
    })

    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      throw new Error("Failed to upload image.") // Propagate error
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
    newImageUrl = publicUrlData.publicUrl
  }

  return newImageUrl
}

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
  const category = formData.get("category") as string
  const readTime = Number.parseInt(formData.get("readTime") as string)
  const isPublished = formData.get("isPublished") === "on"

  const imageFile = formData.get("image") as File | null

  let imageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await handleImageUpload(supabase, imageFile, null, false) // No current image, not removing
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  const { error } = await supabase.from("blog_posts").insert({
    title,
    content,
    image_url: imageUrl, // Use the uploaded image URL
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
  const category = formData.get("category") as string
  const readTime = Number.parseInt(formData.get("readTime") as string)
  const isPublished = formData.get("isPublished") === "on"

  const imageFile = formData.get("image") as File | null
  const removeImage = formData.get("removeImage") === "on"
  const currentImageUrl = formData.get("currentImageUrl") as string | null

  let imageUrlToSave: string | null = currentImageUrl

  try {
    imageUrlToSave = await handleImageUpload(supabase, imageFile, currentImageUrl, removeImage)
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      content,
      image_url: imageUrlToSave, // Use the processed image URL
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

export async function deleteBlogPost(id: string, imageUrl?: string | null) {
  const supabase = createClient()
  const BUCKET_NAME = "blog-bucket" // Using the correct bucket name

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Delete image from storage if it exists
  if (imageUrl) {
    const fileName = imageUrl.split("/").pop() // Extract file name from URL
    if (fileName) {
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([fileName])
      if (deleteError) {
        console.error("Error deleting blog post image from storage:", deleteError)
        // Log error but don't block the deletion if storage deletion fails
      }
    }
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

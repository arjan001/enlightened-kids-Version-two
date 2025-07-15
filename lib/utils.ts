import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "@/lib/supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to upload an image to Supabase Storage
export async function uploadImage(file: File, bucketName: string): Promise<string | null> {
  const supabase = createClient()
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`
  const filePath = `${bucketName}/${fileName}`

  const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type, // Ensure content type is passed
  })

  if (error) {
    console.error("Error uploading image:", error)
    return null
  }

  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName)
  return publicUrlData.publicUrl
}

// Utility function to delete an image from Supabase Storage
export async function deleteImage(imageUrl: string): Promise<boolean> {
  const supabase = createClient()
  try {
    // Extract bucket name and file path from the URL
    const urlParts = imageUrl.split("/")
    const bucketName = urlParts[urlParts.indexOf("storage") + 1]
    const fileName = urlParts.slice(urlParts.indexOf(bucketName) + 1).join("/")

    if (!bucketName || !fileName) {
      console.error("Invalid image URL for deletion:", imageUrl)
      return false
    }

    const { error } = await supabase.storage.from(bucketName).remove([fileName])

    if (error) {
      console.error("Error deleting image:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error in deleteImage utility:", error)
    return false
  }
}

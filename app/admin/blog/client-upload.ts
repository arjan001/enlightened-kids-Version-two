import { createClient } from "@/lib/supabase/client" // Assuming you have a client-side Supabase client

const BLOG_BUCKET_NAME = "blog-bucket" // Corrected: Ensure this matches your Supabase bucket name for blog images

export async function uploadBlogImage(file: File) {
  try {
    const supabase = createClient()
    // Sanitize filename to prevent issues with special characters
    const sanitizedFileName = file.name.toLowerCase().replace(/[^a-z0-9.\-_]/g, "_")
    const filePath = `${Date.now()}-${sanitizedFileName}`

    const { data, error } = await supabase.storage.from(BLOG_BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
    })

    if (error) {
      throw error
    }

    const { data: publicUrlData } = supabase.storage.from(BLOG_BUCKET_NAME).getPublicUrl(data.path)
    return publicUrlData.publicUrl
  } catch (err) {
    throw new Error(`Image upload failed: ${(err as { message: string }).message}`)
  }
}

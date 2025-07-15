"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const CONTACT_MESSAGES_TABLE = "contact_messages"

/**
 * Adds a new contact message to the database.
 * @param formData FormData containing name, email, and message.
 */
export async function addContactMessage(formData: FormData) {
  const supabase = createClient()

  const name = String(formData.get("name")).trim()
  const email = String(formData.get("email")).trim()
  const message = String(formData.get("message")).trim()

  // Basic server-side validation
  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Invalid email format." }
  }

  try {
    const { data, error } = await supabase
      .from(CONTACT_MESSAGES_TABLE)
      .insert({ name, email, message, status: "new" })
      .select()

    if (error) {
      console.error("Error adding contact message:", error)
      return { success: false, error: `Failed to send message: ${error.message}` }
    }

    revalidatePath("/admin") // Revalidate admin path to show new message
    return { success: true, data }
  } catch (error: any) {
    console.error("Unexpected error adding contact message:", error)
    return { success: false, error: `An unexpected error occurred: ${error.message}` }
  }
}

/**
 * Fetches all contact messages from the database.
 */
export async function getContactMessages() {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from(CONTACT_MESSAGES_TABLE)
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contact messages:", error)
      throw new Error(`Failed to fetch messages: ${error.message}`)
    }
    return data
  } catch (error: any) {
    console.error("Unexpected error fetching contact messages:", error)
    throw new Error(`An unexpected error occurred: ${error.message}`)
  }
}

/**
 * Updates the status of a contact message.
 * @param id The ID of the message to update.
 * @param status The new status (e.g., 'read', 'archived').
 */
export async function updateContactMessageStatus(id: string, status: string) {
  const supabase = createClient()
  try {
    const { error } = await supabase.from(CONTACT_MESSAGES_TABLE).update({ status }).eq("id", id)

    if (error) {
      console.error("Error updating contact message status:", error)
      return { success: false, error: `Failed to update status: ${error.message}` }
    }
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error updating contact message status:", error)
    return { success: false, error: `An unexpected error occurred: ${error.message}` }
  }
}

/**
 * Deletes a contact message from the database.
 * @param id The ID of the message to delete.
 */
export async function deleteContactMessage(id: string) {
  const supabase = createClient()
  try {
    const { error } = await supabase.from(CONTACT_MESSAGES_TABLE).delete().eq("id", id)

    if (error) {
      console.error("Error deleting contact message:", error)
      return { success: false, error: `Failed to delete message: ${error.message}` }
    }
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error deleting contact message:", error)
    return { success: false, error: `An unexpected error occurred: ${error.message}` }
  }
}

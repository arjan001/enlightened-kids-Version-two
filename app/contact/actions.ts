"use server"

import { addContactMessage } from "@/app/admin/contact/actions"

/**
 * Reducer-style server action for useActionState.
 * @param _prevState   – previous state from useActionState (ignored)
 * @param formData     – FormData from the contact form
 */
export async function addContactMessageReducer(
  _prevState: { success: boolean; error: string | null },
  formData: FormData,
) {
  return await addContactMessage(formData)
}

/**
 * Central place for shared constant values used across the project.
 * Having a dedicated file prevents “module not found” runtime errors
 * like the one you just encountered (`@/constants`).
 *
 * Feel free to add more constants here as your application evolves.
 */

/**
 * Supabase storage bucket that stores all book-related images.
 * Make sure this matches the bucket name you created in Supabase.
 */
export const BOOKS_BUCKET_NAME = "books"

/**
 * Default order status assigned right after a successful checkout.
 * The checkout flow (app/checkout/actions.ts) can overwrite this if needed.
 */
export const DEFAULT_ORDER_STATUS = "pending"

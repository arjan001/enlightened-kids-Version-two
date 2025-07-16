"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CartItem {
  id: string
  name: string // Changed from title to name to match product schema
  price: number
  quantity: number
  image?: string | null // Changed from image_url to image to match product schema
}

export async function processCheckout(
  customerData: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    street_address: string
    city: string
    postal_code: string
  },
  orderData: {
    cartItems: CartItem[]
    totalAmount: number
    shippingCost: number
    paymentMethod: string
    orderNotes: string
  },
) {
  const supabase = createClient()

  const { first_name, last_name, email, phone_number, street_address, city, postal_code } = customerData
  const { cartItems, totalAmount, shippingCost, paymentMethod, orderNotes } = orderData

  try {
    // 1. Insert Order Data directly into the orders table
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: `${first_name} ${last_name}`,
        customer_email: email,
        phone_number: phone_number,
        shipping_address_line1: street_address,
        shipping_city: city,
        shipping_zip_code: postal_code,
        shipping_country: "Kenya", // Assuming a default country for now, can be made dynamic
        total_amount: totalAmount,
        shipping_cost: shippingCost,
        payment_method: paymentMethod,
        ordered_products: cartItems, // Store cart items as JSONB
        order_notes: orderNotes,
        status: "pending_payment", // Initial status
        order_date: new Date().toISOString(),
      })
      .select("*")
      .single()

    if (orderError) {
      console.error("Error inserting order:", orderError.message, orderError.details, orderError.hint)
      return { success: false, error: `Failed to create order: ${orderError.message}` }
    }

    console.log("Order created successfully:", newOrder)
    revalidatePath("/checkout")
    return { success: true, message: "Order created successfully!", order: newOrder }
  } catch (error: any) {
    console.error("Unexpected error during checkout process:", error)
    return { success: false, error: `An unexpected error occurred: ${error.message}` }
  }
}

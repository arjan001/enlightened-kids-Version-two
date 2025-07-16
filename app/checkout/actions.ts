import { createClient } from "@/lib/supabase/server"
import type { CartItem } from "@/contexts/cart-context"
import { cookies } from "next/headers"

interface CustomerData {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  street_address: string
  city: string
  postal_code: string
}

interface OrderData {
  cartItems: CartItem[]
  totalAmount: number
  shippingCost: number
  paymentMethod: string
  orderNotes: string
}

export async function processCheckout(customerData: CustomerData, orderData: OrderData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // 1. Upsert customer information
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          email: customerData.email,
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          phone_number: customerData.phone_number,
          street_address: customerData.street_address,
          city: customerData.city,
          postal_code: customerData.postal_code,
        },
        { onConflict: "email" },
      )
      .select()
      .single()

    if (customerError) {
      console.error("Supabase customer upsert error:", customerError)
      return { success: false, message: "Failed to save customer information." }
    }

    if (!customer) {
      return { success: false, message: "Customer data could not be retrieved after upsert." }
    }

    // 2. Insert order information
    const { error: orderError } = await supabase.from("orders").insert({
      customer_id: customer.id,
      customer_first_name: customer.first_name,
      customer_last_name: customer.last_name,
      customer_email: customer.email,
      ordered_products: orderData.cartItems, // Store cart items as JSONB
      total_amount: orderData.totalAmount,
      shipping_cost: orderData.shippingCost,
      payment_method: orderData.paymentMethod,
      order_notes: orderData.orderNotes, // Include order notes
      status: "pending", // Default status
    })

    if (orderError) {
      console.error("Supabase order insert error:", orderError)
      return { success: false, message: "Failed to create order." }
    }

    return { success: true, message: "Order placed successfully!" }
  } catch (error: any) {
    console.error("Server action error:", error)
    return { success: false, message: `An unexpected server error occurred: ${error.message}` }
  }
}

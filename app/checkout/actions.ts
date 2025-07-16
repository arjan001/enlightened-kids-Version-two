"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string | null
}

export async function processCheckout(
  formData: FormData,
  cartItems: CartItem[],
  totalAmount: number,
  shippingCost: number,
  selectedPaymentMethod: "mpesa" | "paypal" | null,
) {
  const supabase = createClient()

  // 1. Extract Customer Information
  const firstName = String(formData.get("firstName"))
  const lastName = String(formData.get("lastName"))
  const email = String(formData.get("email"))
  const phone = String(formData.get("phone"))
  const address = String(formData.get("address"))
  const city = String(formData.get("city"))
  const postalCode = String(formData.get("postalCode"))
  const orderNotes = String(formData.get("orderNotes") ?? "")

  let customerId: string | null = null

  try {
    // 2. Insert or Update Customer Information
    // For simplicity, we'll try to find an existing customer by email.
    // If found, we'll use their ID. If not, we'll insert a new customer.
    // A more robust system might handle user authentication and link orders to authenticated users.
    const { data: existingCustomer, error: customerFetchError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .single()

    if (customerFetchError && customerFetchError.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error("Error fetching existing customer:", customerFetchError)
      throw new Error(`Failed to fetch customer: ${customerFetchError.message}`)
    }

    if (existingCustomer) {
      customerId = existingCustomer.id
      // Optionally, update existing customer details here if needed
      const { error: updateError } = await supabase
        .from("customers")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          address,
          city,
          postal_code: postalCode,
        })
        .eq("id", customerId)
      if (updateError) {
        console.error("Error updating customer:", updateError)
        throw new Error(`Failed to update customer: ${updateError.message}`)
      }
    } else {
      const { data: newCustomer, error: customerInsertError } = await supabase
        .from("customers")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
          city,
          postal_code: postalCode,
        })
        .select("id")
        .single()

      if (customerInsertError) {
        console.error("Error inserting new customer:", customerInsertError)
        throw new Error(`Failed to insert customer: ${customerInsertError.message}`)
      }
      customerId = newCustomer.id
    }

    if (!customerId) {
      throw new Error("Customer ID could not be determined.")
    }

    // 3. Prepare Ordered Products for JSONB storage
    const orderedProducts = cartItems.map((item) => ({
      product_id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }))

    // 4. Insert Order Information
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        total_amount: totalAmount,
        shipping_cost: shippingCost,
        payment_method: selectedPaymentMethod,
        order_notes: orderNotes,
        ordered_products: orderedProducts, // Stored as JSONB
        customer_name: `${firstName} ${lastName}`, // Denormalized for easy reference
        customer_email: email, // Denormalized for easy reference
        status: "pending_payment", // Initial status
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error inserting order:", orderError)
      throw new Error(`Failed to insert order: ${orderError.message}`)
    }

    revalidatePath("/checkout") // Revalidate path if needed, though not strictly necessary for this action
    return { success: true, order: orderData, message: "Order successfully created." }
  } catch (error: any) {
    console.error("Checkout process failed:", error.message)
    return { success: false, message: error.message || "An unknown error occurred during checkout." }
  }
}

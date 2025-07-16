"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image_url?: string | null
  image?: string | null // Added for flexibility if image comes from a different field
}

export async function processCheckout(
  formData: FormData,
  cartItems: CartItem[],
  totalAmount: number,
  shippingCost: number,
  selectedPaymentMethod: string,
) {
  const supabase = createClient()

  const firstName = String(formData.get("firstName"))
  const lastName = String(formData.get("lastName"))
  const email = String(formData.get("email"))
  const phone = String(formData.get("phone"))
  const address = String(formData.get("address"))
  const city = String(formData.get("city"))
  const postalCode = String(formData.get("postalCode"))
  // The country field is no longer needed in the customers table, but it's still passed from the form
  // const country = String(formData.get("country"))

  let customerId: string | null = null

  try {
    // 1. Upsert Customer Data
    const { data: existingCustomers, error: fetchCustomerError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .limit(1)

    if (fetchCustomerError) {
      console.error("Error fetching existing customer:", fetchCustomerError)
      return { success: false, message: `Failed to check customer: ${fetchCustomerError.message}` }
    }

    if (existingCustomers && existingCustomers.length > 0) {
      // Customer exists, update their details
      customerId = existingCustomers[0].id
      const { error: updateCustomerError } = await supabase
        .from("customers")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          address,
          city,
          postal_code: postalCode,
          // country: country, // Removed as per user request
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId)

      if (updateCustomerError) {
        console.error("Error updating customer:", updateCustomerError)
        return { success: false, message: `Failed to update customer: ${updateCustomerError.message}` }
      }
      console.log("Customer updated:", customerId)
    } else {
      // Customer does not exist, insert new customer
      const { data: newCustomer, error: insertCustomerError } = await supabase
        .from("customers")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
          city,
          postal_code: postalCode,
          // country: country, // Removed as per user request
        })
        .select("id")
        .single()

      if (insertCustomerError) {
        console.error("Error inserting new customer:", insertCustomerError)
        return { success: false, message: `Failed to add new customer: ${insertCustomerError.message}` }
      }
      customerId = newCustomer.id
      console.log("New customer inserted:", customerId)
    }

    // 2. Insert Order Data
    if (!customerId) {
      return { success: false, message: "Customer ID not found after upsert operation." }
    }

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        customer_first_name: firstName, // Use first_name
        customer_last_name: lastName, // Use last_name
        customer_email: email, // Use email
        total_amount: totalAmount,
        shipping_cost: shippingCost,
        payment_method: selectedPaymentMethod,
        ordered_products: cartItems, // Store cart items as JSONB
        order_notes: null, // No notes collected from form currently
        created_at: new Date().toISOString(), // Maps to created_at
      })
      .select("*")
      .single()

    if (orderError) {
      console.error("Error inserting order:", orderError.message, orderError.details, orderError.hint)
      return { success: false, message: `Failed to create order: ${orderError.message}` }
    }

    console.log("Order created successfully:", orderData)
    revalidatePath("/checkout") // Revalidate path if needed, though not strictly necessary for this flow
    return { success: true, message: "Order created successfully!", order: orderData }
  } catch (error: any) {
    console.error("Unexpected error during checkout process:", error)
    return { success: false, message: `An unexpected error occurred: ${error.message}` }
  }
}

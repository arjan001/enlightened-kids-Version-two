;/>
\
1. **Locate** the
function
`updateOrderStatus`.
\
2. **Replace** the `update` call so it only updates the `status` column:

```ts
export async function updateOrderStatus(orderId: string, newStatus: Order["status"]) {
  const supabase = createClient()

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus }) // <-- removed updated_at
    .eq("id", orderId)

  if (error) {
    console.error("Error updating order status:", error)
    throw new Error(`Failed to update order status: ${error.message}`)
  }

  revalidatePath("/admin")
  return { success: true }
}

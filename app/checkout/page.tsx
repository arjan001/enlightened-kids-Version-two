"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import CheckoutForm from "@/components/checkout-form"
// Header and Footer are now rendered in layout.tsx

export default function CheckoutPage() {
  const { state } = useCart()
  const router = useRouter()

  useEffect(() => {
    // Redirect if cart is empty
    if (state.itemCount === 0) {
      router.replace("/books")
    }
  }, [state.itemCount, router])

  // Render the checkout form only if there are items in the cart
  if (state.itemCount === 0) {
    return null // Or a loading spinner, as redirection will happen
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header and Footer are now in layout.tsx */}
      <main className="flex-grow py-12 md:py-20">
        <CheckoutForm />
      </main>
    </div>
  )
}

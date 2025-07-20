"use client"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { CartProvider } from "@/contexts/cart-context"
import CheckoutForm from "@/components/checkout-form"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default async function CheckoutPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow py-12 md:py-20">
          <Suspense fallback={<div>Loading checkout...</div>}>
            <CheckoutForm userId={user.id} />
          </Suspense>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}

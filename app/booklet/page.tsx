"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { LinkIcon, PhoneIcon as Whatsapp } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"

export default async function BookletPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { items } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (items.length === 0) {
      // user tried to hit /booklet directly with an empty cart
      router.replace("/books")
    }
  }, [items, router])

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user is logged in, redirect to the login page
  if (!user) {
    redirect("/login")
  }

  // Check if the user has any orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", user.id)
    .limit(1) // We only need to know if at least one order exists

  if (ordersError) {
    console.error("Error fetching orders:", ordersError)
    // In case of an error, redirect to a safe page, e.g., homepage
    redirect("/")
  }

  // If the user has no orders, redirect them to the books page to make a purchase
  if (!orders || orders.length === 0) {
    redirect("/books")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header className="mb-8" />

      {/* Main Content Section */}
      <main
        className="flex-grow py-12 md:py-20 flex justify-center"
        style={{
          backgroundImage: `url('/Enlightened Kids Pattern BG.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      >
        <Card className="w-full max-w-2xl mx-auto p-8 mt-8 md:p-12 bg-white shadow-lg rounded-lg text-center">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-0">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">Access Your Booklet</h1>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Every purchase of Colours of Me comes with a free Discussion & Activity e-Booklet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 text-lg rounded-lg shadow-md flex-1 sm:flex-none"
              >
                <Link href="/ebook/discussion-activity-guide.pdf" download="Discussion & Activity Guide.pdf">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Download Instantly
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 py-3 px-6 text-lg rounded-lg shadow-md flex-1 sm:flex-none"
              >
                <Link href="https://wa.me/+254110012701" target="_blank" rel="noopener noreferrer">
                  <Whatsapp className="w-5 h-5 mr-2" />
                  Request Via Whatsapp
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { LinkIcon, PhoneIcon as Whatsapp } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
// Header and Footer are now rendered in layout.tsx

export default function BookletPage() {
  const { state } = useCart()
  const router = useRouter()

  useEffect(() => {
    // Redirect if cart is empty (implies no recent purchase or direct access without items)
    // This assumes a successful checkout clears the cart and redirects here.
    // For persistent access after a purchase, a server-side check (e.g., user's order history)
    // would be needed, but that would require this page to be a Server Component or an API route.
    // Given the constraint to fix client-side error and not alter UI/logic,
    // this client-side cart check is the most direct implementation of "has an item in cart or moves well within the checkout process".
    if (state.itemCount === 0) {
      router.replace("/books")
    }
  }, [state.itemCount, router])

  // Render nothing or a loading state if redirecting
  if (state.itemCount === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header and Footer are now in layout.tsx */}

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
    </div>
  )
}

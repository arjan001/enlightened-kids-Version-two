"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"

export default function CheckoutForm() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const handleRemoveItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const handleClearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate order saving (in a real app, this would be a server action/API call)
    console.log("Order processed:", state.items)
    dispatch({ type: "CLEAR_CART" }) // Clear cart after successful checkout

    setIsProcessing(false)
    router.push("/booklet") // Redirect to booklet page after successful checkout
  }

  if (state.itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty.</h2>
        <p className="text-gray-600 mt-2">Please add items to your cart to proceed to checkout.</p>
        <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
          <Link href="/books">Go to Books</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800">Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Order</h3>
          {state.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.author}</p>
                  <p className="text-sm text-gray-700">Ksh {item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                  className="w-20 text-center"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          <Separator className="my-4" />
          <div className="flex justify-between items-center font-bold text-lg text-gray-900">
            <span>Total:</span>
            <span>Ksh {state.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
            >
              Clear Cart
            </Button>
          </div>

          <form onSubmit={handleCheckout} className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipping Information</h3>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" type="text" placeholder="123 Main St" required />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" type="text" placeholder="Nairobi" required />
            </div>
            <div>
              <Label htmlFor="zip">Postal Code</Label>
              <Input id="zip" type="text" placeholder="00100" required />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Purchase"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import PaymentModal from "@/components/payment-modal"
import { toast } from "sonner"
import { createOrder } from "@/app/checkout/actions"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [shippingOption, setShippingOption] = useState("pickup-mtaani")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [shippingCost, setShippingCost] = useState(250) // Default for "Pick up Mtaani"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
  })

  useEffect(() => {
    if (state.items.length === 0) {
      router.push("/books")
    }
  }, [state.items.length, router])

  useEffect(() => {
    if (shippingOption === "pickup-shop") {
      setShippingCost(0)
    } else if (shippingOption === "pickup-mtaani") {
      setShippingCost(250)
    }
  }, [shippingOption])

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingCost

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity: newQuantity } })
    } else {
      dispatch({ type: "REMOVE_ITEM", payload: productId })
    }
  }

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (paymentMethod: string) => {
    if (state.items.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.")
      router.push("/books")
      return
    }

    // Basic form validation
    const requiredFields = ["firstName", "lastName", "email", "phone", "streetAddress", "city", "country", "postalCode"]
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field.`)
        return
      }
    }

    try {
      const orderData = {
        customerInfo: formData,
        items: state.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        subtotal,
        shippingCost,
        total,
        paymentMethod,
        status: "Pending", // Initial status
      }

      const result = await createOrder(orderData)

      if (result.success) {
        toast.success("Order placed successfully! Redirecting to your ebook.")
        dispatch({ type: "CLEAR_CART" })
        router.push("/booklet")
      } else {
        toast.error(`Failed to place order: ${result.error}`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("An unexpected error occurred during checkout.")
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty.</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button onClick={() => router.push("/books")} className="bg-orange-500 hover:bg-orange-600 text-white">
          Start Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-8 text-center font-fredoka">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-fredoka">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-lg font-bold text-gray-900">Ksh {item.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-gray-800">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Shipping</span>
                <Select value={shippingOption} onValueChange={setShippingOption}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select shipping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup-shop">Pick up from shop (Ksh 0)</SelectItem>
                    <SelectItem value="pickup-mtaani">Pick up Mtaani (next day pick up) (Ksh 250)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 border-t pt-4 mt-4">
                <span>Total</span>
                <span>Ksh {total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information & Delivery Address */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-fredoka">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-fredoka">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  placeholder="Enter your street address"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="Enter your country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="Enter your postal code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Method */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-fredoka">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="border border-orange-500 rounded-lg p-4 flex items-center justify-between cursor-pointer relative"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <div className="flex items-center gap-3">
                <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={40} height={40} />
                <span className="font-semibold text-gray-800">Pay securely with your M-Pesa mobile money account</span>
              </div>
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full absolute -top-2 -right-2">
                Popular
              </span>
            </div>
            <div
              className="border border-gray-300 rounded-lg p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => handleCheckout("PayPal")}
            >
              <Image src="/placeholder.svg?height=40&width=40" alt="PayPal" width={40} height={40} />
              <span className="font-semibold text-gray-800">Pay with PayPal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={() => handleCheckout("M-Pesa")}
      />
    </div>
  )
}

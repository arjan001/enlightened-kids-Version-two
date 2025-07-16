"use client"

import type React from "react"

import { useState, useEffect, useMemo, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context" // Ensure this import path is correct
import Image from "next/image"
import { PaymentModal } from "@/components/payment-modal"
import { useToast } from "@/components/ui/use-toast"
import { processCheckout } from "./actions" // Import the server action
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { cartItems, dispatch } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("Kenya") // Default to Kenya
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("M-Pesa") // Default payment method

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Load form data from local storage on mount
  useEffect(() => {
    setFirstName(localStorage.getItem("checkout_firstName") || "")
    setLastName(localStorage.getItem("checkout_lastName") || "")
    setEmail(localStorage.getItem("checkout_email") || "")
    setPhone(localStorage.getItem("checkout_phone") || "")
    setAddress(localStorage.getItem("checkout_address") || "")
    setCity(localStorage.getItem("checkout_city") || "")
    setPostalCode(localStorage.getItem("checkout_postalCode") || "")
    setCountry(localStorage.getItem("checkout_country") || "Kenya")
    setSelectedPaymentMethod(localStorage.getItem("checkout_paymentMethod") || "M-Pesa")
  }, [])

  // Save form data to local storage on change
  useEffect(() => {
    localStorage.setItem("checkout_firstName", firstName)
    localStorage.setItem("checkout_lastName", lastName)
    localStorage.setItem("checkout_email", email)
    localStorage.setItem("checkout_phone", phone)
    localStorage.setItem("checkout_address", address)
    localStorage.setItem("checkout_city", city)
    localStorage.setItem("checkout_postalCode", postalCode)
    localStorage.setItem("checkout_country", country)
    localStorage.setItem("checkout_paymentMethod", selectedPaymentMethod)
  }, [firstName, lastName, email, phone, address, city, postalCode, country, selectedPaymentMethod])

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  const shippingCost = 500 // Example fixed shipping cost
  const totalAmount = subtotal + shippingCost

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleProceedToPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default form submission

    startTransition(async () => {
      const formData = new FormData(event.currentTarget)
      // Manually append values from state-managed inputs if they don't have a 'name' attribute
      // (though it's better to use 'name' directly on the input)
      formData.set("firstName", firstName)
      formData.set("lastName", lastName)
      formData.set("email", email)
      formData.set("phone", phone)
      formData.set("address", address)
      formData.set("city", city)
      formData.set("postalCode", postalCode)
      formData.set("country", country)
      formData.set("paymentMethod", selectedPaymentMethod) // Ensure this is passed

      try {
        const result = await processCheckout(formData, cartItems, totalAmount, shippingCost, selectedPaymentMethod)

        if (result.success) {
          toast({
            title: "Success",
            description: "Order Made Successfully!",
          })
          // Clear cart and local storage after successful order creation
          dispatch({ type: "CLEAR_CART" })
          localStorage.removeItem("checkout_firstName")
          localStorage.removeItem("checkout_lastName")
          localStorage.removeItem("checkout_email")
          localStorage.removeItem("checkout_phone")
          localStorage.removeItem("checkout_address")
          localStorage.removeItem("checkout_city")
          localStorage.removeItem("checkout_postalCode")
          localStorage.removeItem("checkout_country")
          localStorage.removeItem("checkout_paymentMethod")

          router.push("/booklet") // Redirect to /booklet page
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to create order.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error("Client-side error during checkout:", error)
        toast({
          title: "Error",
          description: `An unexpected error occurred: ${error.message}`,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, P.O. Box, etc."
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select name="country" value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                    <SelectItem value="Uganda">Uganda</SelectItem>
                    <SelectItem value="Tanzania">Tanzania</SelectItem>
                    <SelectItem value="Rwanda">Rwanda</SelectItem>
                    <SelectItem value="Burundi">Burundi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {item.image_url && (
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title}
                          width={40}
                          height={50}
                          className="rounded object-cover"
                        />
                      )}
                      <span>
                        {item.title} (x{item.quantity})
                      </span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <Separator />

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select name="paymentMethod" value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Card">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isPending || cartItems.length === 0}>
              {isPending ? "Processing..." : "Complete Payment"}
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Payment Modal (kept for future use, but not opened directly after order creation now) */}
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
    </div>
  )
}

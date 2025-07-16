"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, XCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react" // Import useTransition
import { Textarea } from "@/components/ui/textarea"
import { PaymentModal } from "@/components/payment-modal"
import { processCheckout } from "../checkout/actions" // Import the new server action
import { toast } from "@/components/ui/use-toast" // Import toast for notifications

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [isPending, startTransition] = useTransition() // Initialize useTransition

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"mpesa" | "paypal" | null>("mpesa")

  // State for form fields, initialized from localStorage
  const [firstName, setFirstName] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("checkoutFirstName") || ""
    return ""
  })
  const [lastName, setLastName] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("checkoutLastName") || ""
    return ""
  })
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("checkoutEmail") || ""
    return ""
  })
  const [phone, setPhone] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("checkoutPhone") || ""
    return ""
  })
  const [address, setAddress] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("checkoutAddress") || ""
    return ""
  })
  const [city, setCity] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("checkoutCity") || ""
    return ""
  })
  const [postalCode, setPostalCode] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("checkoutPostalCode") || ""
    return ""
  })
  const [orderNotes, setOrderNotes] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("checkoutOrderNotes") || ""
    return ""
  })

  // Persist form fields to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutFirstName", firstName)
    }
  }, [firstName])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutLastName", lastName)
    }
  }, [lastName])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutEmail", email)
    }
  }, [email])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutPhone", phone)
    }
  }, [phone])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutAddress", address)
    }
  }, [address])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutCity", city)
    }
  }, [city])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutPostalCode", postalCode)
    }
  }, [postalCode])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutOrderNotes", orderNotes)
    }
  }, [orderNotes])

  // Redirect if cart is empty
  useEffect(() => {
    if (state.items.length === 0) {
      router.push("/books") // Redirect to books page if cart is empty
    }
  }, [state.items.length, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 200 // Fixed shipping cost as per screenshot
  const total = subtotal + shipping

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return // Prevent negative quantities
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQuantity } })
  }

  const handleRemoveItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  // Validation logic
  const isFormValid = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      address.trim() !== "" &&
      city.trim() !== "" &&
      postalCode.trim() !== "" &&
      state.items.length > 0 // Ensure cart is not empty
    )
  }

  const handleProceedToPayment = async (event: React.FormEvent) => {
    event.preventDefault() // Prevent default form submission

    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required contact and delivery information.",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      const formData = new FormData(event.currentTarget as HTMLFormElement) // Create FormData from the form
      formData.set("firstName", firstName) // Manually add state values to FormData
      formData.set("lastName", lastName)
      formData.set("email", email)
      formData.set("phone", phone)
      formData.set("address", address)
      formData.set("city", city)
      formData.set("postalCode", postalCode)
      formData.set("orderNotes", orderNotes)

      const result = await processCheckout(formData, state.items, total, shipping, selectedPaymentMethod)

      if (result.success) {
        toast({
          title: "Order Created",
          description: result.message,
          variant: "default",
        })
        // Clear local storage for checkout form fields
        localStorage.removeItem("checkoutFirstName")
        localStorage.removeItem("checkoutLastName")
        localStorage.removeItem("checkoutEmail")
        localStorage.removeItem("checkoutPhone")
        localStorage.removeItem("checkoutAddress")
        localStorage.removeItem("checkoutCity")
        localStorage.removeItem("checkoutPostalCode")
        localStorage.removeItem("checkoutOrderNotes")

        // Clear the cart
        dispatch({ type: "CLEAR_CART" })

        setIsPaymentModalOpen(true) // Open payment modal after successful order creation
      } else {
        toast({
          title: "Order Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    })
  }

  // If cart is empty, display a loading state or null while redirecting
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-16">
        <p>Redirecting to books page...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/books")}
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
          <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {" "}
            {/* Wrap content in a form */}
            {/* Left Column: Order Summary & Payment Method */}
            <div className="space-y-8">
              {/* Order Summary */}
              <Card className="p-6 shadow-sm rounded-lg">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-600">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="grid gap-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg text-gray-800">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="p-6 shadow-sm rounded-lg">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <RadioGroup
                    defaultValue="mpesa"
                    value={selectedPaymentMethod || "mpesa"}
                    onValueChange={(value: "mpesa" | "paypal") => setSelectedPaymentMethod(value)}
                    className="grid gap-4"
                  >
                    <Label
                      htmlFor="mpesa"
                      className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-orange-500 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem id="mpesa" value="mpesa" className="text-orange-500 border-gray-300" />
                        <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={80} height={40} />
                      </div>
                      <span className="block text-sm font-medium text-gray-700">
                        Pay securely with your M-Pesa mobile money account
                      </span>
                      <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Popular</Badge>
                    </Label>
                    <Label
                      htmlFor="paypal"
                      className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-orange-500 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem id="paypal" value="paypal" className="text-orange-500 border-gray-300" />
                        <Image src="/placeholder.svg?height=40&width=80" alt="PayPal" width={80} height={40} />
                      </div>
                      <span className="block text-sm font-medium text-gray-700">
                        Pay with your PayPal account or credit/debit card
                      </span>
                    </Label>
                  </RadioGroup>
                  <Button
                    type="submit" // Change to type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-6 py-3 text-lg font-semibold"
                    disabled={isPending || !isFormValid() || !selectedPaymentMethod} // Disable during pending state
                  >
                    {isPending ? "Processing Order..." : `Complete Payment - ${formatPrice(total)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
            {/* Right Column: Contact, Delivery, Order Notes */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card className="p-6 shadow-sm rounded-lg">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName" // Add name attribute
                        placeholder="Enter your first name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName" // Add name attribute
                        placeholder="Enter your last name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email" // Add name attribute
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone" // Add name attribute
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="p-6 shadow-sm rounded-lg">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800">Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address" // Add name attribute
                        placeholder="Enter your street address"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city" // Add name attribute
                        placeholder="Enter your city"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode" // Add name attribute
                        placeholder="Enter postal code"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes (Optional) */}
              <Card className="p-6 shadow-sm rounded-lg">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800">Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Textarea
                    name="orderNotes" // Add name attribute
                    placeholder="Any special instructions for your order..."
                    className="min-h-[100px]"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>
          </form>{" "}
          {/* End of the form */}
        </div>
      </main>

      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentMethod={selectedPaymentMethod}
        totalAmount={total}
      />
    </div>
  )
}

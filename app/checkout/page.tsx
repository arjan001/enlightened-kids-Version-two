"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { processCheckout } from "./actions"
import { PaymentModal } from "@/components/payment-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, Minus, Plus, Trash2 } from "lucide-react"

interface DeliveryPricing {
  id: string
  location_name: string
  price: number
}

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const cartItems = state.items
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "paypal">("mpesa")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryPricing[]>([])
  const [selectedDeliveryPriceId, setSelectedDeliveryPriceId] = useState<string | null>(null)
  const [loadingDeliveryPrices, setLoadingDeliveryPrices] = useState(true)

  useEffect(() => {
    const savedFirstName = localStorage.getItem("firstName")
    const savedLastName = localStorage.getItem("lastName")
    const savedEmail = localStorage.getItem("email")
    const savedPhone = localStorage.getItem("phone")
    const savedStreetAddress = localStorage.getItem("streetAddress")
    const savedCity = localStorage.getItem("city")
    const savedPostalCode = localStorage.getItem("postalCode")
    const savedOrderNotes = localStorage.getItem("orderNotes")
    const savedPaymentMethod = localStorage.getItem("paymentMethod")
    const savedSelectedDeliveryPriceId = localStorage.getItem("selectedDeliveryPriceId")

    if (savedFirstName) setFirstName(savedFirstName)
    if (savedLastName) setLastName(savedLastName)
    if (savedEmail) setEmail(savedEmail)
    if (savedPhone) setPhone(savedPhone)
    if (savedStreetAddress) setStreetAddress(savedStreetAddress)
    if (savedCity) setCity(savedCity)
    if (savedPostalCode) setPostalCode(savedPostalCode)
    if (savedOrderNotes) setOrderNotes(savedOrderNotes)
    if (savedPaymentMethod) setPaymentMethod(savedPaymentMethod as "mpesa" | "paypal")
    if (savedSelectedDeliveryPriceId) setSelectedDeliveryPriceId(savedSelectedDeliveryPriceId)
  }, [])

  useEffect(() => {
    localStorage.setItem("firstName", firstName)
    localStorage.setItem("lastName", lastName)
    localStorage.setItem("email", email)
    localStorage.setItem("phone", phone)
    localStorage.setItem("streetAddress", streetAddress)
    localStorage.setItem("city", city)
    localStorage.setItem("postalCode", postalCode)
    localStorage.setItem("orderNotes", orderNotes)
    localStorage.setItem("paymentMethod", paymentMethod)
    if (selectedDeliveryPriceId) {
      localStorage.setItem("selectedDeliveryPriceId", selectedDeliveryPriceId)
    } else {
      localStorage.removeItem("selectedDeliveryPriceId")
    }
  }, [
    firstName,
    lastName,
    email,
    phone,
    streetAddress,
    city,
    postalCode,
    orderNotes,
    paymentMethod,
    selectedDeliveryPriceId,
  ])

  // Fetch delivery prices
  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      setLoadingDeliveryPrices(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("delivery_pricing")
        .select("*")
        .order("location_name", { ascending: true })

      if (error) {
        console.error("Error fetching delivery prices:", error)
        toast({
          title: "Error",
          description: "Failed to load delivery options. Please try again.",
          variant: "destructive",
        })
      } else {
        setDeliveryLocations(data || [])
        // Set default selected price if not already set or if the saved one is no longer valid
        if (
          data &&
          data.length > 0 &&
          (!selectedDeliveryPriceId || !data.some((loc) => loc.id === selectedDeliveryPriceId))
        ) {
          setSelectedDeliveryPriceId(data[0].id)
        } else if (data && data.length === 0) {
          setSelectedDeliveryPriceId(null)
        }
      }
      setLoadingDeliveryPrices(false)
    }
    fetchDeliveryPrices()
  }, [])

  const shippingCost = useMemo(() => {
    const selectedLocation = deliveryLocations.find((loc) => loc.id === selectedDeliveryPriceId)
    return selectedLocation ? selectedLocation.price : 0
  }, [deliveryLocations, selectedDeliveryPriceId])

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  const totalAmount = useMemo(() => {
    return subtotal + shippingCost
  }, [subtotal, shippingCost])

  const handleQuantityChange = (id: string, delta: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: delta } })
  }

  const handleRemoveItem = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  const handleFinalizeOrder = async () => {
    setIsProcessing(true)
    const customerData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      street_address: streetAddress,
      city,
      postal_code: postalCode,
    }

    const orderData = {
      cartItems: cartItems,
      totalAmount,
      shippingCost,
      paymentMethod,
      orderNotes,
    }

    const result = await processCheckout(customerData, orderData)

    if (result.success) {
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been received and is being processed.",
        variant: "default",
      })
      dispatch({ type: "CLEAR_CART" })
      localStorage.removeItem("firstName")
      localStorage.removeItem("lastName")
      localStorage.removeItem("email")
      localStorage.removeItem("phone")
      localStorage.removeItem("streetAddress")
      localStorage.removeItem("city")
      localStorage.removeItem("postalCode")
      localStorage.removeItem("orderNotes")
      localStorage.removeItem("paymentMethod")
      localStorage.removeItem("selectedDeliveryPriceId")

      // Add a delay before redirecting
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 2-second delay

      router.push("/booklet")
    } else {
      toast({
        title: "Checkout Failed",
        description: result.error || "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    }
    setIsProcessing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    if (!firstName || !lastName || !email || !phone || !streetAddress || !city || !postalCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required contact and delivery details.",
        variant: "destructive",
      })
      return
    }

    if (!selectedDeliveryPriceId) {
      toast({
        title: "Missing Information",
        description: "Please select a delivery location.",
        variant: "destructive",
      })
      return
    }

    // Open the payment modal
    setShowPaymentModal(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/books" className="flex items-center text-sm text-gray-600 hover:text-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Books
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-semibold">Ksh {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium">Ksh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shipping</span>
                      {loadingDeliveryPrices ? (
                        <span className="text-gray-500">Loading...</span>
                      ) : (
                        <Select
                          value={selectedDeliveryPriceId || ""}
                          onValueChange={setSelectedDeliveryPriceId}
                          disabled={deliveryLocations.length === 0}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryLocations.length === 0 ? (
                              <SelectItem value="no-locations" disabled>
                                No delivery locations available
                              </SelectItem>
                            ) : (
                              deliveryLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.location_name} (Ksh {location.price.toLocaleString()})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>Ksh {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <Label
                  htmlFor="mpesa"
                  className="flex items-center justify-between rounded-md border-2 border-orange-500 p-4 cursor-pointer has-[[data-state=checked]]:border-orange-600"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="mpesa" id="mpesa" className="sr-only" />
                    <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={40} height={40} className="rounded-sm" />
                    <div>
                      <p className="font-medium">Pay securely with your M-Pesa mobile money account</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Popular
                  </span>
                </Label>
                <Label
                  htmlFor="paypal"
                  className="flex items-center justify-between rounded-md border-2 border-gray-200 p-4 cursor-pointer has-[[data-state=checked]]:border-gray-400"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                    <div className="w-10 h-10 bg-gray-200 rounded-sm flex items-center justify-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-paypal"
                      >
                        <path d="M12.5 6.5H18a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2h-5.5a2 2 0 0 0-2 2v.5a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h5.5a2 2 0 0 0 2-2v-.5a2 2 0 0 1 2-2Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Pay with your PayPal account or credit/debit card</p>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isProcessing || cartItems.length === 0 || !selectedDeliveryPriceId}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Complete Payment - Ksh ${totalAmount.toLocaleString()}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="street-address">Street Address</Label>
                <Input
                  id="street-address"
                  placeholder="Enter your street address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input
                    id="postal-code"
                    placeholder="Enter postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="order-notes"
                placeholder="Any special instructions for your order..."
                rows={4}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
      </form>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false)
          setIsProcessing(false)
        }}
        paymentMethod={paymentMethod}
        totalAmount={totalAmount}
        onPaymentSuccess={handleFinalizeOrder}
      />
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createOrder } from "../checkout/actions"
import { toast } from "sonner"
import PaymentModal from "@/components/payment-modal"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  })
  const [deliveryOption, setDeliveryOption] = useState("email")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [mpesaTillNumber, setMpesaTillNumber] = useState("")

  const deliveryPrices = {
    email: 0,
    pickup: 0,
    delivery: 500, // Example delivery price
  }

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryCost = deliveryPrices[deliveryOption as keyof typeof deliveryPrices] || 0
  const total = subtotal + deliveryCost

  useEffect(() => {
    if (state.itemCount === 0) {
      toast.error("Your cart is empty. Please add items to proceed to checkout.")
      router.push("/books")
    }
  }, [state.itemCount, router])

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: productId })
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
    }
  }

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value })
  }

  const handleCheckout = async () => {
    if (state.itemCount === 0) {
      toast.error("Your cart is empty. Please add items to proceed to checkout.")
      return
    }

    if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email || !customerDetails.phone) {
      toast.error("Please fill in all required customer details.")
      return
    }

    if (
      deliveryOption === "delivery" &&
      (!customerDetails.address || !customerDetails.city || !customerDetails.country || !customerDetails.zip)
    ) {
      toast.error("Please fill in all required delivery details.")
      return
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.")
      return
    }

    if (paymentMethod === "mpesa" && !mpesaTillNumber) {
      toast.error("Please enter the M-Pesa Till Number.")
      return
    }

    if (paymentMethod === "mpesa") {
      setIsPaymentModalOpen(true)
    } else if (paymentMethod === "paypal") {
      // Simulate PayPal payment
      toast.info("Redirecting to PayPal for payment...")
      // In a real application, you would redirect to PayPal's payment gateway
      // For now, we'll simulate success after a delay
      setTimeout(async () => {
        const orderData = {
          customerDetails,
          items: state.items,
          subtotal,
          deliveryCost,
          total,
          deliveryOption,
          paymentMethod,
        }
        const result = await createOrder(orderData)
        if (result.success) {
          toast.success("Order placed successfully! Redirecting to your booklet.")
          dispatch({ type: "CLEAR_CART" })
          router.push("/booklet")
        } else {
          toast.error(`Failed to place order: ${result.error}`)
        }
      }, 2000)
    }
  }

  const handlePaymentModalClose = async (success: boolean) => {
    setIsPaymentModalOpen(false)
    if (success) {
      const orderData = {
        customerDetails,
        items: state.items,
        subtotal,
        deliveryCost,
        total,
        deliveryOption,
        paymentMethod,
        mpesaTillNumber,
      }
      const result = await createOrder(orderData)
      if (result.success) {
        toast.success("Order placed successfully! Redirecting to your booklet.")
        dispatch({ type: "CLEAR_CART" })
        router.push("/booklet")
      } else {
        toast.error(`Failed to place order: ${result.error}`)
      }
    } else {
      toast.error("M-Pesa payment cancelled or failed.")
    }
  }

  if (state.itemCount === 0) {
    return null // Render nothing if cart is empty and redirect is happening
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header and Footer are now handled by app/layout.tsx */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={customerDetails.firstName}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={customerDetails.lastName}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerDetails.email}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={customerDetails.phone}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </div>
              {deliveryOption === "delivery" && (
                <>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={customerDetails.address}
                      onChange={handleCustomerDetailsChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={customerDetails.city}
                      onChange={handleCustomerDetailsChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={customerDetails.country}
                      onChange={handleCustomerDetailsChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={customerDetails.zip}
                      onChange={handleCustomerDetailsChange}
                      required
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">Ksh {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Ksh {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Ksh {deliveryCost.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Ksh {total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email">Email Delivery (E-book)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">Store Pickup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Home Delivery (Ksh 500)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mpesa" id="mpesa" />
                  <Label htmlFor="mpesa">M-Pesa</Label>
                </div>
                {paymentMethod === "mpesa" && (
                  <div className="ml-6">
                    <Label htmlFor="mpesaTillNumber">M-Pesa Till Number</Label>
                    <Input
                      id="mpesaTillNumber"
                      name="mpesaTillNumber"
                      value={mpesaTillNumber}
                      onChange={(e) => setMpesaTillNumber(e.target.value)}
                      placeholder="Enter Till Number"
                      required
                    />
                    <Image
                      src="/images/lipa-na-mpesa-till.jpg"
                      alt="Lipa Na M-Pesa Till"
                      width={150}
                      height={100}
                      className="mt-2"
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 flex justify-end">
            <Button size="lg" onClick={handleCheckout}>
              Place Order
            </Button>
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        amount={total}
        tillNumber={mpesaTillNumber}
      />
    </div>
  )
}
import { Trash2 } from "lucide-react"

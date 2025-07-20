"use client"

import type React from "react"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CartContext } from "@/contexts/cart-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PaymentModal } from "@/components/payment-modal"
import { createOrder } from "./actions"
import { toast } from "sonner"

interface DeliveryPricing {
  id: number
  country: string
  city: string
  price: number
}

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext)
  const [deliveryPricing, setDeliveryPricing] = useState<DeliveryPricing[]>([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [shippingCost, setShippingCost] = useState(0)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    notes: "",
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchDeliveryPricing = async () => {
      const { data, error } = await supabase.from("delivery_pricing").select("*")
      if (error) {
        console.error("Error fetching delivery pricing:", error)
      } else {
        setDeliveryPricing(data || [])
      }
    }
    fetchDeliveryPricing()
  }, [supabase])

  useEffect(() => {
    if (selectedCountry && selectedCity) {
      const price =
        deliveryPricing.find((item) => item.country === selectedCountry && item.city === selectedCity)?.price || 0
      setShippingCost(price)
    } else {
      setShippingCost(0)
    }
  }, [selectedCountry, selectedCity, deliveryPricing])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setCustomerDetails((prev) => ({ ...prev, [id]: value }))
  }

  const handleFinalizeOrder = async () => {
    if (
      !customerDetails.firstName ||
      !customerDetails.lastName ||
      !customerDetails.email ||
      !customerDetails.phone ||
      !customerDetails.address ||
      !selectedCountry ||
      !selectedCity
    ) {
      toast.error("Please fill in all required customer and delivery details.")
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add products before checking out.")
      return
    }

    const orderData = {
      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      delivery_address: `${customerDetails.address}, ${selectedCity}, ${selectedCountry}, ${customerDetails.zipCode}`,
      order_items: cart,
      total_amount: total,
      payment_method: paymentMethod,
      order_notes: customerDetails.notes,
      status: "Pending", // Initial status
    }

    const { success, error } = await createOrder(orderData)

    if (success) {
      toast.success("Order placed successfully! Redirecting to your booklet...")
      clearCart()
      setTimeout(() => {
        router.push("/booklet")
      }, 2000) // 2-second delay
    } else {
      toast.error(`Failed to place order: ${error}`)
    }
  }

  const countries = Array.from(new Set(deliveryPricing.map((item) => item.country)))
  const cities = selectedCountry
    ? Array.from(new Set(deliveryPricing.filter((item) => item.country === selectedCountry).map((item) => item.city)))
    : []

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold">Customer Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={customerDetails.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={customerDetails.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={customerDetails.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select onValueChange={setSelectedCountry} value={selectedCountry} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Select onValueChange={setSelectedCity} value={selectedCity} disabled={!selectedCountry} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" placeholder="12345" value={customerDetails.zipCode} onChange={handleInputChange} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes for your order."
                  value={customerDetails.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
            <RadioGroup
              defaultValue="paypal"
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onValueChange={setPaymentMethod}
            >
              <Label
                htmlFor="paypal"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 has-[[data-state=checked]]:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-800"
              >
                <RadioGroupItem id="paypal" value="paypal" className="sr-only" />
                <Image
                  src="/images/paypal-logo.png"
                  alt="PayPal"
                  width={100}
                  height={30}
                  className="mb-2 object-contain"
                />
                <span className="text-sm font-medium">Pay with PayPal</span>
              </Label>
              <Label
                htmlFor="mpesa"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 has-[[data-state=checked]]:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-800"
              >
                <RadioGroupItem id="mpesa" value="mpesa" className="sr-only" />
                <Image
                  src="/images/mpesa-logo.png"
                  alt="M-Pesa"
                  width={100}
                  height={30}
                  className="mb-2 object-contain"
                />
                <span className="text-sm font-medium">Pay with M-Pesa</span>
              </Label>
            </RadioGroup>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="mt-6 w-full" onClick={() => setIsPaymentModalOpen(true)}>
            Proceed to Payment
          </Button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentMethod={paymentMethod}
        totalAmount={total}
        onPaymentSuccess={handleFinalizeOrder}
      />
    </div>
  )
}

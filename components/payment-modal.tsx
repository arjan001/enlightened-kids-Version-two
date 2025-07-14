"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod: "mpesa" | "paypal" | null
}

export function PaymentModal({ isOpen, onClose, paymentMethod }: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { state } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    onClose()
    router.push("/booklet")
  }

  const handleClose = () => {
    if (!isProcessing) {
      onClose()
      setPhoneNumber("")
      setEmail("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complete Payment</span>
            {!isProcessing && (
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Header */}
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
            {paymentMethod === "mpesa" ? (
              <>
                <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={120} height={40} className="object-contain" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">PayPal</div>
              </>
            )}
          </div>

          {/* Amount Display */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(state.total)}</p>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            {paymentMethod === "mpesa" ? (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500">Enter your M-Pesa registered phone number</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">PayPal Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500">Enter your PayPal registered email address</p>
              </div>
            )}
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === "mpesa" ? !phoneNumber : !email)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ${formatPrice(state.total)}`
            )}
          </Button>

          {isProcessing && (
            <div className="text-center text-sm text-gray-600">
              {paymentMethod === "mpesa" ? "Please check your phone for M-Pesa prompt..." : "Redirecting to PayPal..."}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

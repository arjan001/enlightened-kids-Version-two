"use client"

import Image from "next/image"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod: "mpesa" | "paypal"
  totalAmount: number
  onPaymentSuccess: () => void
}

export function PaymentModal({ isOpen, onClose, paymentMethod, totalAmount, onPaymentSuccess }: PaymentModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Dummy trigger just to satisfy the component API */}
      <AlertDialogTrigger asChild></AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {paymentMethod === "mpesa" ? "M-Pesa Payment" : "PayPal Payment"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        {paymentMethod === "mpesa" ? (
          <div className="space-y-4">
            {/* M-Pesa instructions image */}
            <Image
              src="/images/lipa-na-mpesa-till.jpg"
              alt="Lipa Na M-Pesa Till Number"
              width={500}
              height={300}
              className="mx-auto rounded-md"
            />

            {/* Amount to pay */}
            <p className="text-center text-lg font-semibold">
              Total Payable: <span className="text-green-700">Ksh {totalAmount.toLocaleString()}</span>
            </p>

            <p className="text-sm text-muted-foreground text-center">
              Use the above Till Number to complete the payment in your M-Pesa app, then click “Confirm Payment”.
            </p>
          </div>
        ) : (
          <p className="text-center">A PayPal flow will be implemented later. Please click “Confirm” to continue.</p>
        )}

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onPaymentSuccess()
              onClose()
            }}
          >
            Confirm Payment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

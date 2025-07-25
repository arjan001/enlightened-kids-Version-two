"use client"

import Link from "next/link"
import { MessageSquare } from "lucide-react" // Using MessageSquare from lucide-react

export default function WhatsappButton() {
  // You can replace this with your actual WhatsApp number and default message
  const whatsappNumber = "+254110012701," // Example: Kenyan mobile number
  const message = "Hello, I'm interested in Enlightened Kids Africa!"

  return (
    <Link
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <MessageSquare className="h-8 w-8" />
    </Link>
  )
}

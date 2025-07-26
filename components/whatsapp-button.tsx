"use client"

import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function WhatsappButton() {
  // Changed to a purely numeric format, removing the '+' sign
  const whatsappNumber = "254110012701"

  return (
    <Link
      href={`https://wa.me/${whatsappNumber}`} // Link remains simple, without text parameter
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <MessageSquare className="h-8 w-8" />
    </Link>
  )
}

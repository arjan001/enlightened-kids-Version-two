"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import { useActionState } from "react"
import { useToast } from "@/components/ui/use-toast" // Import useToast
import { useEffect } from "react"
import { addContactMessageReducer } from "@/app/contact/actions"

export default function ContactPage() {
  const initialState = { success: false, error: null as string | null }
  const [state, formAction, isPending] = useActionState(addContactMessageReducer, initialState)

  const { toast } = useToast()

  // Show toast when state changes
  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
      })
    } else if (state.error) {
      toast({
        title: "Error!",
        description: state.error,
        variant: "destructive",
      })
    }
  }, [state, toast])

  return (
    <CartProvider>
      <div className="min-h-screen bg-white pt-16">
        <Header />

        <section className="py-12 md:py-20 bg-[#fdfaf6]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Contact Image */}
              <div className="relative h-[450px] w-full rounded-lg overflow-hidden">
                <Image
                  src="/Contact Form Image.jpg"
                  alt="Child with colorful paint on face"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>

              {/* Contact Form */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Form</h1>
                <p className="text-gray-600 mb-8">
                  Have a question, or just want to say hello? We'd love to hear from you. Whether you're a parent,
                  teacher, or fellow creative, your voice matters here.
                </p>

                <form action={formAction} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name*"
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your Email*"
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      rows={6}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg"
                    disabled={isPending}
                  >
                    {isPending ? "SENDING..." : "SUBMIT"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </CartProvider>
  )
}

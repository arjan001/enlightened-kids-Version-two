import { Button } from "@/components/ui/button"
import { Download, MessageCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function BookletPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Booklet Access Section */}
      <section className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-orange-300 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-green-300 rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-yellow-300 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/3 w-20 h-20 border-2 border-orange-300 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">Access Your Booklet</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Every purchase of Colours of Me comes with a free Discussion & Activity e-Booklet
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Instantly
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50 px-8 py-4 rounded-full text-lg flex items-center gap-2 bg-transparent"
            >
              <MessageCircle className="w-5 h-5" />
              Request Via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

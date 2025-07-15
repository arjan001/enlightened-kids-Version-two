import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Download, MessageCircle } from "lucide-react"

export default function BookletPage() {
  return (
    <div className="min-h-screen bg-white pt-16 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-green-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold text-orange-400 mb-2">Unlock Your Child's Potential</h1>
            <h2 className="text-3xl font-bold mb-4">Download Our Free Empowerment Booklet</h2>
            <p className="max-w-3xl mx-auto text-green-200 leading-relaxed">
              Our exclusive booklet is packed with engaging activities and powerful affirmations designed to help
              children build confidence, understand their emotions, and embrace their unique identity.
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex gap-8 text-center text-white">
              <div>
                <div className="text-orange-400 font-bold">• Interactive Activities</div>
              </div>
              <div>
                <div className="text-orange-400 font-bold">• Positive Affirmations</div>
              </div>
              <div>
                <div className="text-orange-400 font-bold">• Emotional Intelligence</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* What's Inside Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">What's Inside?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Fun & Engaging Activities</h3>
                  <p className="text-gray-600 text-sm">
                    Interactive exercises designed to make learning about emotions and identity enjoyable.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Positive Affirmations</h3>
                  <p className="text-gray-600 text-sm">
                    Daily affirmations to boost self-esteem and foster a positive self-image.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Emotional Intelligence Building</h3>
                  <p className="text-gray-600 text-sm">
                    Tools and tips to help children understand and manage their feelings effectively.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Cultural Connection</h3>
                  <p className="text-gray-600 text-sm">
                    Content that subtly weaves in elements of African heritage to build cultural pride.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Your Booklet Section */}
      <main
        className="flex-grow py-12 md:py-20 flex items-center justify-center"
        style={{
          backgroundImage: `url('/Enlightened Kids Pattern BG.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Access Your Booklet</h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Every purchase of Colours of Me comes with a free Discussion & Activity e-Booklet
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 text-lg rounded-lg shadow-md"
            >
              <Link href="/path-to-your-booklet.pdf" download>
                <Download className="w-5 h-5 mr-2" />
                Download Instantly
              </Link>
            </Button>
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 text-lg rounded-lg shadow-md"
            >
              <Link
                href="https://wa.me/yourphonenumber?text=I%20would%20like%20to%20request%20the%20e-Booklet."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Request Via Whatsapp
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

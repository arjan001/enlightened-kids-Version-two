import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Download } from "lucide-react"

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
        <Card className="w-full max-w-3xl mx-auto p-8 md:p-12 bg-white shadow-lg rounded-lg text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Access Your Booklet</h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            In the meantime as you await delivery you can download the book guide
          </p>
          <div className="flex justify-center">
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 text-lg rounded-lg shadow-md"
            >
              <Link href="/path-to-your-booklet.pdf" download>
                <Download className="w-5 h-5 mr-2" />
                Download Instantly
              </Link>
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

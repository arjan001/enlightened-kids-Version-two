import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function BookletPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
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

      {/* Booklet Details and Download Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 max-w-6xl mx-auto items-center">
            {/* Booklet Image */}
            <div className="lg:w-1/2">
              <Card className="p-4 md:p-6">
                <Image
                  src="/images/booklet.png"
                  alt="Empowerment Booklet Cover"
                  width={400}
                  height={550}
                  className="w-full max-w-sm mx-auto lg:max-w-none rounded-lg"
                />
              </Card>
            </div>

            {/* Download Form */}
            <div className="lg:w-1/2 px-4 lg:px-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Get Your Free Booklet Today!</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Simply fill out the form below to receive your complimentary copy of the "Enlightened Kids Empowerment
                Booklet" directly to your inbox.
              </p>

              <form className="grid gap-4">
                <div>
                  <Label htmlFor="name" className="sr-only">
                    Name
                  </Label>
                  <Input id="name" placeholder="Your Name" type="text" required />
                </div>
                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <Input id="email" placeholder="Your Email Address" type="email" required />
                </div>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white py-3">
                  Download Now
                </Button>
              </form>

              <div className="mt-6 text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No spam, just valuable content for your child's growth.</span>
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

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">What Parents Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="text-gray-700 italic mb-4">
                "This booklet has been a game-changer for my daughter! She loves the activities and it's helped her
                express her emotions so much better."
              </CardContent>
              <p className="font-semibold text-gray-800">- Aisha K.</p>
              <p className="text-sm text-gray-500">Parent, Nairobi</p>
            </Card>
            <Card className="p-6">
              <CardContent className="text-gray-700 italic mb-4">
                "Finally, resources that truly resonate with our cultural background. My son feels seen and empowered."
              </CardContent>
              <p className="font-semibold text-gray-800">- David O.</p>
              <p className="text-sm text-gray-500">Parent, Kisumu</p>
            </Card>
            <Card className="p-6">
              <CardContent className="text-gray-700 italic mb-4">
                "Simple, effective, and beautifully designed. A must-have for any parent looking to foster confidence."
              </CardContent>
              <p className="font-semibold text-gray-800">- Sarah M.</p>
              <p className="text-sm text-gray-500">Parent, Mombasa</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
            {/* Contact Image */}
            <div className="lg:w-1/2">
              <div
                className="h-96 lg:h-full rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: "url('/Contact Formimage.jpg?height=600&width=500')",
                }}
              >
                {/* Artistic overlay representing the colorful child image */}
                <div className="w-full h-full bg-gradient-to-br from-red-400/20 via-yellow-400/20 to-blue-400/20 rounded-lg"></div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Contact Form</h1>
              <p className="text-gray-600 mb-2">Have a question, or just want to say hello?</p>
              <p className="text-gray-600 mb-8">
                We'd love to hear from you. Whether you're a parent, teacher, or fellow creative, your voice matters
                here.
              </p>

              <form className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Name*"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Your Email*"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Your Message"
                    rows={6}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg"
                >
                  SUBMIT
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

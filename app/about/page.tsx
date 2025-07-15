import Image from "next/image"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-green-800 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Enlightened Kids Africa</h1>
          <p className="text-lg max-w-3xl mx-auto">
            We are dedicated to nurturing young minds through empowering stories and resources rooted in African
            heritage.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Enlightened Kids Africa, our mission is to empower children to discover their voice, embrace their
              identity, and express themselves with confidence and kindness. We believe in the power of storytelling to
              shape young minds and foster a deep connection to cultural heritage.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We create beautifully illustrated books and resources that inspire emotional growth, cultural pride, and
              self-worth, helping children navigate their world with resilience and empathy.
            </p>
          </div>
          <div className="relative h-64 md:h-96">
            <Image
              src="/images/about.png"
              alt="Children reading books"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Empowerment</h3>
              <p className="text-gray-600">
                We empower children to be confident, resilient, and to find their unique voice.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Cultural Pride</h3>
              <p className="text-gray-600">
                We celebrate African heritage and foster a strong sense of cultural identity.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Emotional Growth</h3>
              <p className="text-gray-600">
                We encourage children to understand and express their feelings in healthy ways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Author Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 md:h-96">
            <Image
              src="/Nyakio Cheryl.png"
              alt="Cheryl Nyakio"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet the Author</h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Cheryl Nyakio</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cheryl Nyakio is a passionate storyteller and advocate for children's emotional well-being and cultural
              identity. With a background in child psychology and a deep love for African narratives, Cheryl crafts
              stories that resonate with young readers and their families.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Her work is inspired by her desire to see every child grow up with confidence, kindness, and a strong
              sense of who they are. She believes that books are powerful tools for self-discovery and connection.
            </p>
            <Button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white">Learn More About Cheryl</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

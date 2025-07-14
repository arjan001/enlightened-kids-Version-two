import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Star, Lightbulb, Award } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Hero Section */}
      <section className="bg-green-800 py-15">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            
            <div className="lg:w-1/2 order-2 lg:order-2">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-6">About Nyakio</h1>
              <p className="text-green-200 mb-6 leading-relaxed text-lg">
                A conscious storyteller, devoted mother, and passionate advocate for children's empowerment. CherylNyakio uses her voice to craft culturally rich narratives that honor African identity, nurture emotional
                intelligence, and inspire young readers to embrace their inner wisdom.
              </p>
              <p className="text-green-200 leading-relaxed">
                Through her stories, she celebrates the boldness of self-expression, the beauty of self-discovery, and
                the power of raising a generation that walks in truth, confidence, and compassion.
              </p>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-1">
              <Image
                src="/Nyakio Cheryl Homepage.png?height=500&width=400"
                alt="Cheryl Nyakio"
                width={500}
                height={400}
                className="rounded-lg "
              />
            </div>

          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Story</h2>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              My journey as a storyteller began not with pen and paper, but with the profound realization that came with
              motherhood. Watching my children navigate the world, I saw how desperately they needed stories that
              reflected their beauty, their heritage, and their infinite potential.
            </p>

            <p>
              Growing up, I searched for books where children who looked like me were the heroes, the wise ones, the
              beloved protagonists of their own adventures. That search became my calling, to create the stories I
              wished had existed for me, and to ensure that no child would ever feel invisible in the world of
              literature.
            </p>

            <p>
              As a mother, writer, and advocate for conscious parenting, I believe that stories have the power to shape
              how children see themselves and their place in the world. Every book I write is a love letter to the
              children who will read it, a reminder that they are enough, exactly as they are.
            </p>
          </div>
        </div>
      </section>

{/* Mission & Values */}
<section className="py-20 bg-orange-50">
    <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mission & Values</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Self Awareness</h3>
                <p className="text-gray-600 text-sm">Helping children understand and embrace their unique gifts</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Cultural Pride</h3>
                <p className="text-gray-600 text-sm">Celebrating heritage and identity through storytelling</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Emotional Growth</h3>
                <p className="text-gray-600 text-sm">Nurturing emotional intelligence and resilience</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Empowerment</h3>
                <p className="text-gray-600 text-sm">Inspiring children to see themselves as heroes</p>
            </div>
        </div>
    </div>
</section>

      {/* Ready to Begin */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover stories that celebrate your child's unique light and help them tune into their own frequency of
            freedom.
          </p>
          <Link href="/books">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

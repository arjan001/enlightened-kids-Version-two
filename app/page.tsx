import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Lock, BookOpen, Award, Sun } from "lucide-react"
import Header from "@/components/header"
import { getPublishedBlogPosts } from "@/app/admin/blog/actions"
import Footer from "@/components/footer"

export default async function HomePage() {
  const blogPosts = await getPublishedBlogPosts()

  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
        {/* Top Left Star */}
        <Image
          src="/images/Star1.png"
          width={40}
          height={40}
          className="absolute top-10 left-4 md:left-10 w-10 h-10 md:w-12 md:h-12"
        />
        {/* Top Right Large Star */}
        <Image
          src="/images/LargeStar.png"
          width={80}
          height={80}
          className="absolute top-20 right-4 md:right-20 w-16 h-16 md:w-20 md:h-20"
        />
        {/* Bottom Left Heart */}
        <Image
          src="/images/Love.png"
          width={30}
          height={30}
          className="absolute bottom-20 left-4 md:left-20 w-6 h-6 md:w-8 md:h-8"
        />
        {/* Bottom Right Sunrise */}
        <Image
          src="/images/Sunrise.png"
          width={100}
          height={60}
          className="absolute bottom-10 right-4 md:right-10 w-20 h-12 md:w-24 md:h-16"
        />
        {/* Mid-Left Star2 */}
        <Image
          src="/images/star2.png"
          width={30}
          height={30}
          className="absolute top-1/3 left-[15%] w-8 h-8 md:w-10 md:h-10"
        />
        {/* Mid-Right Leaves */}
        <Image
          src="/images/leaves.png"
          width={80}
          height={80}
          className="absolute top-1/2 right-[10%] w-20 h-20 md:w-24 md:h-24"
        />

        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
            Stories that Illuminate,
            <br />
            Adventures that Empower
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Books that guide African children towards self-mastery, emotional strength, and cultural pride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/books">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg w-full sm:w-auto">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-6 md:px-8 py-3 md:py-4 rounded-full bg-transparent text-base md:text-lg w-full sm:w-auto"
              >
                Discover the Author
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="bg-green-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Stories</h2>
            <p className="text-green-200">Love that enlightens children and young adults</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="lg:w-1/2">
              <div className="relative">
                <Image
                  src="/Colours Of Me Front.jpg?height=400&width=300"
                  alt="Colours of me book cover"
                  width={400}
                  height={500}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>

            <div className="lg:w-1/2 text-white">
              <Badge className="bg-green-600 text-white mb-4 gap-4border border-white  px-3 py-2 mr-3 bg-transparent rounded-full">
                7+Yrs{" "}
              </Badge>
              <Badge className="bg-green-600 text-white mb-4 border border-white  px-3 py-2 bg-transparent rounded-full">
                Awakening{" "}
              </Badge>
              <h3 className="text-3xl font-bold mb-4">Colours of me</h3>
              <p className="text-lg mb-4 font-semibold">Stories of Unlocking Your Potential</p>
              <p className="text-green-200 mb-6 leading-relaxed">
                Colours with intention and heart! These beautiful stories celebrate the uniqueness in every child,
                helping them see every part of their identity, be bold, sensitive, curious, and strong.
              </p>

              <div className="mb-6">
                <p className="text-sm text-green-200 mb-2">WHAT'S INSIDE</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>✔ empowerment</span>
                  <span>✔ culture</span>
                  <span>✔ Affirmation</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-green-200 ml-2">4.8 (150 reviews)</span>
              </div>

              <Link href="/books">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
                  Explore the Book
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Author */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet the Author</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Pearl of Wisdom is a passionate storyteller with a deep belief in the power of storytelling to heal and
                inspire. As a mother and early childhood educator, she understands the profound impact that stories can
                have on young minds. Her work focuses on creating narratives that celebrate African heritage while
                addressing universal themes of self-discovery, resilience, and empowerment.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Through her books, Pearl aims to provide children with mirrors that reflect their own experiences and
                windows into new possibilities. Her stories are crafted to guide children towards a powerful truth: that
                they are not just participants in their own stories, but the authors of their own destiny.
              </p>

              <Link href="/about">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
                  Read More
                </Button>
              </Link>
            </div>

            <div className="lg:w-1/2">
              <Image
                src="/Nyakio Cheryl.png?height=350&width=400"
                alt="Author Pearl of Wisdom"
                width={400}
                height={350}
                className="rounded-lg "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 ">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Philosophy</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our stories are built on timeless African values and wisdom designed to nurture confident, thoughtful, and
              culturally proud children who can navigate the modern world while staying true to their roots.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="lucide lucide-lock text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Freedom Begins Within</h3>
              <p className="text-gray-600">
                Storytelling goes beyond adventure to unlock emotional depth and self-awareness in children.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Sun className="lucide lucide-sun text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Every Child is Enough</h3>
              <p className="text-gray-600">
                Our stories remind children they are whole, worthy, and powerful, just as they are.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="lucide lucide-book-open text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Teach Through Story</h3>
              <p className="text-gray-600">
                We use adventure, emotion, and reflection to deliver life lessons that stay with young readers.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Award className="lucide lucide-award text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Celebrate African Identity</h3>
              <p className="text-gray-600">
                Representation matters. Our characters reflect the richness, wisdom, and beauty of African cultures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Blogs</h2>
            <p className="text-gray-600">
              Discover parenting tips, cultural insights, and stories to empower collective growth for children and
              families in the African diaspora.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={post.image_url || "/placeholder.jpg"} alt={post.title} fill className="object-cover" />
                  {post.category && (
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">{post.category}</Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.content.substring(0, 150)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.read_time} min read</span>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 bg-transparent">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {blogPosts.length === 0 && (
              <p className="text-center text-gray-500 col-span-2">No blog posts published yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-green-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
            {/* Left Text */}
            <div className="text-white max-w-xl text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-green-200 text-lg ">
                Get updates on new book releases, parenting insights, and empowering stories that help children grow
                with confidence, curiosity, and heart.
              </p>
            </div>

            {/* Right Form */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl lg:justify-end mt-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full sm:w-auto flex-1 bg-white border-0 rounded-lg px-6 py-3"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full sm:w-auto flex-1 bg-white border-0 rounded-lg px-6 py-3"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg whitespace-nowrap">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#FFF7F0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Parents Are Saying</h2>
            <p className="text-gray-600">
              See how Pearl's stories are touching lives and helping children discover their inner strength.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl shadow-lg shadow-gray-200 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <img src="/placeholder-user.jpg" alt="James Sino" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-900">James Sino</h4>
                  <p className="text-sm text-gray-600">Parent</p>
                </div>
              </div>

              <hr className="my-4 border-gray-200" />

              <p className="italic text-gray-800 mb-4">
                My son finished the book and just sat there quietly, then said, ‘I think I found myself in this story.’
                That’s when I knew this book was something special.
              </p>

              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl shadow-lg shadow-gray-200 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <img src="/placeholder-user.jpg" alt="Grace Wanja" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-900">Grace Wanja</h4>
                  <p className="text-sm text-gray-600">Parent</p>
                </div>
              </div>

              <hr className="my-4 border-gray-200" />

              <p className="italic text-gray-800 mb-4">
                I bought it for my daughter but ended up reading it first, and it moved me deeply. This book is healing
                for both kids and parents.
              </p>

              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl shadow-lg shadow-gray-200 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <img src="/placeholder-user.jpg" alt="Mr Obiero" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-900">Mr Obiero</h4>
                  <p className="text-sm text-gray-600">Educator</p>
                </div>
              </div>

              <hr className="my-4 border-gray-200" />

              <p className="italic text-gray-800 mb-4">
                As a teacher, I’ve never come across children’s books that speak to both the mind and the soul like
                Cheryl’s. Her stories make my students feel seen.
              </p>

              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

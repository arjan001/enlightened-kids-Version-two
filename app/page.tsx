import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Sun, Sparkles, Lock, BookOpen, Award } from "lucide-react"
import Header from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-10 left-4 md:left-10">
          <Sun className="w-12 h-12 md:w-16 md:h-16 text-yellow-400" />
        </div>
        <div className="absolute top-20 right-4 md:right-20">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
        </div>
        <div className="absolute bottom-20 left-4 md:left-20">
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
        </div>
        <div className="absolute bottom-10 right-4 md:right-10">
          <div className="w-16 h-10 md:w-20 md:h-12 bg-blue-400 rounded-full relative">
            <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
              <Sun className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
          </div>
        </div>

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
                <Badge className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2">Save</Badge>
              </div>
            </div>

            <div className="lg:w-1/2 text-white">
              <Badge className="bg-green-600 text-white mb-4 gap-4border border-white  px-3 py-2 mr-3 bg-transparent rounded-full">7+Yrs </Badge>
              <Badge className="bg-green-600 text-white mb-4 border border-white  px-3 py-2 bg-transparent rounded-full">Awakening </Badge>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                className="lucide lucide-lock text-gray-700">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Freedom Begins Within</h3>
        <p className="text-gray-600">
            Storytelling goes beyond adventure to unlock emotional depth and self-awareness in children.
        </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                className="lucide lucide-sun text-gray-700">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M4.93 19.07l1.41-1.41" />
                <path d="M17.66 6.34l1.41-1.41" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Every Child is Enough</h3>
        <p className="text-gray-600">
            Our stories remind children they are whole, worthy, and powerful, just as they are.
        </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                className="lucide lucide-book-open text-gray-700">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Teach Through Story</h3>
        <p className="text-gray-600">
            We use adventure, emotion, and reflection to deliver life lessons that stay with young readers.
        </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                className="lucide lucide-award text-gray-700">
                <path d="m15.477 12.89 1.515 2.41a1 1 0 0 1-.845 1.597-.999.999 0 0 1-.605-.33l-1.398-1.57a.999.999 0 0 0-1.558 0L9.467 16.57a.999.999 0 0 1-.605.33 1 1 0 0 1-.845-1.597l1.515-2.41a.999.999 0 0 0-.154-1.25l-1.636-1.536a1 1 0 0 1 .465-1.745l2.25-.331a.999.999 0 0 0 .736-.549l.995-2.227a1 1 0 0 1 1.83 0l.995 2.227a.999.999 0 0 0 .736.549l2.25.331a1 1 0 0 1 .465 1.745l-1.636 1.536a.999.999 0 0 0-.154 1.25z" />
                <circle cx="12" cy="12" r="10" />
            </svg>
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
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/blog1.jpg?height=200&width=400"
                  alt="Blog post image"
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">Parenting</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Why African Children Need Stories That Unlock Self-Mastery
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover how our storytelling goes beyond entertainment to unlock emotional depth and empower children
                  with...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">5 min read</span>
                  <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 bg-transparent">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/blog1.jpg?height=200&width=400"
                  alt="Blog post image"
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-600 text-white">Storytelling</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Raising Emotionally Aware Kids Through Storytelling
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover how our stories help children connect with their thoughts, emotions, and inner wisdom through
                  engaging...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">3 min read</span>
                  <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 bg-transparent">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          Get updates on new book releases, parenting insights, and empowering stories that help children
          grow with confidence, curiosity, and heart.
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
          I bought it for my daughter but ended up reading it first, and it moved me deeply.
          This book is healing for both kids and parents.
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
          As a teacher, I’ve never come across children’s books that speak to both the mind and the soul like Cheryl’s. 
          Her stories make my students feel seen.
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
      <footer className="bg-green-900 text-white pt-16 pb-10">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-3 gap-12 mb-10">
      
      {/* Logo and Description */}
      <div>
        <div className="bg-white p-2 rounded-xl inline-block mb-4">
          <img src="/Enlightened Kids Africa Logo Horizontal - Color.svg" alt="Enlightened Kids Africa" className="w-40 h-auto" />
        </div>
        <p className="text-green-200 text-sm leading-relaxed mb-4">
          Rooted in African heritage and emotional truth, our books guide children toward
          self-awareness, purpose, and the freedom to be fully themselves.
        </p>
        <p className="font-semibold">Stories that awaken.</p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link href="/about" className="hover:underline">About</Link></li>
          <li><Link href="/books" className="hover:underline">Books</Link></li>
          <li><Link href="/blog" className="hover:underline">Blog</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      </div>

      {/* Subscribe */}
      <div>
        <h4 className="font-semibold mb-4">Subscribe</h4>
        <p className="text-green-200 text-sm mb-4">
          Sign up below to get reading tips, book recommendations, and seasonal inspirations delivered to your inbox:
        </p>
        <input
          type="email"
          placeholder="yourname@gmail.com"
          className="w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder:text-gray-300 mb-4"
        />
        <button className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded text-white font-semibold text-lg">
          SUBMIT
        </button>
        <div className="mt-6">
          <p className="mb-2 tracking-wide">FOLLOW</p>
          <div className="flex gap-4 text-white text-xl">
            <Link href="#"><i className="fab fa-instagram" /></Link>
            <Link href="#"><i className="fab fa-tiktok" /></Link>
            <Link href="#"><i className="fab fa-facebook" /></Link>
            <Link href="#"><i className="fab fa-youtube" /></Link>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Bottom */}
    <hr className="border-gray-600 mb-6" />
    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-green-200 gap-4">
      <p className="flex items-center gap-1">
        <span>&copy; 2025 Enlightened Kids Africa. All rights reserved</span>
      </p>
      <p className="flex items-center gap-2">
  Made with <span className="text-orange-500 text-lg">❤️</span> for African Children by{" "}
  <a
    href="http://oneplusafrica.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-white  hover:text-orange-500"
  >
    Oneplusafrica Tech Solutions
  </a>
</p>

   <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:underline">
              Terms of Service
            </Link>
          </div>
    </div>
  </div>
</footer>

    </div>
  )
}

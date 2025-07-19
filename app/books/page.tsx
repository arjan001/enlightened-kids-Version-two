"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Minus, Plus } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import { getFirstProduct } from "../admin/actions" // Import the new server action

// Define a type for the product data
interface Product {
  id: string
  title: string
  author: string
  price: number
  image_url: string | null
  description: string
  stock: number
  category: string
  created_at: string
}

const relatedBooks = [
  {
    id: "whispers-of-brave",
    title: "the boy who followed the wind (and other stories",
    author: "Cheryl Nyakio",
    price: 1800,
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "i-am-the-question",
    title: "Triggered (for teens)",
    author: "Cheryl Nyakio",
    price: 1500,
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "rooted-like-me",
    title: "Rooted Like Me",
    author: "Cheryl Nyakio",
    price: 2000,
    image: "/placeholder.svg?height=300&width=200",
  },
]

export default function BooksPage() {
  const { state, dispatch } = useCart()
  const [mainBook, setMainBook] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    // Initialize quantities for related books, main book quantity will be set after fetch
    ...relatedBooks.reduce((acc, book) => ({ ...acc, [book.id]: 1 }), {}),
  })
  const [activeTab, setActiveTab] = useState<"description" | "delivery">("description")

  useEffect(() => {
    async function fetchMainBook() {
      try {
        setIsLoading(true)
        // Fetch the first product from the database
        const data = await getFirstProduct()
        if (data) {
          setMainBook(data)
          setQuantities((prev) => ({ ...prev, [data.id]: 1 })) // Set initial quantity for the fetched book
        } else {
          setError("No main book found in the database. Please add a product via the admin dashboard.")
        }
      } catch (err) {
        console.error("Failed to fetch main book:", err)
        setError("Failed to load book details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMainBook()
  }, [])

  const updateQuantity = (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantities((prev) => ({ ...prev, [bookId]: newQuantity }))
  }

  const addToCart = (book: { id: string; title: string; author: string; price: number; image: string | null }) => {
    const quantity = quantities[book.id] || 1
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          image: book.image,
        },
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-16">
        <p>Loading book details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-16">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!mainBook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-16">
        <p>No book data available. Please ensure you have products in your database.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Hero Section */}
      <section className="bg-green-800 py-24">
        {" "}
        {/* Increased top/bottom padding */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8">
            {/* Left Column: Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left text-white">
              <h1 className="text-2xl font-bold text-orange-400 mb-2">A Powerful Story for Children</h1>
              <h2 className="text-3xl font-bold mb-4">to Discover Their Voice</h2>
              <p className="max-w-3xl mx-auto lg:mx-0 text-green-200 leading-relaxed">
                The world and everything in it is a wonderful experience. The stories in this book invite every child to
                freely enjoy it with calm hearts, curious minds, and thankful eyes. Through the adventures of the
                characters, you'll see yourself in their place and discover that, just like them, you have the power to
                shape your own experiences. Your adventurous self will uncover something powerful: your superpower, your
                magical self, isn't out there – it's already inside you. Because every moment brings you a choice, and
                in the present, anything is possible. So, what choice are you making this moment?
              </p>
            </div>
            {/* Right Column: Images with Overlap */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end relative h-[400px] w-[400px] sm:h-[450px] sm:w-[450px]">
              {" "}
              {/* Added relative positioning and fixed height/width */}
              <Image
                src="/images/colours-of-me-back.png"
                alt="Colours of Me Back Cover"
                width={300} // Increased size
                height={400} // Increased size
                className="absolute top-0 left-0 rounded-lg shadow-lg z-0" // Positioned and z-indexed
              />
              <Image
                src="/images/colours-of-me-front.jpg"
                alt="Colours of Me Front Cover"
                width={300} // Increased size
                height={400} // Increased size
                className="absolute bottom-0 right-0 rounded-lg shadow-lg z-10" // Positioned and z-indexed
              />
            </div>
          </div>

          {/* Badges Section */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-8 text-center text-white">
              <div>
                <div className="text-orange-400 font-bold">• Empowerment</div>
              </div>
              <div>
                <div className="text-orange-400 font-bold">• Culture</div>
              </div>
              <div>
                <div className="text-orange-400 font-bold">• Affirmations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Product Image */}
            <div className="lg:w-1/2">
              <Card className="p-4 md:p-6">
                <Image
                  src={mainBook.image_url || "/placeholder.svg"} // Dynamic image
                  alt={`${mainBook.title} book cover`}
                  width={350}
                  height={500}
                  className="w-full max-w-sm mx-auto lg:max-w-none rounded-lg"
                />
              </Card>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 px-4 lg:px-0">
              <Badge className="bg-green-600 text-white mb-4">NEW</Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{mainBook.title}</h1>{" "}
              {/* Dynamic title */}
              <Badge className="bg-green-600 text-white mb-4">By {mainBook.author}</Badge> {/* Dynamic author */}
              <p className="text-xl md:text-2xl font-bold text-orange-500 mb-2">{formatPrice(mainBook.price)}</p>{" "}
              {/* Dynamic price */}
              <p className="text-md  font-bold">In Stock: {mainBook.stock}</p> {/* Dynamic stock count */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {mainBook.description} {/* Dynamic description */}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(mainBook.id, (quantities[mainBook.id] || 1) - 1)}
                    disabled={(quantities[mainBook.id] || 1) <= 1} // Disable if quantity is 1
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold px-4">{quantities[mainBook.id] || 1}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(mainBook.id, (quantities[mainBook.id] || 1) + 1)}
                    disabled={(quantities[mainBook.id] || 1) >= mainBook.stock} // Disable if quantity reaches stock
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    addToCart({
                      id: mainBook.id,
                      title: mainBook.title,
                      author: mainBook.author,
                      price: mainBook.price,
                      image: mainBook.image_url,
                    })
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:flex-1 py-3"
                  disabled={mainBook.stock === 0} // Disable if out of stock
                >
                  {mainBook.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                <span>Payment Methods:</span>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">M-PESA</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Product Specifications</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Dimensions</span>
                <span className="font-semibold">20.3 x 0.70 x 25.4 cm</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Book Type</span>
                <span className="font-semibold">Hardcopy</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Genre</span>
                <span className="font-semibold">Emotional Growth</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Author</span>
                <span className="font-semibold">Cheryl Nyakio</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Age Range</span>
                <span className="font-semibold">7-14 yrs</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Language</span>
                <span className="font-semibold">English</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Region</span>
                <span className="font-semibold">Africa</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Publisher</span>
                <span className="font-semibold">Writers Guild Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description & Delivery Tabs - FIXED */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex gap-8 mb-8 border-b">
            <button
              onClick={() => setActiveTab("description")}
              className={`text-lg pb-2 transition-colors cursor-pointer ${
                activeTab === "description"
                  ? "font-semibold text-gray-800 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`text-lg pb-2 transition-colors cursor-pointer ${
                activeTab === "delivery"
                  ? "font-semibold text-gray-800 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Delivery & Returns
            </button>
          </div>

          <div className="min-h-[200px]">
            {activeTab === "description" ? (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {mainBook.description} {/* Dynamic description */}
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Key Themes:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Self-discovery and identity</li>
                    <li>Emotional intelligence and growth</li>
                    <li>Cultural pride and heritage</li>
                    <li>Confidence building</li>
                    <li>Kindness and empathy</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Delivery Coverage */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">General Terms of Delivery</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Delivery Coverage:</strong> We deliver countrywide. For areas outside our regular delivery
                      zones, special arrangements can be made at an additional cost.
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  {/* Delivery Timelines */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Delivery Timelines</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>
                        <strong>Local Deliveries (Nairobi):</strong> 1–3 business days
                      </p>
                      <p>
                        <strong>Other Regions in Kenya:</strong> 3–5 business days
                      </p>
                      <p>
                        <strong>International Deliveries:</strong> 7–21 business days depending on destination and
                        customs (to be communicated when set)
                      </p>
                    </div>
                  </div>

                  {/* Delivery Fees */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Delivery Fees</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>Delivery fees vary based on your location.</p>
                      <p>
                        <strong>Within Nairobi:</strong> From KES 120 to KES 1500 depending on the area and delivery
                        method
                      </p>
                    </div>
                  </div>

                  {/* Order Confirmation & Dispatch */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Order Confirmation & Dispatch</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>Orders are processed within 24–48 hours after payment confirmation.</p>
                      <p>You will receive a dispatch confirmation message and tracking number (if available).</p>
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Payment Terms</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>All orders must be paid in full before dispatch. We accept:</p>
                      <ul className="list-disc list-inside ml-4">
                        <li>M-Pesa</li>
                        <li>Bank Transfer</li>
                        <li>PayPal (for international orders)</li>
                      </ul>
                    </div>
                  </div>

                  {/* Returns & Replacements */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Returns & Replacements</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>We only accept returns if:</p>
                      <ul className="list-disc list-inside ml-4">
                        <li>You received the wrong item</li>
                        <li>The item has a manufacturing error</li>
                      </ul>
                      <p>Please report any issues within 48 hours of delivery with clear photo evidence.</p>
                    </div>
                  </div>

                  {/* Bulk Orders */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Bulk Orders</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>Special delivery arrangements and discounts are available for bulk orders (50+ copies).</p>
                      <p>Please contact us directly to organize delivery logistics.</p>
                    </div>
                  </div>

                  {/* Pick-Up Option */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Pick-Up Option</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>
                        Pick-up is available from our central location in Nairobi CBD. This must be confirmed in
                        advance.
                      </p>
                    </div>
                  </div>

                  {/* Delivery Partner */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Delivery Partners</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>
                        We use trusted courier services such as Pickup Mtaani, Fargo Courier, G4S, Wells Fargo, and DHL
                        for secure local and international deliveries.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Help Section */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Need Help?</h4>
                  <p className="text-gray-600">
                    For delivery or return questions, contact our customer service at{" "}
                    <strong>support@enlightenedkidsafrica.com</strong> or call <strong>+254 700 123 456</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-green-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-green-200 mb-6">
            Join our community for parenting insights and empowering stories that help children grow with confidence and
            cultural pride.
          </p>
          <div className="flex gap-4 justify-center max-w-md mx-auto">
            <input type="text" placeholder="First Name" className="px-4 py-2 rounded-full flex-1" />
            <input type="email" placeholder="Email Address" className="px-4 py-2 rounded-full flex-1" />
            <Button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full">SUBSCRIBE</Button>
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">You May Also Like</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {relatedBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="p-6">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="w-full mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-lg font-bold text-gray-800 mb-4">{formatPrice(book.price)}</p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(book.id, quantities[book.id] - 1)}
                      disabled={true} // Disable minus button
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="px-2">{quantities[book.id]}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(book.id, quantities[book.id] + 1)}
                      disabled={true} // Disable plus button
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => addToCart(book)}
                      className="bg-orange-500 hover:bg-orange-600 text-white flex-1 text-sm"
                      disabled={true} // Disable Add to Cart button
                    >
                      {"Coming Soon"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

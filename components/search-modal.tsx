"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Book {
  id: string
  title: string
  author: string
  price: number
  image: string
  category: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const sampleBooks: Book[] = [
  {
    id: "1",
    title: "The Adventures of Little Kesi",
    author: "Mary Wanjiku",
    price: 850,
    image: "/placeholder.svg?height=120&width=90",
    category: "Adventure",
  },
  {
    id: "2",
    title: "Safari Stories",
    author: "John Kamau",
    price: 750,
    image: "/placeholder.svg?height=120&width=90",
    category: "Nature",
  },
  {
    id: "3",
    title: "Counting with Animals",
    author: "Grace Njeri",
    price: 650,
    image: "/placeholder.svg?height=120&width=90",
    category: "Educational",
  },
  {
    id: "4",
    title: "The Magic Baobab Tree",
    author: "Peter Mwangi",
    price: 900,
    image: "/placeholder.svg?height=120&width=90",
    category: "Fantasy",
  },
  {
    id: "5",
    title: "Colors of Kenya",
    author: "Sarah Akinyi",
    price: 700,
    image: "/placeholder.svg?height=120&width=90",
    category: "Educational",
  },
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate search delay
    const searchTimeout = setTimeout(() => {
      const results = sampleBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Search Books</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for books, authors, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : searchQuery.trim() === "" ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Start typing to search for books...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No books found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} book{searchResults.length !== 1 ? "s" : ""}
                </p>
                {searchResults.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      width={60}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{book.category}</span>
                        <span className="font-semibold text-orange-500">{formatPrice(book.price)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Default export
export default SearchModal

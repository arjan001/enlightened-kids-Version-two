"use client"

import Link from "next/link"
import { Search, ShoppingCart, Menu } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import SearchModal from "./search-modal"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { state } = useCart()

  return (
    <>
      <header className="border-b bg-white fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
    <img
      src="/Enlightened Kids Africa Logo Horizontal - Color.svg" // Replace with actual path to your logo
      alt="Enlightened Kids Africa"
      className="h-20 w-auto"
    />
    {/* <span className="font-semibold text-gray-800 text-sm md:text-base">
      Enlightened Kids Africa
    </span> */}
  </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
  <Link href="/books" className="text-gray-700 hover:text-orange-500 font-bold transition-colors">Books</Link>
  <Link href="/about" className="text-gray-700 hover:text-orange-500 font-bold transition-colors">About</Link>
  <Link href="/blog" className="text-gray-700 hover:text-orange-500 font-bold transition-colors">Blog</Link>
  <Link href="/contact" className="text-gray-700 hover:text-orange-500 font-bold transition-colors">Contact</Link>
</nav>


          <div className="flex items-center gap-3 md:gap-4">
            <Search
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-orange-500 transition-colors"
              onClick={() => setIsSearchOpen(true)}
            />
            <Link href="/checkout" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-orange-500 transition-colors" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="/books"
                className="text-gray-700 hover:text-orange-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Books
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-orange-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-orange-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-orange-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

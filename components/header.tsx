"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, Search } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import SearchModal from "./search-modal"

export default function Header() {
  const { state } = useCart()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Enlightened Kids Africa Logo Horizontal - Color.svg"
            alt="Enlightened Kids Africa Logo"
            width={180}
            height={45}
            className="h-auto w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors font-fredoka font-semibold">
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-orange-500 transition-colors font-fredoka font-semibold"
          >
            About
          </Link>
          <Link
            href="/books"
            className="text-gray-700 hover:text-orange-500 transition-colors font-fredoka font-semibold"
          >
            Books
          </Link>
          <Link
            href="/blog"
            className="text-gray-700 hover:text-orange-500 transition-colors font-fredoka font-semibold"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-orange-500 transition-colors font-fredoka font-semibold"
          >
            Contact
          </Link>
          
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchModalOpen(true)}>
            <Search className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/checkout" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {state.itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 text-gray-700" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] p-0">
              <nav className="flex flex-col gap-4 p-4">
                <Link href="/" className="text-gray-800 hover:bg-gray-50 p-2 rounded-md font-fredoka font-semibold">
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-800 hover:bg-gray-50 p-2 rounded-md font-fredoka font-semibold"
                >
                  About
                </Link>
                <Link
                  href="/books"
                  className="text-gray-800 hover:bg-gray-50 p-2 rounded-md font-fredoka font-semibold"
                >
                  Books
                </Link>
                <Link href="/blog" className="text-gray-800 hover:bg-gray-50 p-2 rounded-md font-fredoka font-semibold">
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-800 hover:bg-gray-50 p-2 rounded-md font-fredoka font-semibold"
                >
                  Contact
                </Link>
                <Link
                  href="/admin"
                  className="text-gray-800 hover:bg-gray-50 p-2 rounded-md font-fredoka font-semibold"
                >
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </header>
  )
}

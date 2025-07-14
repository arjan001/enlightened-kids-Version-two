import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
          
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
    className="text-white underline hover:text-orange-500"
  >
    oneplusafrica tech solutions
  </a>
</p>

              <div className="flex gap-4">
                <Link href="#" className="hover:underline">Privacy Policy</Link>
                <Link href="#" className="hover:underline">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
  )
}

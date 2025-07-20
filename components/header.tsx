import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

const Header = () => {
  const { cart } = useCart()

  return (
    <header className="bg-gray-100 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          My Store
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/cart">Cart ({cart.length})</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image?: string
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  /* ----------  persistence ---------- */
  useEffect(() => {
    const stored = window.localStorage.getItem("ek_cart")
    if (stored) setItems(JSON.parse(stored))
  }, [])

  useEffect(() => {
    window.localStorage.setItem("ek_cart", JSON.stringify(items))
  }, [items])

  /* ----------  helpers  ---------- */
  const addItem = (item: CartItem) =>
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p))
      }
      return [...prev, item]
    })

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))

  const clearCart = () => setItems([])

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clearCart,
    totalItems: items.reduce((t, i) => t + i.quantity, 0),
    totalPrice: items.reduce((t, i) => t + i.quantity * i.price, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}

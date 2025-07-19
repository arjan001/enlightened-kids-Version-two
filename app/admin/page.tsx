"use client"

import type React from "react"

import { useState, useEffect, useCallback, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Eye,
  RefreshCw,
  CreditCard,
  Package,
  Settings,
  Bell,
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  ArrowUp,
  ArrowDown,
  LogOut,
  User,
  ChevronDown,
  UserPlus,
  Key,
  Menu,
  X,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Archive,
  CheckCircle,
  CalendarDays,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog, // Added back for delete confirmation
  AlertDialogAction, // Added back for delete confirmation
  AlertDialogCancel, // Added back for delete confirmation
  AlertDialogContent, // Added back for delete confirmation
  AlertDialogFooter, // Added back for delete confirmation
  AlertDialogHeader, // Added back for delete confirmation
  AlertDialogTitle, // Added back for delete confirmation
} from "@/components/ui/alert-dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Image from "next/image"
import { useRouter } from "next/navigation" // Import useRouter
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  signOutUser,
  getCustomers,
  getOrders,
  updateOrderStatus, // Import the new action
  getSiteVisitsCount, // Import the new action for site visits
  getPendingOrdersCount, // Import the new action to fetch pending orders count
  getUsersFromDb, // Import the new action to fetch users
} from "./actions"
import { addBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost } from "./blog/actions"
import { getContactMessages, updateContactMessageStatus, deleteContactMessage } from "./contact/actions"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseUser } from "./actions" // Import the SupabaseUser type

// Define a type for your product data
interface Product {
  id: string
  title: string
  author?: string
  description?: string
  price: number
  category?: string
  stock: number
  image_url?: string | null
  age_range?: string
  pages?: number
  status?: string
  sales?: number
  revenue?: number
  is_hot?: boolean
  created_at?: string
  updated_at?: string
}

// Define a type for your blog post data
interface BlogPost {
  id: string
  title: string
  excerpt?: string
  content: string
  author: string
  tags?: string[]
  category?: string
  read_time?: string
  image_url?: string
  is_published: boolean
  created_at: string
  published_at: string
  updated_at?: string
  views?: number
}

// Define a type for contact messages
interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: "new" | "read" | "archived"
  created_at: string
}

// Define a type for customer data
interface Customer {
  id: string
  customer_name: string
  customer_email: string
  phone_number: string | null
  shipping_address_line1: string | null
  shipping_city: string | null
  shipping_country: string | null
  created_at: string // aliased from order_date
}

// Define a type for order data
interface Order {
  id: string
  customer_name: string
  customer_email: string
  phone_number: string | null
  shipping_address_line1: string
  shipping_city: string
  shipping_country: string
  total_amount: number
  status: "pending" | "completed" | "shipped" | "cancelled"
  order_date: string
  order_items: Array<{
    product_id: string
    title: string
    quantity: number
    price: number
  }>
}

const initialState = {
  message: "",
  success: false,
}

// Dummy data that cannot be made dynamic from current backend
const returnRequests = 8
const paymentMethods = [
  { name: "M-Pesa", percentage: 65, transactions: 812 },
  { name: "PayPal", percentage: 35, transactions: 438 },
]

const roles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all features and settings",
    permissions: ["all"],
    userCount: 1,
  },
  {
    id: 2,
    name: "Manager",
    description: "Manage products, orders, and customers",
    permissions: ["products", "orders", "customers", "analytics"],
    userCount: 1,
  },
  {
    id: 3,
    name: "Editor",
    description: "Manage content and blog posts",
    permissions: ["blog", "products"],
    userCount: 1,
  },
  {
    id: 4,
    name: "Support",
    description: "Handle customer support and orders",
    permissions: ["orders", "customers"],
    userCount: 1,
  },
]

const permissions = [
  { id: "dashboard", name: "Dashboard", description: "View dashboard and analytics" },
  { id: "products", name: "Products", description: "Manage books and products" },
  { id: "orders", name: "Orders", description: "Manage customer orders" },
  { id: "customers", name: "Customers", description: "Manage customer accounts" },
  { id: "blog", name: "Blog", description: "Manage blog posts and content" },
  { id: "payments", name: "Payments", description: "Configure payment settings" },
  { id: "analytics", name: "Analytics", description: "View reports and analytics" },
  { id: "settings", name: "Settings", description: "Manage system settings" },
  { id: "users", name: "User Management", description: "Manage users and permissions" },
]

// ----------------------------------------------------------------------
// 🛠  Helpers  – avoid "undefined.charAt" runtime errors
// ----------------------------------------------------------------------
const getCustomerInitials = (customer: Customer) => {
  if (customer?.customer_name) {
    return customer.customer_name
      .split(" ")
      .slice(0, 2)
      .map((n: string) => n.charAt(0))
      .join("")
  }
  return "?"
}

const getCustomerFullName = (customer: Customer) => {
  return customer?.customer_name ?? "Unknown"
}

function getCustomerInitials2(customer: Customer): string {
  const firstNameInitial = customer.customer_name?.[0] || ""
  const lastNameInitial = customer.customer_name?.split(" ").pop()?.[0] || ""
  return `${firstNameInitial}${lastNameInitial}`.toUpperCase()
}

function getCustomerFullName2(customer: Customer): string {
  return customer.customer_name || "N/A"
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isEditBlogOpen, setIsEditBlogOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [isViewContactMessageOpen, setIsViewContactMessageOpen] = useState(false) // New state for contact message modal
  const [viewingContactMessage, setViewingContactMessage] = useState<ContactMessage | null>(null) // New state for viewing contact message

  const [deleteItem, setDeleteItem] = useState<{ type: string; id: string; name: string; imageUrl?: string } | null>(
    null,
  )
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null) // Use Order interface
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<Order["status"] | undefined>(undefined) // State for order status in modal
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingRole, setEditingRole] = useState<any>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [errorProducts, setErrorProducts] = useState<string | null>(null)

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loadingBlogPosts, setLoadingBlogPosts] = useState(true)
  const [errorBlogPosts, setErrorBlogPosts] = useState<string | null>(null)

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]) // New state for contact messages
  const [loadingContactMessages, setLoadingContactMessages] = useState(true) // New state for loading contact messages
  const [errorContactMessages, setErrorContactMessages] = useState<string | null>(null) // New state for contact messages error

  const [customers, setCustomers] = useState<Customer[]>([]) // New state for customers
  const [loadingCustomers, setLoadingCustomers] = useState(true) // New state for loading customers
  const [errorCustomers, setErrorCustomers] = useState<string | null>(null) // New state for customers error

  const [orders, setOrders] = useState<Order[]>([]) // New state for orders
  const [loadingOrders, setLoadingOrders] = useState(true) // New state for loading orders
  const [errorOrders, setErrorOrders] = useState<string | null>(null) // New state for orders error

  const [dbUsers, setDbUsers] = useState<SupabaseUser[]>([]) // New state for fetched users
  const [loadingDbUsers, setLoadingDbUsers] = useState(true) // New state for loading users
  const [errorDbUsers, setErrorDbUsers] = useState<string | null>(null) // New state for users error

  const [user, setUser] = useState<any>(null) // State to hold current user info

  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const router = useRouter() // Initialize useRouter

  // New states for dynamic dashboard data
  const [totalSales, setTotalSales] = useState(0)
  const [totalCustomersCount, setTotalCustomersCount] = useState(0)
  const [totalBooksCount, setTotalBooksCount] = useState(0)
  const [totalBlogPostsCount, setTotalBlogPostsCount] = useState(0)
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const [topSellingBooks, setTopSellingBooks] = useState<Product[]>([])
  const [monthlySalesData, setMonthlySalesData] = useState<{ month: string; sales: number; orders: number }[]>([])
  const [siteVisits, setSiteVisits] = useState(0) // State for dynamic site visits

  // Fetch user session on component mount
  useEffect(() => {
    const supabase = createClient()
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // Effect for Site Visits (client-side, now dynamic from server action)
  useEffect(() => {
    const fetchSiteVisits = async () => {
      try {
        const visits = await getSiteVisitsCount()
        setSiteVisits(visits)
      } catch (error: any) {
        console.error("Failed to fetch site visits:", error)
      }
    }
    fetchSiteVisits()
  }, []) // Empty dependency array means it runs once on mount

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    setErrorProducts(null)
    try {
      const fetchedProducts = await getProducts()
      setProducts(fetchedProducts)
    } catch (error: any) {
      setErrorProducts(error.message || "Failed to fetch products")
      console.error("Failed to fetch products:", error)
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  const fetchBlogPosts = useCallback(async () => {
    setLoadingBlogPosts(true)
    setErrorBlogPosts(null)
    try {
      const fetchedBlogPosts = await getBlogPosts()
      setBlogPosts(fetchedBlogPosts)
      setTotalBlogPostsCount(fetchedBlogPosts.length) // Update dashboard stat
    } catch (error: any) {
      setErrorBlogPosts(error.message || "Failed to fetch blog posts")
      console.error("Failed to fetch blog posts:", error)
    } finally {
      setLoadingBlogPosts(false)
    }
  }, [])

  const fetchContactMessages = useCallback(async () => {
    setLoadingContactMessages(true)
    setErrorContactMessages(null)
    try {
      const fetchedMessages = await getContactMessages()
      setContactMessages(fetchedMessages)
    } catch (error: any) {
      setErrorContactMessages(error.message || "Failed to fetch contact messages")
      console.error("Failed to fetch contact messages:", error)
    } finally {
      setLoadingContactMessages(false)
    }
  }, [])

  const fetchCustomers = useCallback(async () => {
    setLoadingCustomers(true)
    setErrorCustomers(null)
    try {
      const fetchedCustomers = await getCustomers()
      setCustomers(fetchedCustomers)
    } catch (error: any) {
      setErrorCustomers(error.message || "Failed to fetch customers")
      console.error("Failed to fetch customers:", error)
    } finally {
      setLoadingCustomers(false)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true)
    setErrorOrders(null)
    try {
      const fetchedOrders = await getOrders()
      setOrders(fetchedOrders)
    } catch (error: any) {
      setErrorOrders(error.message || "Failed to fetch orders")
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  const fetchDbUsers = useCallback(async () => {
    setLoadingDbUsers(true)
    setErrorDbUsers(null)
    try {
      const fetchedUsers = await getUsersFromDb()
      setDbUsers(fetchedUsers)
    } catch (error: any) {
      setErrorDbUsers(error.message || "Failed to fetch users")
      console.error("Failed to fetch users:", error)
    } finally {
      setLoadingDbUsers(false)
    }
  }, [])

  // Fetch pending orders count specifically
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const count = await getPendingOrdersCount()
        setPendingOrdersCount(count)
      } catch (error: any) {
        console.error("Failed to fetch pending orders count for dashboard:", error)
      }
    }
    fetchPendingCount()
  }, [orders]) // Re-fetch when orders change to keep count updated

  useEffect(() => {
    fetchProducts()
    fetchBlogPosts()
    fetchContactMessages() // Fetch contact messages on component mount
    fetchCustomers() // Fetch customers on component mount
    fetchOrders() // Fetch orders on component mount
  }, [fetchProducts, fetchBlogPosts, fetchContactMessages, fetchCustomers, fetchOrders])

  // Effect to fetch users when the "users" tab is active
  useEffect(() => {
    if (activeTab === "users") {
      fetchDbUsers()
    }
  }, [activeTab, fetchDbUsers])

  // Effect to calculate dashboard stats and chart data when orders, products, or customers change
  useEffect(() => {
    let calculatedTotalSales = 0
    const productSalesMap = new Map<
      string,
      { sales: number; revenue: number; title: string; image_url?: string | null }
    >()
    const monthlySalesMap = new Map<string, { sales: number; orders: number }>()

    orders.forEach((order) => {
      if (order.status === "completed" || order.status === "shipped") {
        calculatedTotalSales += order.total_amount

        // Aggregate for Top Selling Books
        order.order_items?.forEach((item) => {
          const current = productSalesMap.get(item.product_id) || {
            sales: 0,
            revenue: 0,
            title: item.title,
            image_url: null,
          }
          current.sales += item.quantity
          current.revenue += item.quantity * item.price
          productSalesMap.set(item.product_id, current)
        })

        // Aggregate for Monthly Sales Trend
        const orderDate = new Date(order.order_date)
        const monthKey = orderDate.toLocaleString("en-US", { month: "short", year: "numeric" }) // e.g., "Jan 2024"
        const currentMonthData = monthlySalesMap.get(monthKey) || { sales: 0, orders: 0 }
        currentMonthData.sales += order.total_amount
        currentMonthData.orders += 1
        monthlySalesMap.set(monthKey, currentMonthData)
      }
    })

    setTotalSales(calculatedTotalSales)
    // pendingOrdersCount is now set by its own useEffect

    // Convert product sales map to array and sort for Top Selling Books
    const sortedTopSellingBooks = Array.from(productSalesMap.entries())
      .map(([productId, data]) => {
        // Find the full product details to get image_url
        const product = products.find((p) => p.id === productId)
        return {
          id: productId,
          title: data.title,
          sales: data.sales,
          revenue: data.revenue,
          image_url: product?.image_url || null, // Use actual image_url if found
        }
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4) // Limit to top 4
    setTopSellingBooks(sortedTopSellingBooks)

    // Convert monthly sales map to array and sort by date
    const sortedMonthlySalesData = Array.from(monthlySalesMap.entries())
      .map(([month, data]) => ({ month, sales: data.sales, orders: data.orders }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()) // Sort by date
    setMonthlySalesData(sortedMonthlySalesData)

    // Update other counts
    setTotalCustomersCount(customers.length)
    setTotalBooksCount(products.length)
  }, [orders, products, customers]) // Recalculate when orders, products, or customers change

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleEdit = (type: string, item: any) => {
    if (type === "product") {
      setEditingProduct(item)
      setIsEditProductOpen(true)
    } else if (type === "blog") {
      setEditingBlog(item)
      setIsEditBlogOpen(true)
    } else if (type === "user") {
      setEditingUser(item)
      setIsEditUserOpen(true)
    } else if (type === "role") {
      setEditingRole(item)
      setIsEditRoleOpen(true)
    }
  }

  const handleDelete = (type: string, id: string, name: string, imageUrl?: string) => {
    setDeleteItem({ type, id, name, imageUrl })
    setIsDeleteAlertOpen(true)
  }

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order)
    setSelectedOrderStatus(order.status) // Initialize selected status when opening modal
    setIsViewOrderOpen(true)
  }

  const handleUpdateOrderStatus = async () => {
    console.log("[Client] handleUpdateOrderStatus called.")
    if (!viewingOrder || !selectedOrderStatus) {
      console.log("[Client] Missing viewingOrder or selectedOrderStatus. Aborting.")
      return
    }

    console.log(`[Client] Attempting to update order ${viewingOrder.id} to status: ${selectedOrderStatus}`)
    try {
      await updateOrderStatus(viewingOrder.id, selectedOrderStatus)
      toast({
        title: "Success",
        description: `Order ${viewingOrder.id} status updated to ${selectedOrderStatus}.`,
      })
      setIsViewOrderOpen(false)
      setViewingOrder(null)
      console.log("[Client] Order status updated successfully. Re-fetching orders...")
      fetchOrders() // Re-fetch orders to reflect the change in the table
    } catch (error: any) {
      console.error("[Client] Error updating order status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update order status.",
        variant: "destructive",
      })
    }
  }

  const handleViewContactMessage = (message: ContactMessage) => {
    setViewingContactMessage(message)
    setIsViewContactMessageOpen(true)
    // Optionally mark as read when viewed
    if (message.status === "new") {
      updateContactMessageStatus(message.id, "read")
    }
  }

  const confirmDeleteAction = async () => {
    if (!deleteItem) return

    try {
      if (deleteItem.type === "product") {
        await deleteProduct(deleteItem.id, deleteItem.imageUrl)
        console.log(`Product ${deleteItem.name} deleted successfully.`)
        fetchProducts() // Re-fetch products after deletion
      } else if (deleteItem.type === "blog") {
        await deleteBlogPost(deleteItem.id, deleteItem.imageUrl)
        console.log(`Blog post ${deleteItem.name} deleted successfully.`)
        fetchBlogPosts() // Re-fetch blog posts after deletion
      } else if (deleteItem.type === "contact-message") {
        await deleteContactMessage(deleteItem.id)
        console.log(`Contact message ${deleteItem.name} deleted successfully.`)
        fetchContactMessages() // Re-fetch contact messages after deletion
      }
      // Add other delete types here (e.g., user, role)
    } catch (error) {
      console.error(`Error deleting ${deleteItem.type}:`, error)
      // Optionally show a toast notification for error
    } finally {
      setIsDeleteAlertOpen(false)
      setDeleteItem(null)
    }
  }

  const handleAddProductSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    try {
      await addProduct(formData)
      setIsAddProductOpen(false)
      fetchProducts()
    } catch (error) {
      console.error("Failed to add product:", error)
    }
  }

  const handleUpdateProductSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingProduct?.id) return

    const formData = new FormData(event.currentTarget)
    // Add the current image URL to formData if no new image is selected
    if (!formData.get("image") || (formData.get("image") as File).size === 0) {
      formData.append("currentImageUrl", editingProduct.image_url || "")
    }

    try {
      await updateProduct(editingProduct.id, formData)
      setIsEditProductOpen(false)
      setEditingProduct(null)
      fetchProducts() // Re-fetch products after updating
    } catch (error) {
      console.error("Failed to update product:", error)
      // Optionally show a toast notification for error
    }
  }

  const handleAddBlogPostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    try {
      await addBlogPost(formData)
      setIsAddBlogOpen(false)
      fetchBlogPosts()
    } catch (error) {
      console.error("Failed to add blog post:", error)
    }
  }

  const handleUpdateBlogPostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingBlog?.id) return

    const formData = new FormData(event.currentTarget)
    // Preserve current image URL if no new file selected
    if (!(formData.get("image") as File)?.size) {
      formData.append("currentImageUrl", editingBlog.image_url || "")
    }

    try {
      await updateBlogPost(editingBlog.id, formData)
      setIsEditBlogOpen(false)
      setEditingBlog(null)
      fetchBlogPosts()
    } catch (error) {
      console.error("Failed to update blog post:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOutUser()
      toast({
        title: "Success",
        description: "You have been logged out.",
      })
      router.push("/admin/login") // Redirect to login page after successful logout
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out.",
        variant: "destructive",
      })
    }
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: BookOpen },
    { id: "orders", label: "Orders", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "blog", label: "Blog", icon: Edit },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "users", label: "User Management", icon: UserPlus },
    { id: "contact-messages", label: "Contact Messages", icon: MessageSquare }, // New sidebar item
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setCurrentProduct(null)
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = async (id: string, imageUrl?: string | null) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    startTransition(async () => {
      try {
        const result = await deleteProduct(id, imageUrl || undefined)
        if (result.success) {
          toast({
            title: "Success",
            description: "Product deleted successfully!",
          })
          fetchProducts()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete product.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to delete product: ${(error as Error).message}`,
          variant: "destructive",
        })
      }
    })
  }

  // Dummy data for traffic sources
  const trafficData = [
    { name: "Direct", value: 400, color: "#0088FE" },
    { name: "Social Media", value: 300, color: "#00C49F" },
    { name: "Search Engines", value: 300, color: "#FFBB28" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <Badge className="bg-green-100 text-green-800 hidden sm:inline-flex">Enlightened Kids Africa</Badge>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">{user?.email || "Guest User"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        >
          <nav className="p-4 pt-20 lg:pt-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsSidebarOpen(false)
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen overflow-x-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Total Sales</p>
                        <p className="text-sm sm:text-lg font-bold text-green-600 truncate">
                          {formatPrice(totalSales)}
                        </p>
                      </div>
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center mt-2 text-xs">
                      <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-green-500">12.5%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Customers</p>
                        <p className="text-sm sm:text-lg font-bold text-blue-600 truncate">
                          {totalCustomersCount.toLocaleString()}
                        </p>
                      </div>
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center mt-2 text-xs">
                      <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-green-500">8.2%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Site Visits</p>
                        <p className="text-sm sm:text-lg font-bold text-purple-600 truncate">
                          {siteVisits.toLocaleString()}
                        </p>
                      </div>
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center mt-2 text-xs">
                      <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-green-500">15.3%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Total Books</p>
                        <p className="text-sm sm:text-lg font-bold text-orange-600">{totalBooksCount}</p>
                      </div>
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center mt-2 text-xs">
                      <span className="text-gray-500">Active products</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Returns</p>
                        <p className="text-sm sm:text-lg font-bold text-red-600">{returnRequests}</p>
                      </div>
                      <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center mt-2 text-xs">
                      <ArrowDown className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-green-500">2.1%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Pending Orders</p>
                        <p className="text-sm sm:text-lg font-bold text-yellow-600">{pendingOrdersCount}</p>
                      </div>
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center mt-2 text-xs">
                      <span className="text-gray-500">Needs attention</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Selling Books */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topSellingBooks.length > 0 ? (
                        topSellingBooks.map((book, index) => (
                          <div key={book.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-green-600">#{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{book.title}</p>
                                <p className="text-xs text-gray-500">{book.sales || 0} copies sold</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-xs sm:text-sm">{formatPrice(book.revenue || 0)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No top selling books data available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.name} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{method.name}</span>
                            <span className="text-sm text-gray-500">{method.percentage}%</span>
                          </div>
                          <Progress value={method.percentage} className="h-2" />
                          <p className="text-xs text-gray-500">{method.transactions} transactions</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingOrders && <p>Loading orders...</p>}
                  {errorOrders && <p className="text-red-500">Error: {errorOrders}</p>}
                  {!loadingOrders && !errorOrders && orders.length === 0 && <p>No orders found.</p>}
                  {!loadingOrders && !errorOrders && orders.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[100px]">Order ID</TableHead>
                            <TableHead className="min-w-[120px]">Customer</TableHead>
                            <TableHead className="min-w-[150px]">Products</TableHead>
                            <TableHead className="min-w-[100px]">Amount</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[100px]">Date</TableHead>
                            <TableHead className="min-w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer_name}</TableCell>
                              <TableCell>
                                {order.order_items?.map((p) => `${p.title} (x${p.quantity})`).join(", ") || "N/A"}
                              </TableCell>
                              <TableCell>{formatPrice(order.total_amount)}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    order.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold">Products Management</h2>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Book Title</Label>
                          <Input id="title" name="title" placeholder="Enter book title" required />
                        </div>
                        <div>
                          <Label htmlFor="author">Author</Label>
                          <Input id="author" name="author" placeholder="Enter author name" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price (KES)</Label>
                          <Input id="price" name="price" type="number" step="0.01" placeholder="1700" required />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select name="category">
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="children">Children's Books</SelectItem>
                              <SelectItem value="educational">Educational</SelectItem>
                              <SelectItem value="cultural">Cultural Stories</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          placeholder="0"
                          defaultValue={0}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Enter book description" rows={4} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ageRange">Age Range</Label>
                          <Input id="ageRange" name="ageRange" placeholder="7-14 years" />
                        </div>
                        <div>
                          <Label htmlFor="pages">Number of Pages</Label>
                          <Input id="pages" name="pages" type="number" placeholder="32" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="image">Book Cover</Label>
                        <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Product</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>All Products</CardTitle>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Search products..." className="pl-10 w-full sm:w-64" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingProducts && <p>Loading products...</p>}
                  {errorProducts && <p className="text-red-500">Error: {errorProducts}</p>}
                  {!loadingProducts && !errorProducts && products.length === 0 && <p>No products found.</p>}
                  {!loadingProducts && !errorProducts && products.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Product</TableHead>
                            <TableHead className="min-w-[120px]">Author</TableHead>
                            <TableHead className="min-w-[100px]">Price</TableHead>
                            <TableHead className="min-w-[100px]">Sales</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((book) => {
                            // Debugging: Log the image_url for each book
                            console.log(`Product: ${book.title}, Image URL: ${book.image_url}`)
                            return (
                              <TableRow key={book.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Image
                                      src={book.image_url || "/placeholder.svg?height=50&width=40"}
                                      alt={book.title}
                                      width={40}
                                      height={50}
                                      className="rounded object-cover"
                                    />
                                    <div>
                                      <p className="font-medium">{book.title}</p>
                                      <div className="flex space-x-1 mt-1">
                                        {book.is_hot && <Badge className="bg-red-100 text-red-800 text-xs">Hot</Badge>}
                                        {book.status === "draft" && (
                                          <Badge className="bg-gray-100 text-gray-800 text-xs">Draft</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{formatPrice(book.price)}</TableCell>
                                <TableCell>{book.sales} copies</TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      book.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }
                                  >
                                    {book.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit("product", book)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete("product", book.id, book.title, book.image_url)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold">Blog Management</h2>
                <Dialog open={isAddBlogOpen} onOpenChange={setIsAddBlogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Blog Post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddBlogPostSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="blogTitle">Post Title</Label>
                        <Input id="blogTitle" name="title" placeholder="Enter post title" required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="blogAuthor">Author</Label>
                          <Input id="blogAuthor" name="author" defaultValue="Cheryl Nyakio" required />
                        </div>
                        <div>
                          <Label htmlFor="blogCategory">Category</Label>
                          <Select name="category">
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="parenting">Parenting Tips</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="culture">Cultural Stories</SelectItem>
                              <SelectItem value="development">Child Development</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="blogExcerpt">Excerpt</Label>
                        <Textarea
                          id="blogExcerpt"
                          name="excerpt"
                          placeholder="Brief description of the post"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="blogContent">Content</Label>
                        <Textarea
                          id="blogContent"
                          name="content"
                          placeholder="Write your blog post content here..."
                          rows={10}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="blogTags">Tags</Label>
                        <Input id="blogTags" name="tags" placeholder="parenting, children, culture (comma separated)" />
                      </div>
                      <div>
                        <Label htmlFor="featuredImage">Featured Image</Label>
                        <Input
                          id="featuredImage"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="publishNow" name="isPublished" />
                        <Label htmlFor="publishNow">Publish immediately</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddBlogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Post</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingBlogPosts && <p>Loading blog posts...</p>}
                  {errorBlogPosts && <p className="text-red-500">Error: {errorBlogPosts}</p>}
                  {!loadingBlogPosts && !errorBlogPosts && blogPosts.length === 0 && <p>No blog posts found.</p>}
                  {!loadingBlogPosts && !errorBlogPosts && blogPosts.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Title</TableHead>
                            <TableHead className="min-w-[120px]">Author</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[100px]">Views</TableHead>
                            <TableHead className="min-w-[100px]">Date</TableHead>
                            <TableHead className="min-w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogPosts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>{post.author}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    post.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {post.is_published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell>{post.views?.toLocaleString() || 0}</TableCell>
                              <TableCell>{new Date(post.published_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEdit("blog", post)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete("blog", post.id, post.title, post.image_url)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Payment Configuration</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>M-Pesa Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="mpesaShortcode">Shortcode</Label>
                      <Input id="mpesaShortcode" placeholder="174379" />
                    </div>
                    <div>
                      <Label htmlFor="mpesaPasskey">Passkey</Label>
                      <Input id="mpesaPasskey" type="password" placeholder="Enter passkey" />
                    </div>
                    <div>
                      <Label htmlFor="mpesaCallback">Callback URL</Label>
                      <Input id="mpesaCallback" placeholder="https://yoursite.com/callback" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="mpesaEnabled" defaultChecked />
                      <Label htmlFor="mpesaEnabled">Enable M-Pesa payments</Label>
                    </div>
                    <Button className="w-full">Save M-Pesa Settings</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>PayPal Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="paypalClientId">Client ID</Label>
                      <Input id="paypalClientId" placeholder="Enter PayPal Client ID" />
                    </div>
                    <div>
                      <Label htmlFor="paypalSecret">Client Secret</Label>
                      <Input id="paypalSecret" type="password" placeholder="Enter Client Secret" />
                    </div>
                    <div>
                      <Label htmlFor="paypalMode">Mode</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="paypalEnabled" defaultChecked />
                      <Label htmlFor="paypalEnabled">Enable PayPal payments</Label>
                    </div>
                    <Button className="w-full">Save PayPal Settings</Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input placeholder="Search transactions..." className="pl-10 w-full sm:w-64" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">Transaction ID</TableHead>
                          <TableHead className="min-w-[120px]">Customer</TableHead>
                          <TableHead className="min-w-[100px]">Method</TableHead>
                          <TableHead className="min-w-[100px]">Amount</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="min-w-[100px]">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">TXN-001</TableCell>
                          <TableCell>Jane Doe</TableCell>
                          <TableCell>M-Pesa</TableCell>
                          <TableCell>KES 1,700</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Success</Badge>
                          </TableCell>
                          <TableCell>2024-01-15</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">TXN-002</TableCell>
                          <TableCell>John Smith</TableCell>
                          <TableCell>PayPal</TableCell>
                          <TableCell>KES 2,000</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          </TableCell>
                          <TableCell>2024-01-14</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Settings</h2>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications" className="hidden lg:flex">
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="general" className="hidden lg:flex">
                    General
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl font-semibold">CN</span>
                        </div>
                        <Button variant="outline">Change Avatar</Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="Cheryl" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Nyakio" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="cheryl@enlightenedkidsafrica.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue="+254 700 123 456" />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" defaultValue="Author and founder of Enlightened Kids Africa" rows={3} />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button>Update Password</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable 2FA</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Switch />
                      </div>
                      <Button variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        Setup Authenticator App
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Orders</p>
                          <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Low Stock Alerts</p>
                          <p className="text-sm text-gray-500">Get notified when products are running low</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Customer Reviews</p>
                          <p className="text-sm text-gray-500">Get notified about new customer reviews</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Updates</p>
                          <p className="text-sm text-gray-500">Receive updates about marketing campaigns</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="general" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input id="siteName" defaultValue="Enlightened Kids Africa" />
                      </div>
                      <div>
                        <Label htmlFor="siteDescription">Site Description</Label>
                        <Textarea
                          id="siteDescription"
                          defaultValue="Empowering children through culturally rich stories"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select defaultValue="kes">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kes">Kenyan Shilling (KES)</SelectItem>
                            <SelectItem value="usd">US Dollar (USD)</SelectItem>
                            <SelectItem value="eur">Euro (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="eat">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">Eastern Standard Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button>Save Settings</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics & Reports</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {((totalSales / 100000) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Conversion Rate</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">4.8</p>
                      <p className="text-xs sm:text-sm text-gray-600">Avg. Rating</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl font-bold text-purple-600">2.5min</p>
                      <p className="text-xs sm:text-sm text-gray-600">Avg. Session</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">92%</p>
                      <p className="text-xs sm:text-sm text-gray-600">Customer Satisfaction</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        sales: {
                          label: "Sales",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[250px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="sales" fill="var(--color-sales)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        direct: {
                          label: "Direct",
                          color: "#8884d8",
                        },
                        social: {
                          label: "Social Media",
                          color: "#82ca9d",
                        },
                        search: {
                          label: "Search Engines",
                          color: "#ffc658",
                        },
                      }}
                      className="h-[250px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={trafficData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {trafficData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[250px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="sales" stroke="var(--color-revenue)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "customers" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Customer Management</h2>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>All Customers</CardTitle>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Search customers..." className="pl-10 w-full sm:w-64" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingCustomers && <p>Loading customers...</p>}
                  {errorCustomers && <p className="text-red-500">Error: {errorCustomers}</p>}
                  {!loadingCustomers && !errorCustomers && customers.length === 0 && <p>No customers found.</p>}
                  {!loadingCustomers && !errorCustomers && customers.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[150px]">Customer</TableHead>
                            <TableHead className="min-w-[200px]">Email</TableHead>
                            <TableHead className="min-w-[120px]">Phone</TableHead>
                            <TableHead className="min-w-[250px]">Address</TableHead>
                            <TableHead className="min-w-[100px]">City</TableHead>
                            <TableHead className="min-w-[100px]">Country</TableHead>
                            <TableHead className="min-w-[100px]">Created At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customers.map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-blue-600">
                                      {getCustomerInitials(customer)}
                                    </span>
                                  </div>
                                  <span className="font-medium">{getCustomerFullName(customer)}</span>
                                </div>
                              </TableCell>
                              <TableCell>{customer.customer_email}</TableCell>
                              <TableCell>{customer.phone_number || "N/A"}</TableCell>
                              <TableCell>{customer.shipping_address_line1 || "N/A"}</TableCell>
                              <TableCell>{customer.shipping_city || "N/A"}</TableCell>
                              <TableCell>{customer.shipping_country || "N/A"}</TableCell>
                              <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Order Management</h2>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>All Orders</CardTitle>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Orders</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Search orders..." className="pl-10 w-full sm:w-64" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingOrders && <p>Loading orders...</p>}
                  {errorOrders && <p className="text-red-500">Error: {errorOrders}</p>}
                  {!loadingOrders && !errorOrders && orders.length === 0 && <p>No orders found.</p>}
                  {!loadingOrders && !errorOrders && orders.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[100px]">Order ID</TableHead>
                            <TableHead className="min-w-[120px]">Customer</TableHead>
                            <TableHead className="min-w-[150px]">Products</TableHead>
                            <TableHead className="min-w-[100px]">Total</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[100px]">Date</TableHead>
                            <TableHead className="min-w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer_name}</TableCell>
                              <TableCell>
                                {order.order_items?.map((p) => `${p.title} (x${p.quantity})`).join(", ") || "N/A"}
                              </TableCell>
                              <TableCell>{formatPrice(order.total_amount)}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    order.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="userName">Full Name</Label>
                          <Input id="userName" placeholder="Enter full name" />
                        </div>
                        <div>
                          <Label htmlFor="userEmail">Email Address</Label>
                          <Input id="userEmail" type="email" placeholder="Enter email address" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="userRole">Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name.toLowerCase()}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="userStatus">Status</Label>
                          <Select defaultValue="active">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="userPassword">Temporary Password</Label>
                        <Input id="userPassword" type="password" placeholder="Enter temporary password" />
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <input type="checkbox" id={permission.id} className="rounded border-gray-300" />
                              <Label htmlFor={permission.id} className="text-sm">
                                {permission.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            console.log("Adding new user...")
                            setIsAddUserOpen(false)
                          }}
                        >
                          Add User
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="roles">Roles</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>All Users</CardTitle>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Search users..." className="pl-10 w-full sm:w-64" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loadingDbUsers && <p>Loading users...</p>}
                      {errorDbUsers && <p className="text-red-500">Error: {errorDbUsers}</p>}
                      {!loadingDbUsers && !errorDbUsers && dbUsers.length === 0 && <p>No users found.</p>}
                      {!loadingDbUsers && !errorDbUsers && dbUsers.length > 0 && (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="min-w-[200px]">User</TableHead>
                                <TableHead className="min-w-[120px]">Role</TableHead>
                                <TableHead className="min-w-[100px]">Status</TableHead>
                                <TableHead className="min-w-[150px]">Last Login</TableHead>
                                <TableHead className="min-w-[120px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dbUsers.map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell>
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                          {user.user_metadata?.full_name
                                            ? user.user_metadata.full_name
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")
                                            : user.email
                                              ? user.email[0].toUpperCase()
                                              : "U"}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-blue-100 text-blue-800">{user.role || "User"}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        user.last_sign_in_at
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {user.last_sign_in_at ? "Active" : "Inactive"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm" onClick={() => handleEdit("user", user)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete("user", user.id, user.email || "Unknown User")}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>User Roles</CardTitle>
                        <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Role
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Add New Role</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="roleName">Role Name</Label>
                                <Input id="roleName" placeholder="Enter role name" />
                              </div>
                              <div>
                                <Label htmlFor="roleDescription">Description</Label>
                                <Textarea id="roleDescription" placeholder="Enter role description" rows={3} />
                              </div>
                              <div>
                                <Label>Permissions</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id={`role-${permission.id}`}
                                        className="rounded border-gray-300"
                                      />
                                      <Label htmlFor={`role-${permission.id}`} className="text-sm">
                                        {permission.name}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    console.log("Adding new role...")
                                    setIsAddRoleOpen(false)
                                  }}
                                >
                                  Add Role
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roles.map((role) => (
                          <Card key={role.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">{role.name}</h4>
                                  <p className="text-sm text-gray-600">{role.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEdit("role", role)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete("role", role.id.toString(), role.name)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Users:</span>
                                  <Badge variant="secondary">{role.userCount}</Badge>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Permissions:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {role.permissions.slice(0, 3).map((permission) => (
                                      <Badge key={permission} variant="outline" className="text-xs">
                                        {permission}
                                      </Badge>
                                    ))}
                                    {role.permissions.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{role.permissions.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {permissions.map((permission) => (
                          <Card key={permission.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Key className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{permission.name}</h4>
                                    <p className="text-sm text-gray-600">{permission.description}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "contact-messages" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Contact Messages</h2>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>All Messages</CardTitle>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <Select defaultValue="new">
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                          <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Search messages..." className="pl-10 w-full sm:w-64" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingContactMessages && <p>Loading contact messages...</p>}
                  {errorContactMessages && <p className="text-red-500">Error: {errorContactMessages}</p>}
                  {!loadingContactMessages && !errorContactMessages && contactMessages.length === 0 && (
                    <p>No contact messages found.</p>
                  )}
                  {!loadingContactMessages && !errorContactMessages && contactMessages.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[200px]">Email</TableHead>
                            <TableHead className="min-w-[300px]">Message</TableHead>
                            <TableHead className="min-w-[150px]">Status</TableHead>
                            <TableHead className="min-w-[150px]">Date</TableHead>
                            <TableHead className="min-w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contactMessages.map((message) => (
                            <TableRow key={message.id}>
                              <TableCell>{message.name}</TableCell>
                              <TableCell>{message.email}</TableCell>
                              <TableCell>{message.message}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    message.status === "new"
                                      ? "bg-blue-100 text-blue-800"
                                      : message.status === "read"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewContactMessage(message)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open dropdown menu</span>
                                        <ChevronDown className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {message.status === "new" && (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            updateContactMessageStatus(message.id, "read")
                                            fetchContactMessages()
                                          }}
                                        >
                                          Mark as Read
                                        </DropdownMenuItem>
                                      )}
                                      {message.status !== "archived" && (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            updateContactMessageStatus(message.id, "archived")
                                            fetchContactMessages()
                                          }}
                                        >
                                          Archive
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem
                                        onClick={() => handleDelete("contact-message", message.id, message.name)}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Edit Product Modal */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleUpdateProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editTitle">Book Title</Label>
                  <Input
                    id="editTitle"
                    name="title"
                    placeholder="Enter book title"
                    defaultValue={editingProduct.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editAuthor">Author</Label>
                  <Input
                    id="editAuthor"
                    name="author"
                    placeholder="Enter author name"
                    defaultValue={editingProduct.author}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editPrice">Price (KES)</Label>
                  <Input
                    id="editPrice"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct.price}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCategory">Category</Label>
                  <Select name="category" defaultValue={editingProduct.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Children's Books</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="cultural">Cultural Stories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="editStock">Stock</Label>
                <Input
                  id="editStock"
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={editingProduct.stock ?? 0}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  name="description"
                  defaultValue={editingProduct.description || ""}
                  placeholder="Enter book description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editAgeRange">Age Range</Label>
                  <Input id="editAgeRange" name="ageRange" defaultValue={editingProduct.age_range || ""} />
                </div>
                <div>
                  <Label htmlFor="editPages">Number of Pages</Label>
                  <Input id="editPages" name="pages" type="number" defaultValue={editingProduct.pages || ""} />
                </div>
              </div>
              <div>
                <Label htmlFor="editImage">Book Cover</Label>
                {editingProduct.image_url && (
                  <div className="mb-2">
                    <Image
                      src={editingProduct.image_url || "/placeholder.svg"}
                      alt="Current Book Cover"
                      width={80}
                      height={100}
                      className="rounded object-cover"
                    />
                    <p className="text-xs text-gray-500 mt-1">Current image</p>
                  </div>
                )}
                <Input id="editImage" name="image" type="file" accept="image/*" className="cursor-pointer" />
                <input type="hidden" name="currentImageUrl" value={editingProduct.image_url || ""} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditProductOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Product</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Blog Modal */}
      <Dialog open={isEditBlogOpen} onOpenChange={setIsEditBlogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editingBlog && (
            <form onSubmit={handleUpdateBlogPostSubmit} className="space-y-4">
              <div>
                <Label htmlFor="editBlogTitle">Post Title</Label>
                <Input id="editBlogTitle" name="title" defaultValue={editingBlog.title || ""} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editBlogAuthor">Author</Label>
                  <Input id="editBlogAuthor" name="author" defaultValue={editingBlog.author || ""} required />
                </div>
                <div>
                  <Label htmlFor="editBlogCategory">Category</Label>
                  <Select name="category" defaultValue={editingBlog.category || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parenting">Parenting Tips</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="culture">Cultural Stories</SelectItem>
                      <SelectItem value="development">Child Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="editBlogExcerpt">Excerpt</Label>
                <Textarea
                  id="editBlogExcerpt"
                  name="excerpt"
                  defaultValue={editingBlog.excerpt || ""}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editBlogContent">Content</Label>
                <Textarea
                  id="editBlogContent"
                  name="content"
                  defaultValue={editingBlog.content || ""}
                  placeholder="Write your blog post content here..."
                  rows={10}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editBlogTags">Tags</Label>
                <Input
                  id="editBlogTags"
                  name="tags"
                  defaultValue={editingBlog.tags?.join(", ") || ""}
                  placeholder="parenting, children, culture (comma separated)"
                />
              </div>
              <div>
                <Label htmlFor="editFeaturedImage">Featured Image</Label>
                <Input id="editFeaturedImage" name="image" type="file" accept="image/*" className="cursor-pointer" />
                <input type="hidden" name="currentImageUrl" value={editingBlog.image_url || ""} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="editPublishNow" name="isPublished" defaultChecked={editingBlog.is_published} />
                <Label htmlFor="editPublishNow">Publish immediately</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditBlogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Post</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Order Modal */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Order {viewingOrder.id}</h3>
                  {/* <p className="text-sm text-gray-500">Transaction ID: {viewingOrder.transactionId}</p> */}
                </div>
                {/* Status Select */}
                <div className="flex items-center space-x-2">
                  <Label htmlFor="orderStatus" className="sr-only">
                    Order Status
                  </Label>
                  <Select
                    value={selectedOrderStatus}
                    onValueChange={(value: Order["status"]) => setSelectedOrderStatus(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{viewingOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{viewingOrder.customer_email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{viewingOrder.phone_number}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">
                        {viewingOrder.shipping_address_line1}, {viewingOrder.shipping_city},{" "}
                        {viewingOrder.shipping_country}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(viewingOrder.order_date).toLocaleDateString()} at{" "}
                        {new Date(viewingOrder.order_date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">M-Pesa</span> {/* Assuming M-Pesa for now */}
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{formatPrice(viewingOrder.total_amount)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Product Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {viewingOrder.order_items && viewingOrder.order_items.length > 0 ? (
                    viewingOrder.order_items.map((product, index) => {
                      // Find the full product details from the 'products' state
                      const productDetails = products.find((p) => p.id === product.product_id)
                      // Use the actual image_url if available, otherwise fallback to a placeholder
                      const imageUrl = productDetails?.image_url || "/placeholder.svg?height=100&width=80"
                      return (
                        <div
                          key={product.product_id || index}
                          className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 last:mb-0"
                        >
                          <Image
                            src={imageUrl || "/placeholder.svg"} // Corrected: Use the 'imageUrl' variable here
                            alt={product.title}
                            width={80}
                            height={100}
                            className="rounded-lg object-cover mx-auto sm:mx-0"
                          />
                          <div className="flex-1 text-center sm:text-left">
                            <h4 className="font-semibold text-lg">{product.title}</h4>
                            <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                            <p className="text-lg font-bold text-green-600 mt-2">
                              {formatPrice(product.price * product.quantity)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500">No product details available for this order.</p>
                  )}
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-gray-500">
                          {new Date(viewingOrder.order_date).toLocaleDateString()} at{" "}
                          {new Date(viewingOrder.order_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {viewingOrder.status !== "pending" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Payment Confirmed</p>
                          <p className="text-sm text-gray-500">Payment via M-Pesa</p>
                        </div>
                      </div>
                    )}
                    {viewingOrder.status === "shipped" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Order Shipped</p>
                          <p className="text-sm text-gray-500">Package is on the way</p>
                        </div>
                      </div>
                    )}
                    {viewingOrder.status === "completed" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Order Delivered</p>
                          <p className="text-sm text-gray-500">Successfully delivered to customer</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewOrderOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleUpdateOrderStatus}>Update Status</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAction} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Contact Message Dialog */}
      <Dialog open={isViewContactMessageOpen} onOpenChange={setIsViewContactMessageOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
          </DialogHeader>
          {viewingContactMessage && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">From:</Label>
                <p className="text-base">{viewingContactMessage.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email:</Label>
                <p className="text-base">{viewingContactMessage.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Date:</Label>
                <p className="text-base">{new Date(viewingContactMessage.created_at).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status:</Label>
                <Badge
                  className={
                    viewingContactMessage.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : viewingContactMessage.status === "read"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {viewingContactMessage.status.charAt(0).toUpperCase() + viewingContactMessage.status.slice(1)}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Message:</Label>
                <p className="text-base whitespace-pre-wrap">{viewingContactMessage.message}</p>
              </div>
              <div className="flex justify-end space-x-2">
                {viewingContactMessage.status !== "archived" && (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await updateContactMessageStatus(viewingContactMessage.id, "archived")
                      fetchContactMessages()
                      setIsViewContactMessageOpen(false)
                    }}
                  >
                    <Archive className="w-4 h-4 mr-2" /> Archive
                  </Button>
                )}
                {viewingContactMessage.status !== "read" && (
                  <Button
                    onClick={async () => {
                      await updateContactMessageStatus(viewingContactMessage.id, "read")
                      fetchContactMessages()
                      setIsViewContactMessageOpen(false)
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Mark as Read
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsViewContactMessageOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

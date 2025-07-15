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
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  Key,
  Menu,
  X,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
import { addProduct, getProducts, updateProduct, deleteProduct } from "./actions" // Import Product Server Actions
import { addBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost } from "./blog/actions" // Import Blog Server Actions
import { uploadBlogImage } from "./blog/client-upload"
import { useToast } from "@/components/ui/use-toast"

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

const initialState = {
  message: "",
  success: false,
}

// Dummy data (will be replaced by fetched data)
const dashboardStats = {
  totalSales: 125000,
  totalCustomers: 1250,
  siteVisits: 15420,
  totalBooks: 0, // Will be updated by fetched products
  totalBlogPosts: 0, // Will be updated by fetched blog posts
  returnRequests: 8,
  pendingOrders: 23,
}

const salesData = [
  { month: "Jan", sales: 12000, orders: 45 },
  { month: "Feb", sales: 15000, orders: 52 },
  { month: "Mar", sales: 18000, orders: 68 },
  { month: "Apr", sales: 22000, orders: 78 },
  { month: "May", sales: 25000, orders: 89 },
  { month: "Jun", sales: 28000, orders: 95 },
]

const trafficData = [
  { name: "Direct", value: 45, color: "#8884d8" },
  { name: "Social Media", value: 30, color: "#82ca9d" },
  { name: "Search Engines", value: 25, color: "#ffc658" },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Jane Doe",
    book: "Colours of Me",
    amount: 1700,
    status: "completed",
    date: "2024-01-15",
    time: "14:30",
    paymentMethod: "M-Pesa",
    transactionId: "TXN-MP-001",
    customerEmail: "jane.doe@email.com",
    customerPhone: "+254 712 345 678",
    customerAddress: "123 Nairobi Street, Nairobi",
    reviews: 4.5,
    totalReviews: 12,
  }


]

const paymentMethods = [
  { name: "M-Pesa", percentage: 65, transactions: 812 },
  { name: "PayPal", percentage: 35, transactions: 438 },
]

const users = [
  {
    id: 1,
    name: "Cheryl Nyakio",
    email: "cheryl@enlightenedkidsafrica.com",
    role: "Super Admin",
    status: "active",
    lastLogin: "2024-01-15 14:30",
    permissions: ["all"],
  },
  {
    id: 2,
    name: "John Manager",
    email: "john@enlightenedkidsafrica.com",
    role: "Manager",
    status: "active",
    lastLogin: "2024-01-14 10:15",
    permissions: ["products", "orders", "customers"],
  },
  {
    id: 3,
    name: "Sarah Editor",
    email: "sarah@enlightenedkidsafrica.com",
    role: "Editor",
    status: "active",
    lastLogin: "2024-01-13 16:45",
    permissions: ["blog", "products"],
  },
  {
    id: 4,
    name: "Mike Support",
    email: "mike@enlightenedkidsafrica.com",
    role: "Support",
    status: "inactive",
    lastLogin: "2024-01-10 09:20",
    permissions: ["orders", "customers"],
  },
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
  const [deleteItem, setDeleteItem] = useState<{ type: string; id: string; name: string; imageUrl?: string } | null>(
    null,
  )
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [viewingOrder, setViewingOrder] = useState<any>(null)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingRole, setEditingRole] = useState<any>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [errorProducts, setErrorProducts] = useState<string | null>(null)

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loadingBlogPosts, setLoadingBlogPosts] = useState(true)
  const [errorBlogPosts, setErrorBlogPosts] = useState<string | null>(null)

  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    setErrorProducts(null)
    try {
      const fetchedProducts = await getProducts()
      setProducts(fetchedProducts)
      dashboardStats.totalBooks = fetchedProducts.length // Update dashboard stat
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
      dashboardStats.totalBlogPosts = fetchedBlogPosts.length // Update dashboard stat
    } catch (error: any) {
      setErrorBlogPosts(error.message || "Failed to fetch blog posts")
      console.error("Failed to fetch blog posts:", error)
    } finally {
      setLoadingBlogPosts(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchBlogPosts()
  }, [fetchProducts, fetchBlogPosts])

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

  const handleViewOrder = (order: any) => {
    setViewingOrder(order)
    setIsViewOrderOpen(true)
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
    const imageFile = (event.currentTarget.image as HTMLInputElement).files?.[0]
    if (imageFile) {
      const imageUrl = await uploadBlogImage(imageFile)
      formData.append("imageUrl", imageUrl)
    }
    formData.delete("image") // remove the binary
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
    const imageFile = (event.currentTarget.image as HTMLInputElement).files?.[0]
    if (imageFile) {
      const imageUrl = await uploadBlogImage(imageFile)
      formData.append("imageUrl", imageUrl)
    }
    formData.delete("image") // remove the binary
    if (!formData.get("image") || (formData.get("image") as File).size === 0) {
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

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: BookOpen },
    { id: "orders", label: "Orders", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "blog", label: "Blog", icon: Edit },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "users", label: "User Management", icon: UserPlus },
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
                      <span className="text-white text-sm font-semibold">CN</span>
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">Cheryl Nyakio</span>
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
                  <DropdownMenuItem className="text-red-600">
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
                          {formatPrice(dashboardStats.totalSales)}
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
                          {dashboardStats.totalCustomers.toLocaleString()}
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
                          {dashboardStats.siteVisits.toLocaleString()}
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
                        <p className="text-sm sm:text-lg font-bold text-orange-600">{dashboardStats.totalBooks}</p>
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
                        <p className="text-sm sm:text-lg font-bold text-red-600">{dashboardStats.returnRequests}</p>
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
                        <p className="text-sm sm:text-lg font-bold text-yellow-600">{dashboardStats.pendingOrders}</p>
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
                      {products
                        .sort((a, b) => b.sales - a.sales)
                        .slice(0, 4)
                        .map((book, index) => (
                          <div key={book.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-green-600">#{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{book.title}</p>
                                <p className="text-xs text-gray-500">{book.sales} copies sold</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-xs sm:text-sm">{formatPrice(book.revenue)}</p>
                            </div>
                          </div>
                        ))}
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[100px]">Order ID</TableHead>
                          <TableHead className="min-w-[120px]">Customer</TableHead>
                          <TableHead className="min-w-[150px]">Book</TableHead>
                          <TableHead className="min-w-[100px]">Amount</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="min-w-[100px]">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.book}</TableCell>
                            <TableCell>{formatPrice(order.amount)}</TableCell>
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
                            <TableCell>{order.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                    <form action={handleAddProductSubmit} className="space-y-4">
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
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
                      <p className="text-xl sm:text-2xl font-bold text-green-600">85%</p>
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
                        <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                      <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Customer</TableHead>
                          <TableHead className="min-w-[200px]">Email</TableHead>
                          <TableHead className="min-w-[80px]">Orders</TableHead>
                          <TableHead className="min-w-[120px]">Total Spent</TableHead>
                          <TableHead className="min-w-[100px]">Last Order</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-blue-600">JD</span>
                              </div>
                              <span className="font-medium">Jane Doe</span>
                            </div>
                          </TableCell>
                          <TableCell>jane@example.com</TableCell>
                          <TableCell>5</TableCell>
                          <TableCell>KES 8,500</TableCell>
                          <TableCell>2024-01-15</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-purple-600">JS</span>
                              </div>
                              <span className="font-medium">John Smith</span>
                            </div>
                          </TableCell>
                          <TableCell>john@example.com</TableCell>
                          <TableCell>3</TableCell>
                          <TableCell>KES 6,000</TableCell>
                          <TableCell>2024-01-10</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
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
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.book}</TableCell>
                            <TableCell>{formatPrice(order.amount)}</TableCell>
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
                            <TableCell>{order.date}</TableCell>
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
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-sm font-semibold">
                                        {user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium">{user.name}</p>
                                      <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-blue-100 text-blue-800">{user.role}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      user.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {user.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{user.lastLogin}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit("user", user)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete("user", user.id.toString(), user.name)}
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
                  <Input id="editTitle" name="title" defaultValue={editingProduct.title} required />
                </div>
                <div>
                  <Label htmlFor="editAuthor">Author</Label>
                  <Input id="editAuthor" name="author" defaultValue={editingProduct.author} required />
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
                {editingBlog.image_url && (
                  <div className="mb-2">
                    <Image
                      src={editingBlog.image_url || "/placeholder.svg"}
                      alt="Current Blog Image"
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                    <p className="text-xs text-gray-500 mt-1">Current image</p>
                  </div>
                )}
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

      {/* Edit User Modal */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editUserName">Full Name</Label>
                <Input id="editUserName" defaultValue={editingUser?.name || ""} />
              </div>
              <div>
                <Label htmlFor="editUserEmail">Email Address</Label>
                <Input id="editUserEmail" type="email" defaultValue={editingUser?.email || ""} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editUserRole">Role</Label>
                <Select defaultValue={editingUser?.role?.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="editUserStatus">Status</Label>
                <Select defaultValue={editingUser?.status}>
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
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${permission.id}`}
                      className="rounded border-gray-300"
                      defaultChecked={editingUser?.permissions?.includes(permission.id)}
                    />
                    <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Updating user...")
                  setIsEditUserOpen(false)
                  setEditingUser(null)
                }}
              >
                Update User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editRoleName">Role Name</Label>
              <Input id="editRoleName" defaultValue={editingRole?.name || ""} />
            </div>
            <div>
              <Label htmlFor="editRoleDescription">Description</Label>
              <Textarea id="editRoleDescription" defaultValue={editingRole?.description || ""} rows={3} />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-role-${permission.id}`}
                      className="rounded border-gray-300"
                      defaultChecked={editingRole?.permissions?.includes(permission.id)}
                    />
                    <Label htmlFor={`edit-role-${permission.id}`} className="text-sm">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Updating role...")
                  setIsEditRoleOpen(false)
                  setEditingRole(null)
                }}
              >
                Update Role
              </Button>
            </div>
          </div>
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
                  <p className="text-sm text-gray-500">Transaction ID: {viewingOrder.transactionId}</p>
                </div>
                <Badge
                  className={
                    viewingOrder.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : viewingOrder.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }
                >
                  {viewingOrder.status.toUpperCase()}
                </Badge>
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
                      <span className="font-medium">{viewingOrder.customer}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{viewingOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{viewingOrder.customerPhone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">{viewingOrder.customerAddress}</span>
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
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {viewingOrder.date} at {viewingOrder.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{viewingOrder.paymentMethod}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{formatPrice(viewingOrder.amount)}</span>
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Image
                      src="/placeholder.svg?height=100&width=80"
                      alt={viewingOrder.book}
                      width={80}
                      height={100}
                      className="rounded-lg mx-auto sm:mx-0"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-semibold text-lg">{viewingOrder.book}</h4>
                      <p className="text-sm text-gray-600">by Cheryl Nyakio</p>
                      <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(viewingOrder.reviews) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {viewingOrder.reviews} ({viewingOrder.totalReviews} reviews)
                        </span>
                      </div>
                      <p className="text-lg font-bold text-green-600 mt-2">{formatPrice(viewingOrder.amount)}</p>
                    </div>
                  </div>
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
                          {viewingOrder.date} at {viewingOrder.time}
                        </p>
                      </div>
                    </div>
                    {viewingOrder.status !== "pending" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Payment Confirmed</p>
                          <p className="text-sm text-gray-500">Payment via {viewingOrder.paymentMethod}</p>
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
                <Button>Update Status</Button>
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
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteItem?.type} "{deleteItem?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAction} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

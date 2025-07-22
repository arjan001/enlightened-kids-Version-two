"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from "./actions"
import Image from "next/image"
import { Trash2, Edit, PlusCircle } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  author: string
  content: string
  image_url: string | null
  is_published: boolean
  created_at: string
}

export default function BlogManagementPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = () => {
    startTransition(async () => {
      try {
        const data = await getBlogPosts()
        setBlogPosts(data)
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to fetch blog posts: ${(error as Error).message}`,
          variant: "destructive",
        })
      }
    })
  }

  const handleAddBlogPostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      try {
        const result = await addBlogPost(formData)
        if (result.success) {
          toast({
            title: "Success",
            description: "Blog post added successfully!",
          })
          setIsDialogOpen(false)
          fetchBlogPosts()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to add blog post.", // Use result.message
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to add blog post: ${(error as Error).message}`,
          variant: "destructive",
        })
      }
    })
  }

  const handleUpdateBlogPostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentPost) return

    const formData = new FormData(event.currentTarget)
    formData.append("currentImageUrl", currentPost.image_url || "") // Pass current image URL for deletion logic

    startTransition(async () => {
      try {
        const result = await updateBlogPost(currentPost.id, formData)
        if (result.success) {
          toast({
            title: "Success",
            description: "Blog post updated successfully!",
          })
          setIsDialogOpen(false)
          fetchBlogPosts()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update blog post.", // Use result.message
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to update blog post: ${(error as Error).message}`,
          variant: "destructive",
        })
      }
    })
  }

  const handleDeleteBlogPost = async (id: string, imageUrl?: string | null) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return

    startTransition(async () => {
      try {
        const result = await deleteBlogPost(id, imageUrl || undefined)
        if (result.success) {
          toast({
            title: "Success",
            description: "Blog post deleted successfully!",
          })
          fetchBlogPosts()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to delete blog post.", // Use result.message
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to delete blog post: ${(error as Error).message}`,
          variant: "destructive",
        })
      }
    })
  }

  const openEditDialog = (post: BlogPost) => {
    setCurrentPost(post)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setCurrentPost(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Blog Posts</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
              aria-describedby="blog-dialog-description"
            >
              <DialogHeader>
                <DialogTitle>{currentPost ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
                <DialogDescription id="blog-dialog-description">
                  {currentPost ? "Edit the details of the blog post." : "Fill in the details for a new blog post."}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={currentPost ? handleUpdateBlogPostSubmit : handleAddBlogPostSubmit}
                className="grid gap-4 py-4"
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={currentPost?.title || ""}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    defaultValue={currentPost?.author || ""}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={currentPost?.content || ""}
                    className="col-span-3 min-h-[150px]"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={currentPost?.category || ""}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="readTime" className="text-right">
                    Read Time (minutes)
                  </Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    type="number"
                    defaultValue={currentPost?.read_time || 0}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Input id="image" name="image" type="file" className="col-span-3" accept="image/*" />
                </div>
                {currentPost?.image_url && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Current Image</Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Image
                        src={currentPost.image_url || "/placeholder.svg"}
                        alt="Current Post Image"
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="removeImage" name="removeImage" />
                        <Label htmlFor="removeImage">Remove Image</Label>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_published" className="text-right">
                    Published
                  </Label>
                  <Checkbox
                    id="is_published"
                    name="is_published"
                    defaultChecked={currentPost?.is_published || false}
                    className="col-span-3"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending
                    ? currentPost
                      ? "Updating..."
                      : "Creating..."
                    : currentPost
                      ? "Save Changes"
                      : "Add Post"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.is_published ? "Yes" : "No"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBlogPost(post.id, post.image_url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

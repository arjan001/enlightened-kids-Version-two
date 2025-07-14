"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { addBlogPost, updateBlogPost, deleteBlogPost, getBlogPosts } from "@/app/admin/blog/actions"
import Image from "next/image"
import { toast } from "sonner"
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch" // Import Switch for is_published

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  tags: string[] | null // Updated type for tags
  image_url?: string
  category: string
  published_at: string
  read_time: string
  is_published: boolean // Updated type for is_published
}

const initialState = {
  message: "",
  success: false,
}

export default function AdminBlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null)

  const [addState, addFormAction] = useActionState(addBlogPost, initialState)
  const [editState, editFormAction] = useActionState(updateBlogPost, initialState)

  useEffect(() => {
    fetchBlogPosts()
  }, [addState, editState]) // Re-fetch when add/edit actions complete

  useEffect(() => {
    if (addState.success) {
      toast.success(addState.message)
      setIsAddDialogOpen(false)
    } else if (addState.message) {
      toast.error(addState.message)
    }
  }, [addState])

  useEffect(() => {
    if (editState.success) {
      toast.success(editState.message)
      setIsEditDialogOpen(false)
    } else if (editState.message) {
      toast.error(editState.message)
    }
  }, [editState])

  const fetchBlogPosts = async () => {
    try {
      const data = await getBlogPosts() // Fetch all posts for admin
      setBlogPosts(data as BlogPost[])
    } catch (error: any) {
      toast.error(`Error fetching blog posts: ${error.message}`)
    }
  }

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const result = await deleteBlogPost(id, imageUrl)
        if (result.success) {
          toast.success(result.message)
          fetchBlogPosts() // Re-fetch after deletion
        } else {
          toast.error(result.message)
        }
      } catch (error: any) {
        toast.error(`Failed to delete blog post: ${error.message}`)
      }
    }
  }

  const openEditDialog = (post: BlogPost) => {
    setCurrentPost(post)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Post Management</h1>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <PlusIcon className="mr-2 h-4 w-4" /> Add New Post
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Blog Post</DialogTitle>
            <DialogDescription>Fill in the details for the new blog post.</DialogDescription>
          </DialogHeader>
          <form action={addFormAction} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Author
              </Label>
              <Input id="author" name="author" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="excerpt" className="text-right">
                Excerpt
              </Label>
              <Textarea id="excerpt" name="excerpt" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea id="content" name="content" required className="col-span-3 min-h-[150px]" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input id="category" name="category" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="readTime" className="text-right">
                Read Time
              </Label>
              <Input id="readTime" name="readTime" placeholder="e.g., 5 min read" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                placeholder="e.g., parenting, education (comma separated)"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="publishedAt" className="text-right">
                Published At
              </Label>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="datetime-local"
                className="col-span-3"
                defaultValue={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              {/* Simplified input styling to match native look */}
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="col-span-3 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPublished" className="text-right">
                Publish
              </Label>
              <Switch id="isPublished" name="isPublished" className="col-span-3" />
            </div>
            <DialogFooter>
              <Button type="submit">Add Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>Make changes to the blog post here.</DialogDescription>
          </DialogHeader>
          {currentPost && (
            <form action={editFormAction.bind(null, currentPost.id)} className="grid gap-4 py-4">
              <input type="hidden" name="currentImageUrl" value={currentPost.image_url || ""} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input id="edit-title" name="title" defaultValue={currentPost.title} required className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-author" className="text-right">
                  Author
                </Label>
                <Input
                  id="edit-author"
                  name="author"
                  defaultValue={currentPost.author}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-excerpt" className="text-right">
                  Excerpt
                </Label>
                <Textarea id="edit-excerpt" name="excerpt" defaultValue={currentPost.excerpt} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  defaultValue={currentPost.content}
                  required
                  className="col-span-3 min-h-[150px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Input id="edit-category" name="category" defaultValue={currentPost.category} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-readTime" className="text-right">
                  Read Time
                </Label>
                <Input
                  id="edit-readTime"
                  name="readTime"
                  defaultValue={currentPost.read_time}
                  placeholder="e.g., 5 min read"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="edit-tags"
                  name="tags"
                  defaultValue={currentPost.tags?.join(", ") || ""}
                  placeholder="e.g., parenting, education (comma separated)"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-publishedAt" className="text-right">
                  Published At
                </Label>
                <Input
                  id="edit-publishedAt"
                  name="publishedAt"
                  type="datetime-local"
                  className="col-span-3"
                  defaultValue={
                    currentPost.published_at
                      ? new Date(currentPost.published_at).toISOString().slice(0, 16)
                      : new Date().toISOString().slice(0, 16)
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  {currentPost.image_url && (
                    <div className="mb-2">
                      <Image
                        src={currentPost.image_url || "/placeholder.svg"}
                        alt="Current Image"
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  {/* Simplified input styling to match native look */}
                  <input
                    id="edit-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isPublished" className="text-right">
                  Publish
                </Label>
                <Switch
                  id="edit-isPublished"
                  name="isPublished"
                  defaultChecked={currentPost.is_published}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published At</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No blog posts found.
                </TableCell>
              </TableRow>
            ) : (
              blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    {post.image_url ? (
                      <Image
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-[60px] h-[60px] bg-gray-200 flex items-center justify-center rounded text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{new Date(post.published_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={post.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {post.is_published ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(post)}>
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id, post.image_url)}>
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

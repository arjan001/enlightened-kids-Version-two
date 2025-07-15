"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useState, useEffect, useTransition } from "react"
import { getBlogPosts } from "../admin/blog/actions"
import { useToast } from "@/components/ui/use-toast"

interface BlogPost {
  id: string
  title: string
  author: string
  content: string
  image_url: string | null
  is_published: boolean
  created_at: string
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, startTransition] = useTransition()
  const { toast } = useToast()

  useEffect(() => {
    fetchPublishedBlogPosts()
  }, [])

  const fetchPublishedBlogPosts = () => {
    startTransition(async () => {
      try {
        const data = await getBlogPosts()
        // Filter for published posts only
        setBlogPosts(data.filter((post) => post.is_published))
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to fetch blog posts: ${(error as Error).message}`,
          variant: "destructive",
        })
      }
    })
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />

      {/* Hero Section */}
      <section className="bg-green-800 py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Insights, stories, and tips for nurturing enlightened minds and celebrating African heritage.
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center">Loading blog posts...</div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center text-gray-600">No published blog posts found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col">
                  {post.image_url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                        unoptimized={post.image_url.includes("blob.v0.dev")} // Skip optimization for blob URLs in preview
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      By {post.author} on {formatDate(post.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                    <Link href={`/blog/${post.id}`} passHref>
                      <Button variant="link" className="p-0 h-auto text-orange-500 hover:text-orange-600">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action / Newsletter */}
      <section className="py-12 bg-green-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-green-200 mb-6">
            Join our community for parenting insights and empowering stories that help children grow with confidence and
            cultural pride.
          </p>
          <div className="flex gap-4 justify-center max-w-md mx-auto">
            <input type="text" placeholder="First Name" className="px-4 py-2 rounded-full flex-1" />
            <input type="email" placeholder="Email Address" className="px-4 py-2 rounded-full flex-1" />
            <Button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full">SUBSCRIBE</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

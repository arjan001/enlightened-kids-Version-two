import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { getBlogPosts } from "../admin/blog/actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default async function BlogPage() {
  const supabase = createClient()
  const blogPosts = await getBlogPosts(true) // Fetch only published posts

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Blog</h1>
      {blogPosts.length === 0 ? (
        <p className="text-center text-gray-600">No blog posts published yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/blog/${post.id}`}>
                <div className="relative w-full h-48">
                  <Image
                    src={post.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {post.category && (
                      <Badge variant="secondary" className="text-xs font-medium">
                        {post.category}
                      </Badge>
                    )}
                    {post.read_time && <span className="text-xs text-gray-500">{post.read_time} read</span>}
                  </div>
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">By {post.author}</span>
                    <span>•</span>
                    <span className="ml-2">{new Date(post.published_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

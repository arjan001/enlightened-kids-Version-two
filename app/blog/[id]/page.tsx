import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getBlogPostById, getBlogPosts } from "../../admin/blog/actions"
import { Separator } from "@/components/ui/separator"

interface BlogPost {
  id: string
  title: string
  author: string
  content: string
  image_url: string | null
  is_published: boolean
  created_at: string
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export default async function SingleBlogPostPage({ params }: { params: { id: string } }) {
  const postId = params.id
  const post = await getBlogPostById(postId)

  if (!post || !post.is_published) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white pt-16">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
          <p className="text-lg text-gray-600">The blog post you are looking for does not exist or is not published.</p>
          <Link href="/blog" passHref>
            <Button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white">Back to Blog</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  // Fetch other published blog posts for "You may also read" section
  const allBlogPosts = await getBlogPosts()
  const relatedPosts = allBlogPosts
    .filter((p) => p.is_published && p.id !== postId) // Filter published and exclude current post
    .sort(() => 0.5 - Math.random()) // Shuffle to get random related posts
    .slice(0, 3) // Get up to 3 related posts

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white pt-16">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        {/* Blog Post Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600">
            By <span className="font-semibold">{post.author}</span> on {formatDate(post.created_at)}
          </p>
        </section>

        {/* Blog Post Image */}
        {post.image_url && (
          <div className="relative w-full h-80 md:h-[450px] rounded-lg overflow-hidden mb-12 shadow-lg">
            <Image
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="object-center"
              unoptimized={post.image_url.includes("blob.v0.dev")} // Skip optimization for blob URLs in preview
            />
          </div>
        )}

        {/* Blog Post Content */}
        <article className="prose prose-lg mx-auto text-gray-800 leading-relaxed">
          <p>{post.content}</p>
          {/* You can add more complex content rendering here if your content supports rich text */}
        </article>

        <Separator className="my-16 bg-gray-300" />

        {/* You May Also Read Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">You May Also Read</h2>
          {relatedPosts.length === 0 ? (
            <p className="text-center text-gray-600">No other published blog posts available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden flex flex-col">
                  {relatedPost.image_url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedPost.image_url || "/placeholder.svg"}
                        alt={relatedPost.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                        unoptimized={relatedPost.image_url.includes("blob.v0.dev")} // Skip optimization for blob URLs in preview
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{relatedPost.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      By {relatedPost.author} on {formatDate(relatedPost.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-700 mb-4 line-clamp-3">{relatedPost.content}</p>
                    <Link href={`/blog/${relatedPost.id}`} passHref>
                      <Button variant="link" className="p-0 h-auto text-orange-500 hover:text-orange-600">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

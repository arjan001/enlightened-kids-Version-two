import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BookletPage() {
  return (
    <main className="flex flex-col items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-4xl">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="relative w-full md:w-1/2 aspect-[3/4] rounded-lg overflow-hidden">
            <Image
              src="/images/booklet.png"
              alt="Discussion & Activity Guide"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-4 w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-center md:text-left">Discussion & Activity Guide</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center md:text-left">
              Enhance your reading experience with our comprehensive Discussion & Activity Guide. This guide is designed
              to deepen understanding and facilitate meaningful conversations around the themes in "Colours of Me."
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Thought-provoking questions for each story</li>
              <li>Engaging activities for children and parents/educators</li>
              <li>Key lessons highlighted for deeper understanding</li>
              <li>Designed to be accessible and easy to use</li>
            </ul>
            <div className="flex justify-center md:justify-start">
              <Link href="/ebook/discussion-activity-guide.pdf" passHref legacyBehavior>
                <Button asChild size="lg" className="w-full md:w-auto">
                  <a download>Download Instantly</a>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

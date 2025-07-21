import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { LinkIcon, PhoneIcon as Whatsapp } from "lucide-react" // Renamed Link to LinkIcon to avoid conflict with next/link

export default function BookletPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content Section */}
      <main
        className="flex-grow py-12 md:py-20 flex justify-center"
        style={{
          backgroundImage: `url('/Enlightened Kids Pattern BG.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      >
        <Card className="w-full max-w-2xl mx-auto p-8 mt-8 md:p-12 bg-white shadow-lg rounded-lg text-center">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-0">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">Access Your Booklet</h1>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Every purchase of Colours of Me comes with a free Discussion & Activity e-Booklet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 text-lg rounded-lg shadow-md flex-1 sm:flex-none"
              >
                <Link href="/ebook/discussion-activity-guide.pdf" download="Discussion & Activity Guide.pdf">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Download Instantly
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 py-3 px-6 text-lg rounded-lg shadow-md flex-1 sm:flex-none"
              >
                <Link href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
                  <Whatsapp className="w-5 h-5 mr-2" />
                  Request Via Whatsapp
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center p-8 shadow-lg rounded-lg">
        <CardContent className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
          <p className="mt-2 text-2xl font-semibold text-gray-700">Page Not Found</p>
          <p className="mt-2 text-gray-500 text-center max-w-sm">
            {
              "Oops! The page you're looking for doesn't exist or has been moved. Please check the URL or go back to the homepage."
            }
          </p>
          <Link href="/" passHref>
            <Button className="mt-6 px-8 py-3 text-lg font-medium rounded-md bg-[#4CAF50] hover:bg-[#45a049] text-white transition-colors duration-200">
              Go to Homepage
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

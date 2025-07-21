"use client"

import type React from "react"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { uploadBooklet, getBooklet } from "@/app/admin/booklet/actions"
import { FileText, Upload, Download, Loader2 } from "lucide-react"
import Link from "next/link"

interface Booklet {
  id: string
  name: string
  url: string
  created_at: string
  updated_at: string
}

export default function BookletUpload() {
  const [currentBooklet, setCurrentBooklet] = useState<Booklet | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const [loadingBooklet, setLoadingBooklet] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCurrentBooklet = async () => {
      setLoadingBooklet(true)
      const booklet = await getBooklet()
      setCurrentBooklet(booklet)
      setLoadingBooklet(false)
    }
    fetchCurrentBooklet()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("bookletFile", file)
    if (currentBooklet) {
      formData.append("currentBookletId", currentBooklet.id)
      formData.append("currentBookletUrl", currentBooklet.url)
    }

    startTransition(async () => {
      const result = await uploadBooklet(formData)
      if (result.success) {
        toast({ title: "Success", description: result.message })
        setFile(null)
        const updated = await getBooklet()
        setCurrentBooklet(updated)
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Booklet Upload</h2>

      <Card>
        <CardHeader>
          <CardTitle>Current Booklet</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingBooklet ? (
            <p className="text-gray-500">Loading current booklet...</p>
          ) : currentBooklet ? (
            <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium">{currentBooklet.name}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(currentBooklet.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href={currentBooklet.url} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Link>
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">No booklet has been uploaded yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Booklet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bookletFile">Select PDF or TXT File</Label>
              <Input
                id="bookletFile"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
              {file && <p className="text-sm text-gray-500 mt-1">Selected: {file.name}</p>}
            </div>
            <Button type="submit" disabled={isPending || !file}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {currentBooklet ? "Replace Booklet" : "Upload Booklet"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

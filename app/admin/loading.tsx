import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Skeleton className="h-12 w-full" /> {/* Table Header */}
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

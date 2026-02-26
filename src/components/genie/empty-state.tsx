"use client"

import { Search, Star, Sparkles } from "lucide-react"

type EmptyStateType = "favorites" | "popular" | "my-dashboards" | "all"

interface EmptyStateProps {
  type: EmptyStateType
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === "favorites") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4">
          <Star className="h-16 w-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-xl font-medium mb-2">Quickly return to your Favorites</h3>
        <p className="text-muted-foreground max-w-md">
          Mark useful or frequently used assets as Favorites to quickly access them again.
        </p>
      </div>
    )
  }

  if (type === "popular") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4">
          <Sparkles className="h-16 w-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-xl font-medium mb-2">See what&apos;s popular with your colleagues</h3>
        <p className="text-muted-foreground max-w-md">Explore the most popular content in your workspace.</p>
      </div>
    )
  }

  if (type === "my-dashboards") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4">
          <Search className="h-16 w-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-xl font-medium mb-2">No dashboards found</h3>
        <p className="text-muted-foreground max-w-md">Create your first dashboard to get started.</p>
      </div>
    )
  }

  // Default "all" tab empty state
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4">
        <Search className="h-16 w-16 text-gray-300 mx-auto" />
      </div>
      <h3 className="text-xl font-medium mb-2">No dashboards found</h3>
      <p className="text-muted-foreground max-w-md">Create a new dashboard or view the samples gallery.</p>
    </div>
  )
}

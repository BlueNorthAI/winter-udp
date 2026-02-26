"use client"

import { LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  type: "create" | "favorites"
  onCreateClick: () => void
  onViewSamplesClick: () => void
}

export function EmptyState({ type, onCreateClick, onViewSamplesClick }: EmptyStateProps) {
  if (type === "favorites") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-md">
        <div className="mb-4">
          <LayoutDashboard className="h-16 w-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-lg font-medium mb-1">No favorites yet</h3>
        <p className="text-muted-foreground">Mark dashboards as favorites to list them here.</p>
        <p className="text-muted-foreground">Explore sample dashboards containing rich visualizations and queries.</p>
        <div className="mt-4">
          <Button variant="outline" onClick={onViewSamplesClick}>
            View samples gallery
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border rounded-md">
      <div className="mb-4">
        <LayoutDashboard className="h-16 w-16 text-gray-300 mx-auto" />
      </div>
      <h3 className="text-lg font-medium mb-1">Create your first dashboard</h3>
      <p className="text-muted-foreground">Use the SQL editor to create dashboards to visualize your data.</p>
      <p className="text-muted-foreground">View your saved dashboards here.</p>
      <p className="text-muted-foreground">Explore sample dashboards containing rich visualizations and queries.</p>
      <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={onViewSamplesClick}>
          View samples gallery
        </Button>
        <Button onClick={onCreateClick}>Create dashboard</Button>
      </div>
    </div>
  )
}

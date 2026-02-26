"use client"

import { Bell } from "lucide-react"

interface EmptyStateProps {
  type: string
}

export function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-4">
        <Bell className="h-12 w-12 text-gray-300 mx-auto" />
      </div>
      <h3 className="text-lg font-medium mb-1">{type === "my-alerts" ? "No alerts found" : "No alerts found"}</h3>
      <p className="text-muted-foreground max-w-md">
        {type === "my-alerts"
          ? "Create an alert to monitor your data and get notified when conditions are met."
          : "No alerts have been created in this workspace yet."}
      </p>
    </div>
  )
}

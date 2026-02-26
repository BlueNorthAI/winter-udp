"use client"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onCreateFromSample: () => void
  onCreateFromCode: () => void
}

export function EmptyState({ onCreateFromSample, onCreateFromCode }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6">
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="h-2 w-32 bg-gray-200 rounded-full mb-1"></div>
          <div className="h-2 w-28 bg-gray-200 rounded-full mb-1"></div>
          <div className="h-2 w-36 bg-gray-200 rounded-full mb-1"></div>
          <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <h3 className="text-xl font-medium mb-1">No pipelines here</h3>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onCreateFromSample}>
          Create pipeline from sample data
        </Button>
        <span className="text-muted-foreground">or</span>
        <Button variant="outline" onClick={onCreateFromCode}>
          Create pipeline from existing source code
        </Button>
      </div>
    </div>
  )
}

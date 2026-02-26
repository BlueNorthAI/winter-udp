"use client"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border rounded-md">
      <div className="mb-6">
        <div className="text-gray-300 mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 4V20M4 12H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-muted-foreground">
          No models registered yet.{" "}
          <a href="#" className="text-blue-600">
            Learn more about registering models.
          </a>
        </p>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700">Create a model</Button>
    </div>
  )
}

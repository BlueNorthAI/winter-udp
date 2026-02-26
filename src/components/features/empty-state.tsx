"use client"

import { ExternalLink } from "lucide-react"

export function EmptyState() {
  return (
    <div className="border rounded-md">
      <div className="p-4 border-b">
        <div className="grid grid-cols-6 gap-4">
          <div className="font-medium">Table name</div>
          <div className="font-medium">Owner</div>
          <div className="font-medium">Online stores</div>
          <div className="font-medium">Last written</div>
          <div className="font-medium">Tags</div>
          <div className="font-medium">Comment</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6">
          <div className="text-gray-300 mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-muted-foreground max-w-lg">
            No table can be used as a feature table. Add a primary key to a table to use it as a feature table.{" "}
            <a href="#" className="text-blue-600 inline-flex items-center">
              Learn more <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>{" "}
            about feature tables and Feature Engineering in Unity Catalog.
          </p>
        </div>
      </div>
    </div>
  )
}

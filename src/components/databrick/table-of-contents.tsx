"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export function TableOfContents() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  if (isCollapsed) {
    return (
      <div className="border-r bg-gray-50 flex items-center justify-center w-10">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="h-10 w-10">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`${isMobile ? "w-full" : "w-72"} border-r flex flex-col`}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span className="font-medium">Table of contents</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 text-sm text-gray-600">
        A table of contents will be added here when a notebook has Markdown headings.
      </div>

      <div className="p-4 border-t">
        <div className="text-sm font-mono text-gray-600">%md # Heading 1</div>
      </div>
    </div>
  )
}

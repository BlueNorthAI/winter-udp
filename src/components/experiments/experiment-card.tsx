"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ExperimentCardProps {
  title: string
  description: string
  buttonText: string
  isPreview?: boolean
  className?: string
}

export function ExperimentCard({ title, description, buttonText, isPreview, className }: ExperimentCardProps) {
  return (
    <div className={cn("border rounded-md p-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-medium">{title}</h3>
        {isPreview && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Preview</span>}
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button variant="outline" size="sm">
        {buttonText}
      </Button>
    </div>
  )
}

"use client"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExampleCardProps {
  title: string
  description: string
  onTry: () => void
}

export function ExampleCard({ title, description, onTry }: ExampleCardProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="text-blue-600 mt-1">
        <FileText className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-blue-600">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={onTry}>
        Try
      </Button>
    </div>
  )
}

import type React from "react"
import { cn } from "@/lib/utils"

interface DataSourceCardProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  className?: string
}

export function DataSourceCard({ icon, iconBg, title, description, className }: DataSourceCardProps) {
  return (
    <div
      className={cn("flex flex-col p-6 border rounded-md hover:shadow-md transition-shadow cursor-pointer", className)}
    >
      <div className="flex items-start gap-4">
        <div className={`${iconBg} h-8 w-8 rounded flex items-center justify-center shrink-0`}>{icon}</div>
        <div>
          <h3 className="font-medium text-blue-600 mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

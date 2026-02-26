import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ConnectorCardProps {
  name: string
  icon: string
  iconFallback: React.ReactNode
  className?: string
}

export function ConnectorCard({ name, icon, iconFallback, className }: ConnectorCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 border rounded-md hover:shadow-md transition-shadow cursor-pointer",
        className,
      )}
    >
      <div className="mb-4">
        {icon ? (
          <div className="relative h-12 w-12">
            <Image
              src={icon || "/placeholder.svg"}
              alt={name}
              fill
              className="object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none"
                const fallbackEl = e.currentTarget.parentElement?.querySelector(".icon-fallback")
                if (fallbackEl) {
                  fallbackEl.classList.remove("hidden")
                }
              }}
            />
            <div className="icon-fallback hidden">{iconFallback}</div>
          </div>
        ) : (
          iconFallback
        )}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}

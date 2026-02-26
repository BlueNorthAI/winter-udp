"use client"

import type React from "react"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModelCardProps {
  name: string
  type: string
  icon: "databricks" | "openai"
  className?: string
}

export function ModelCard({ name, type, icon, className }: ModelCardProps) {
  return (
    <div className={cn("border rounded-md p-4", className)}>
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          {icon === "databricks" ? (
            <div className="h-8 w-8 bg-red-100 rounded-md flex items-center justify-center">
              <div className="h-4 w-4 bg-red-500 rounded-sm"></div>
            </div>
          ) : (
            <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-600"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
                <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {name === "OpenAI GPT-4o" ? (
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Configure</Button>
        ) : (
          <>
            <div className="relative">
              <Button variant="outline" className="pr-8">
                Use
              </Button>
              <Button variant="outline" size="icon" className="absolute right-0 top-0 h-full border-l rounded-l-none">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Button variant="outline" className="pr-8">
                Copy
              </Button>
              <Button variant="outline" size="icon" className="absolute right-0 top-0 h-full border-l rounded-l-none">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

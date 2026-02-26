"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface RecentsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function RecentsHeader({ searchQuery, onSearchChange }: RecentsHeaderProps) {
  return (
    <header className="border-b p-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search recents..."
            className="w-full pl-8 bg-muted/40"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  )
}

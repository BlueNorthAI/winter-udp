"use client"

import { useState } from "react"
import { Search, Sparkles, Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "./empty-state"

interface GenieSpace {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  isFavorite: boolean
  isPopular: boolean
}

export function Genie() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data - empty for now to match the screenshots
  const spaces: GenieSpace[] = []

  // Filter spaces based on search input and active tab
  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch =
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "favorites") {
      return matchesSearch && space.isFavorite
    } else if (activeTab === "popular") {
      return matchesSearch && space.isPopular
    }

    return matchesSearch
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Genie</h1>
          <p className="text-muted-foreground">Ask questions about your data in natural language</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter spaces"
            className="pl-9 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={activeTab === "all" ? "secondary" : "ghost"}
            className="rounded-none border-0 flex-1"
            onClick={() => setActiveTab("all")}
          >
            All
          </Button>
          <Button
            variant={activeTab === "favorites" ? "secondary" : "ghost"}
            className="rounded-none border-0 flex-1"
            onClick={() => setActiveTab("favorites")}
          >
            <Star className="h-4 w-4 mr-2" />
            Favorites
          </Button>
          <Button
            variant={activeTab === "popular" ? "secondary" : "ghost"}
            className="rounded-none border-0 flex-1"
            onClick={() => setActiveTab("popular")}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Popular
          </Button>
        </div>
      </div>

      {/* Empty states based on active tab */}
      {filteredSpaces.length === 0 && <EmptyState type={activeTab === "favorites" ? "favorites" : activeTab === "popular" ? "popular" : "all"} />}

      {/* If there are spaces, we would render them here */}
      {filteredSpaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpaces.map((space) => (
            <div key={space.id} className="border rounded-md p-4">
              <h3 className="font-medium">{space.name}</h3>
              <p className="text-sm text-muted-foreground">{space.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

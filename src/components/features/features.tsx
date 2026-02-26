"use client"

import { useState } from "react"
import { Search, X, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "./empty-state"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function Features() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("unity-catalog")
  const [selectedCatalog, setSelectedCatalog] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [ownedByMe, setOwnedByMe] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [showInfoBanner, setShowInfoBanner] = useState(true)

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Features</h1>
          <Button variant="ghost" size="sm" className="text-blue-600 flex items-center gap-1 h-7">
            <span className="text-sm">Send feedback</span>
          </Button>
        </div>
        <Button variant="outline">Permissions</Button>
      </div>

      {showInfoBanner && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between w-full">
            <div>
              <span>Any Delta table with a primary key can be used as a feature table. </span>
              <a href="#" className="text-blue-600 inline-flex items-center">
                Learn more <ExternalLink className="h-3 w-3 ml-0.5" />
              </a>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowInfoBanner(false)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Filter by feature table, feature or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="border rounded-md overflow-hidden">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="unity-catalog"
                className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 px-4 py-2 h-10"
              >
                Unity Catalog
              </TabsTrigger>
              <TabsTrigger
                value="hive-metastore"
                className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 px-4 py-2 h-10"
              >
                Hive Metastore
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={selectedCatalog} onValueChange={setSelectedCatalog}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Catalogs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Catalogs</SelectItem>
              <SelectItem value="main">main</SelectItem>
              <SelectItem value="system">system</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="production">production</SelectItem>
              <SelectItem value="development">development</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 border rounded-md px-3 py-2">
            <Checkbox
              id="owned-by-me"
              checked={ownedByMe}
              onCheckedChange={(checked) => setOwnedByMe(checked as boolean)}
            />
            <label htmlFor="owned-by-me" className="text-sm">
              Owned by me
            </label>
          </div>

          <div className="ml-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <span>Sort by: </span>
                  <SelectValue placeholder="Relevance" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="last-written">Last written</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <EmptyState />
      </div>
    </div>
  )
}

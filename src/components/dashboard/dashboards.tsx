"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardCard } from "./dashboard-card"
import { EmptyState } from "./empty-state"

interface Dashboard {
  id: string
  name: string
  thumbnail: string
  tags: string[]
  createdBy: string
  createdAt: string
  isFavorite: boolean
  isFeatured: boolean
  isLegacy: boolean
}

export function Dashboards() {
  const [activeTab, setActiveTab] = useState("dashboards")
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")

  const dashboards: Dashboard[] = [
    {
      id: "1",
      name: "NYC Taxi Trip Analysis",
      thumbnail: "/nyc-taxi-dashboard.png",
      tags: ["sample"],
      createdBy: "Shrikanth M",
      createdAt: "Apr 21, 2025, 2:07 PM",
      isFavorite: false,
      isFeatured: true,
      isLegacy: false,
    },
    {
      id: "2",
      name: "Retail Revenue & Supply Chain",
      thumbnail: "/retail-supply-chain-dashboard.png",
      tags: ["sample"],
      createdBy: "Shrikanth M",
      createdAt: "Apr 21, 2025, 2:07 PM",
      isFavorite: false,
      isFeatured: true,
      isLegacy: false,
    },
  ]

  // Filter dashboards based on search input, active tab, and selected tag
  const filteredDashboards = dashboards.filter((dashboard) => {
    const matchesSearch = dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "dashboards" ? !dashboard.isLegacy : dashboard.isLegacy
    const matchesTag = !selectedTag || selectedTag === "all" || dashboard.tags.includes(selectedTag)

    return matchesSearch && matchesTab && matchesTag
  })

  // Filter dashboards based on the active filter (all, favorites, popular, my dashboards)
  const filterDashboards = (dashboards: Dashboard[]) => {
    switch (activeFilter) {
      case "favorites":
        return dashboards.filter((d) => d.isFavorite)
      case "popular":
        return dashboards.filter((d) => d.isFeatured)
      case "my-dashboards":
        return dashboards.filter((d) => d.createdBy === "Shrikanth M")
      case "all":
      default:
        return dashboards
    }
  }

  const filteredAndSortedDashboards = filterDashboards(filteredDashboards)

  // Get all unique tags from dashboards
  const allTags = Array.from(new Set(dashboards.flatMap((dashboard) => dashboard.tags)))

  // Check if we should show featured dashboards
  const showFeatured = activeTab === "dashboards" && activeFilter === "all" && !searchQuery && selectedTag === "all"

  // Get featured dashboards
  const featuredDashboards = dashboards.filter((d) => d.isFeatured)

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboards</h1>
        <div className="flex gap-2">
          <Button variant="outline">View samples gallery</Button>
          <div className="relative">
            <Button className="bg-blue-600 hover:bg-blue-700">Create dashboard</Button>
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="border-b rounded-none w-full justify-start h-auto p-0 bg-transparent">
          <TabsTrigger
            value="dashboards"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
          >
            Dashboards
          </TabsTrigger>
          <TabsTrigger
            value="legacy-dashboards"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
          >
            Legacy dashboards
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {showFeatured && featuredDashboards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Featured</h2>
          <div className="grid grid-cols-2 gap-4">
            {featuredDashboards.map((dashboard) => (
              <DashboardCard key={dashboard.id} dashboard={dashboard} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter dashboards"
            className="pl-9 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <div className="flex">
              <Button
                variant={activeFilter === "my-dashboards" ? "secondary" : "outline"}
                className="rounded-l-md rounded-r-none"
                onClick={() => setActiveFilter("my-dashboards")}
              >
                My dashboards
              </Button>
              <Button
                variant={activeFilter === "favorites" ? "secondary" : "outline"}
                className="rounded-none border-x-0"
                onClick={() => setActiveFilter("favorites")}
              >
                Favorites
              </Button>
              <Button
                variant={activeFilter === "all" ? "secondary" : "outline"}
                className="rounded-none"
                onClick={() => setActiveFilter("all")}
              >
                All dashboards
              </Button>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[180px] rounded-l-none">
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Select defaultValue="last-modified">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Last modified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-modified">Last modified</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="created-at">Created at</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="owner">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="me">Me</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAndSortedDashboards.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Name</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Created by</TableHead>
                  <TableHead>Last modified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDashboards.map((dashboard) => (
                  <TableRow key={dashboard.id}>
                    <TableCell className="font-medium">
                      <span className="text-blue-600 hover:underline cursor-pointer">{dashboard.name}</span>
                    </TableCell>
                    <TableCell>{dashboard.tags.join(", ")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          S
                        </div>
                        <span>{dashboard.createdBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>{dashboard.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState type={activeFilter === "favorites" ? "favorites" : "create"} onCreateClick={function (): void {
              throw new Error("Function not implemented.")
            } } onViewSamplesClick={function (): void {
              throw new Error("Function not implemented.")
            } } />
        )}
      </div>
    </div>
  )
}

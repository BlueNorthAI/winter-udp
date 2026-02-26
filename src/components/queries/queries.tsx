"use client"

import { useState } from "react"
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Query {
  id: string
  name: string
  tags: string[]
  createdBy: string
  createdAt: string
  isFavorite: boolean
}

export function Queries() {
  const [activeTab, setActiveTab] = useState("my-queries")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Query>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedTag, setSelectedTag] = useState<string>("all")

  const queries: Query[] = [
    {
      id: "1",
      name: "04-Deltalakehouse-gold-layer-reporting-tables-setup",
      tags: [],
      createdBy: "Shrikanth M",
      createdAt: "Apr 15, 2025, 10:02 PM",
      isFavorite: false,
    },
    {
      id: "2",
      name: "03-Deltalakehouse-silver-layer-table",
      tags: [],
      createdBy: "Shrikanth M",
      createdAt: "Apr 15, 2025, 01:02 PM",
      isFavorite: false,
    },
    {
      id: "3",
      name: "02-Deltalakehouse-bronze-layer-tables-setup",
      tags: [],
      createdBy: "Shrikanth M",
      createdAt: "Apr 08, 2025, 08:53 PM",
      isFavorite: false,
    },
    {
      id: "4",
      name: "01-Deltalakehouse-pre-setup",
      tags: [],
      createdBy: "Shrikanth M",
      createdAt: "Apr 08, 2025, 07:49 PM",
      isFavorite: false,
    },
  ]

  const handleSort = (field: keyof Query) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter queries based on search input and selected tag
  const filteredQueries = queries.filter((query) => {
    const matchesSearch = query.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || selectedTag === "all" || query.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  // Get queries for the current tab
  const tabQueries = filteredQueries.filter((query) => {
    if (activeTab === "favorites") return query.isFavorite
    return true // For "my-queries" and "all-queries" tabs, show all filtered queries
  })

  // Sort queries based on sort field and direction
  const sortedQueries = [...tabQueries].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  // Get all unique tags from queries
  const allTags = Array.from(new Set(queries.flatMap((query) => query.tags)))

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Queries</h1>
        <div className="flex gap-2">
          <Button variant="outline">Open editor</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Create query</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter queries"
            className="pl-9 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="my-queries">My queries</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="all-queries">All queries</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[180px]">
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

        {activeTab === "favorites" && sortedQueries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-md">
            <div className="mb-4">
              <FileCode className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-1">No favorites yet</h3>
            <p className="text-muted-foreground">Mark queries as favorites to list them here</p>
          </div>
        ) : (
          <>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center font-semibold p-0"
                      >
                        Name
                        {sortField === "name" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("createdBy")}
                        className="flex items-center font-semibold p-0"
                      >
                        Created by
                        {sortField === "createdBy" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center font-semibold p-0"
                      >
                        Created at
                        {sortField === "createdAt" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedQueries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="font-medium">
                        <span className="text-blue-600 hover:underline cursor-pointer">{query.name}</span>
                      </TableCell>
                      <TableCell>{query.tags.join(", ")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            S
                          </div>
                          <span>{query.createdBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>{query.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-muted-foreground">1-{sortedQueries.length}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

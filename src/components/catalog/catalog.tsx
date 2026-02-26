"use client"

import type React from "react"

import { useState } from "react"
import { Settings, RefreshCw, Plus, ChevronRight, Search, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CatalogTable } from "./catalog-table"
import { CatalogTree } from "./catalog-tree"

export function Catalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("catalogs")
  const [filterQuery, setFilterQuery] = useState("")

  const catalogs = [
    {
      id: "1",
      name: "adb_uda_dev",
      type: "catalog",
      owner: "_workspace_admins_adb_uda_dev_",
      createdAt: "Apr 05, 2025, 03:51 AM",
    },
    {
      id: "2",
      name: "hive_metastore",
      type: "catalog",
      owner: "",
      createdAt: "",
    },
    {
      id: "3",
      name: "pricing_analytics",
      type: "catalog",
      owner: "bluenorthai@outlook.com",
      createdAt: "Apr 07, 2025, 09:41 PM",
    },
    {
      id: "4",
      name: "samples",
      type: "catalog",
      owner: "System user",
      createdAt: "Apr 05, 2025, 03:51 AM",
    },
    {
      id: "5",
      name: "system",
      type: "catalog",
      owner: "System user",
      createdAt: "Apr 05, 2025, 03:51 AM",
    },
  ]

  // Filter catalogs based on filter query
  const filteredCatalogs = catalogs.filter((catalog) => {
    return catalog.name.toLowerCase().includes(filterQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 p-2 border-b">
        <h1 className="text-lg font-semibold">Catalog</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Serverless Starter Warehouse</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Serverless</span>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left sidebar */}
        <div className="w-64 border-r pr-2">
          <div className="mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Type to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-6 w-6">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CatalogTree />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          <h2 className="text-lg font-medium mb-4">Quick access</h2>

          <div className="mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/50">
                <TabsTrigger value="recents" className="data-[state=active]:bg-white">
                  <Clock className="h-4 w-4 mr-2" />
                  Recents
                </TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:bg-white">
                  <Star className="h-4 w-4 mr-2" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="catalogs" className="data-[state=active]:bg-white">
                  <Database className="h-4 w-4 mr-2" />
                  Catalogs
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Button className="bg-blue-600 hover:bg-blue-700">Create catalog</Button>
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Filter"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <CatalogTable catalogs={filteredCatalogs} />
        </div>
      </div>
    </div>
  )
}

function Filter(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function Star(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

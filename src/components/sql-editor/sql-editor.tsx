"use client"

import { useState } from "react"
import { Play, ChevronDown, Star, Plus, X, RefreshCw, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { CatalogBrowser } from "./catalog-browser"
import { QueryEditor } from "./query-editor"
import { ResultsPanel } from "./results-panel"

export function SqlEditor() {
  const [activeTab, setActiveTab] = useState("01-Deltalakehouse-pre-setup")
  const [sqlQuery, setSqlQuery] = useState(`USE CATALOG pricing_analytics;

CREATE SCHEMA IF NOT EXISTS processrunlogs;

CREATE TABLE IF NOT EXISTS processrunlogs.DELTALAKEHOUSE_PROCESS_RUNS(
  PROCESS_NAME STRING,
  PROCESSED_FILE_TABLE_DATE DATE,
  PROCESS_STATUS STRING
)

ALTER TABLE pricing_analytics.processrunlogs.deltalakehouse_process_runs
ADD COLUMNS (PROCESSED_FILE_TABLE_DATETIME TIMESTAMP);`)

  const [selectedDatabase] = useState("")
  const [selectedWarehouse] = useState("")
  const [warehouseSize] = useState("")

  const handleRunQuery = () => {
    // In a real implementation, this would send the query to a backend
    console.log("Running query:", sqlQuery)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="bg-transparent h-10 p-0">
            <TabsTrigger
              value="01-Deltalakehouse-pre-setup"
              className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:shadow-none px-4 h-10"
            >
              01-Deltalakehouse-pre-setup
            </TabsTrigger>
            <TabsTrigger
              value="02-Deltalakehouse-bronze-layer-tables-setup"
              className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:shadow-none px-4 h-10"
            >
              02-Deltalakehouse-bronze-layer-tables-setup
            </TabsTrigger>
            <TabsTrigger
              value="03-Deltalakehouse-silver-layer-table"
              className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:shadow-none px-4 h-10"
            >
              03-Deltalakehouse-silver-layer-table
            </TabsTrigger>
            <TabsTrigger
              value="04-Deltalakehouse-gold-layer-reporting-table"
              className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:shadow-none px-4 h-10"
            >
              04-Deltalakehouse-gold-layer-reporting-table
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none border-l">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Catalog browser */}
        <div className="w-64 border-r flex flex-col">
          <div className="flex items-center justify-between p-2 border-b">
            <span className="font-medium">Catalog</span>
            <div className="flex">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-2">
            <Input type="text" placeholder="Type to search..." className="h-8 text-sm" />
          </div>
          <div className="flex p-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs h-7">
              For you
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7">
              All
            </Button>
          </div>
          <CatalogBrowser />
        </div>

        {/* Right panel - Query editor and results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Query controls */}
          <div className="flex items-center p-2 border-b gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
              <Play className="h-4 w-4" />
              Run all (1000)
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 border rounded-md px-2 py-1">
              <div className="h-4 w-4 bg-gray-200 rounded-sm"></div>
              <span className="text-sm">{selectedDatabase}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button>
            <div className="flex items-center ml-auto gap-2">
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-gray-200 rounded-sm"></div>
                <span className="text-sm">{selectedWarehouse}</span>
                <span className="text-sm text-muted-foreground">{warehouseSize}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <Button variant="outline" className="h-8">
                Save
              </Button>
              <Button variant="outline" className="h-8">
                Schedule
              </Button>
              <Button variant="outline" className="h-8">
                Share
              </Button>
            </div>
          </div>

          {/* Query editor */}
          <div className="flex-1 overflow-hidden">
            <QueryEditor value={sqlQuery } onChange={setSqlQuery} onRun={handleRunQuery} />
          </div>

          {/* Results panel */}
          <div className="h-64 border-t">
            <ResultsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

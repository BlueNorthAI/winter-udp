"use client"

import { useState } from "react"
import { Search, ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { PipelinesTable } from "./pipelines-table"

export function Pipelines() {
  const [activeTab, setActiveTab] = useState("pipelines")
  const [searchQuery, setSearchQuery] = useState("")
  const [onlyMyPipelines, setOnlyMyPipelines] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Workflows</h1>
        <Button variant="outline" className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          Send feedback
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 border-b rounded-none w-full justify-start h-auto p-0 bg-transparent">
          <TabsTrigger
            value="jobs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
          >
            Jobs
          </TabsTrigger>
          <TabsTrigger
            value="job-runs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
          >
            Job runs
          </TabsTrigger>
          <TabsTrigger
            value="pipelines"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
          >
            Pipelines
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines" className="mt-0">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 max-w-md">
                <div className="flex items-center border rounded-md">
                  <Input
                    type="search"
                    placeholder="Filter by pipeline name"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 border rounded-md px-3 bg-white">
                <Checkbox
                  id="only-my-pipelines"
                  checked={onlyMyPipelines}
                  onCheckedChange={(checked) => setOnlyMyPipelines(checked as boolean)}
                />
                <label htmlFor="only-my-pipelines" className="text-sm">
                  Only my pipelines
                </label>
              </div>

              <div className="relative">
                <Button variant="outline" className="flex items-center gap-1">
                  Type
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="ml-auto">
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
                  Create pipeline
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            <PipelinesTable  />
          </div>
        </TabsContent>

        {/* Placeholder content for other tabs */}
        <TabsContent value="jobs" className="mt-0">
          <div className="p-4 border rounded-md">Jobs content</div>
        </TabsContent>
        <TabsContent value="job-runs" className="mt-0">
          <div className="p-4 border rounded-md">Job runs content</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

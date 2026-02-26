"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AllPurposeComputeTab } from "@/components/compute/all-purpose-compute-tab"
import { JobComputeTab } from "@/components/compute/job-compute-tab"
import { SqlWarehousesTab } from "@/components/compute/sql-warehouses-tab"
import { VectorSearchTab } from "@/components/compute/vector-search-tab"
import { PoolsTab } from "@/components/compute/pools-tab"
import { PoliciesTab } from "@/components/compute/policies-tab"
import { AppsTab } from "@/components/compute/apps-tab"

export default function ComputePage() {
  const [activeTab, setActiveTab] = useState("all-purpose")

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Compute</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 border-b rounded-none w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger
              value="all-purpose"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              All-purpose compute
            </TabsTrigger>
            <TabsTrigger
              value="job-compute"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Job compute
            </TabsTrigger>
            <TabsTrigger
              value="sql-warehouses"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              SQL warehouses
            </TabsTrigger>
            <TabsTrigger
              value="vector-search"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Vector Search
            </TabsTrigger>
            <TabsTrigger
              value="pools"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Pools
            </TabsTrigger>
            <TabsTrigger
              value="policies"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Policies
            </TabsTrigger>
            <TabsTrigger
              value="apps"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Apps <Info className="h-4 w-4 ml-1" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-purpose" className="mt-0">
            <AllPurposeComputeTab />
          </TabsContent>

          <TabsContent value="job-compute" className="mt-0">
            <JobComputeTab />
          </TabsContent>

          <TabsContent value="sql-warehouses" className="mt-0">
            <SqlWarehousesTab />
          </TabsContent>

          <TabsContent value="vector-search" className="mt-0">
            <VectorSearchTab />
          </TabsContent>

          <TabsContent value="pools" className="mt-0">
            <PoolsTab />
          </TabsContent>

          <TabsContent value="policies" className="mt-0">
            <PoliciesTab />
          </TabsContent>

          <TabsContent value="apps" className="mt-0">
            <AppsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

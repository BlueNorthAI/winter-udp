"use client"

import { useState } from "react"
import { Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelsList } from "./models-list"

export function Models() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("unity-catalog")
  const [onlyMyModels, setOnlyMyModels] = useState(false)
  const [legacyServing, setLegacyServing] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Registered Models</h1>
          <p className="text-sm text-muted-foreground">
            Share and serve machine learning models.{" "}
            <a href="#" className="text-blue-600 inline-flex items-center">
              Learn more <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Permissions</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Create Model</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder={activeTab === "unity-catalog" ? "Filter registered models by name or tags" : "Filter models"}
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
                value="workspace-registry"
                className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 px-4 py-2 h-10"
              >
                Workspace Model Registry
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 border rounded-md px-3 py-2">
            <Checkbox
              id="only-my-models"
              checked={onlyMyModels}
              onCheckedChange={(checked) => setOnlyMyModels(checked as boolean)}
            />
            <label htmlFor="only-my-models" className="text-sm">
              {activeTab === "unity-catalog" ? "Owned by me" : "Only my models"}
            </label>
          </div>

          {activeTab === "workspace-registry" && (
            <div className="flex items-center gap-2 border rounded-md px-3 py-2">
              <Checkbox
                id="legacy-serving"
                checked={legacyServing}
                onCheckedChange={(checked) => setLegacyServing(checked as boolean)}
              />
              <label htmlFor="legacy-serving" className="text-sm">
                Legacy serving enabled only
              </label>
            </div>
          )}
        </div>

        <ModelsList 
          activeTab={activeTab} 
          onlyMyModels={onlyMyModels} 
          legacyServing={legacyServing} 
        />
      </div>
    </div>
  )
}

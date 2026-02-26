"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, RefreshCw, X, Database, FolderClosed, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CatalogItem {
  name: string
  type: "database" | "folder"
  children?: CatalogItem[]
}

interface CatalogSidebarProps {
  items?: {
    myOrganization: CatalogItem[]
    deltaShares: CatalogItem[]
    legacy: CatalogItem[]
  }
}

export function CatalogSidebar({ items }: CatalogSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState({
    myOrg: false,
    deltaShares: false,
    legacy: false,
  })

  const defaultItems = {
    myOrganization: [
      { name: "adb_uda_dev", type: "database" },
      { name: "system", type: "database" },
      { name: "pricing_analytics", type: "folder" },
    ],
    deltaShares: [{ name: "samples", type: "database" }],
    legacy: [{ name: "hive_metastore", type: "database" }],
  }

  const catalogItems = items || defaultItems

  return (
    <div className="w-[250px] border-r flex flex-col">
      {/* Catalog header */}
      <div className="p-2 border-b flex items-center justify-between">
        <h2 className="font-medium">Catalog</h2>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 flex gap-1">
        <Input placeholder="Type to search..." className="h-8 text-sm" />
        <div className="flex">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none border-r-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="px-2 pb-2 flex gap-2">
        <Button variant="secondary" className="rounded-full text-xs h-7">
          For you
        </Button>
        <Button variant="outline" className="rounded-full text-xs h-7">
          All
        </Button>
      </div>

      {/* Tree view */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          <Collapsible
            open={!isCollapsed.myOrg}
            onOpenChange={(open) => setIsCollapsed({ ...isCollapsed, myOrg: !open })}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center py-1 px-2 hover:bg-muted rounded cursor-pointer">
                {isCollapsed.myOrg ? (
                  <ChevronRight className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-xs">My organization</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4">
                {catalogItems.myOrganization.map((item) => (
                  <div key={item.name} className="flex items-center py-1 px-2 hover:bg-muted rounded cursor-pointer">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {item.type === "database" ? (
                      <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <FolderClosed className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span className="text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={!isCollapsed.deltaShares}
            onOpenChange={(open) => setIsCollapsed({ ...isCollapsed, deltaShares: !open })}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center py-1 px-2 hover:bg-muted rounded cursor-pointer mt-1">
                {isCollapsed.deltaShares ? (
                  <ChevronRight className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-xs">Delta Shares Received</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4">
                {catalogItems.deltaShares.map((item) => (
                  <div key={item.name} className="flex items-center py-1 px-2 hover:bg-muted rounded cursor-pointer">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {item.type === "database" ? (
                      <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <FolderClosed className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span className="text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={!isCollapsed.legacy}
            onOpenChange={(open) => setIsCollapsed({ ...isCollapsed, legacy: !open })}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center py-1 px-2 hover:bg-muted rounded cursor-pointer mt-1">
                {isCollapsed.legacy ? (
                  <ChevronRight className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-xs">Legacy</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4">
                {catalogItems.legacy.map((item) => (
                  <div key={item.name} className="flex items-center py-1 px-2 hover:bg-muted rounded cursor-pointer">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {item.type === "database" ? (
                      <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <FolderClosed className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span className="text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  )
}

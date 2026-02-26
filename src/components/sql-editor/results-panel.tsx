"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ResultsPanel() {
  const [activeTab, setActiveTab] = useState("raw-results")

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="h-10 bg-transparent">
            <TabsTrigger
              value="raw-results"
              className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none px-4 h-10 flex items-center"
            >
              Raw results <ChevronDown className="h-4 w-4 ml-1" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Plus className="h-4 w-4" />
        </Button>
        <div className="flex ml-auto">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
        <div className="mb-4">
          <div className="h-16 w-16 bg-gray-100 rounded-md mx-auto flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-dashed border-gray-300 rounded"></div>
          </div>
        </div>
        <h3 className="text-lg font-medium mb-1">No results available</h3>
        <p className="text-muted-foreground">Run a query to show the results</p>
      </div>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

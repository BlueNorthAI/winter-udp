"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ModelCard } from "./model-card"
import { ServingTable } from "./serving-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Serving() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ownedByMe, setOwnedByMe] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  const modelCards = [
    {
      id: "llama-4-maverick",
      name: "Llama 4 Maverick",
      type: "Chat • Pay-per-token",
      icon: "databricks",
    },
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      type: "Chat • Pay-per-token",
      icon: "databricks",
    },
    {
      id: "openai-gpt-4o",
      name: "OpenAI GPT-4o",
      type: "Chat • External Model",
      icon: "openai",
    },
    {
      id: "meta-llama-3-1-8b-instruct",
      name: "Meta Llama 3.1 8B Instruct",
      type: "Chat • Pay-per-token",
      icon: "databricks",
    },
    {
      id: "meta-llama-3-3-70b-instruct",
      name: "Meta Llama 3.3 70B Instruct",
      type: "Chat • Pay-per-token",
      icon: "databricks",
    },
  ]

  const servingEndpoints = [
    {
      id: "1",
      name: "databricks-llama-4-maverick",
      state: "Ready",
      servedEntities: "Llama 4 Maverick",
      tags: [],
      task: "Chat",
      createdBy: "",
      lastModified: "1 year ago",
    },
    {
      id: "2",
      name: "databricks-claude-3-7-sonnet",
      state: "Ready",
      servedEntities: "Claude 3.7 Sonnet",
      tags: [],
      task: "Chat",
      createdBy: "",
      lastModified: "1 year ago",
    },
    {
      id: "3",
      name: "databricks-meta-llama-3-1-8b-instruct",
      state: "Ready",
      servedEntities: "Meta Llama 3.1 8B Instruct",
      tags: [],
      task: "Chat",
      createdBy: "",
      lastModified: "1 year ago",
    },
    {
      id: "4",
      name: "databricks-meta-llama-3-3-70b-instruct",
      state: "Ready",
      servedEntities: "Meta Llama 3.3 70B Instruct",
      tags: [],
      task: "Chat",
      createdBy: "",
      lastModified: "1 year ago",
    },
    {
      id: "5",
      name: "databricks-gte-large-en",
      state: "Ready",
      servedEntities: "GTE Large (En)",
      tags: [],
      task: "Embeddings",
      createdBy: "",
      lastModified: "1 year ago",
    },
    {
      id: "6",
      name: "databricks-meta-llama-3-1-405b-instruct",
      state: "Ready",
      servedEntities: "Meta Llama 3.1 405B Instruct",
      tags: [],
      task: "Chat",
      createdBy: "",
      lastModified: "1 year ago",
    },
    {
      id: "7",
      name: "databricks-dbrx-instruct",
      state: "Ready",
      servedEntities: "DBRX Instruct",
      tags: [],
      task: "Chat",
      createdBy: "",
      lastModified: "1 year ago",
    },
    {
      id: "8",
      name: "databricks-mixtral-8x7b-instruct",
      state: "Ready",
      servedEntities: "Mixtral-8x7B Instruct",
      tags: [],
      task: "Chat",
      createdBy: "",
      lastModified: "1 year ago",
    },
    {
      id: "9",
      name: "databricks-bge-large-en",
      state: "Ready",
      servedEntities: "BGE Large (En)",
      tags: [],
      task: "Embeddings",
      createdBy: "",
      lastModified: "1 year ago",
    },
  ]

  const visibleCards = 4
  const totalCards = modelCards.length

  const handlePrevCard = () => {
    setActiveCardIndex((prev) => (prev === 0 ? totalCards - visibleCards : prev - 1))
  }

  const handleNextCard = () => {
    setActiveCardIndex((prev) => (prev === totalCards - visibleCards ? 0 : prev + 1))
  }

  // Filter endpoints based on search query and owned by me filter
  const filteredEndpoints = servingEndpoints.filter((endpoint) => {
    const matchesSearch = endpoint.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Serving endpoints</h1>
          <Button variant="ghost" size="sm" className="text-blue-600 flex items-center gap-1 h-7">
            <span className="text-sm">Send feedback</span>
          </Button>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Create serving endpoint</Button>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Experimenting with LLMs? Try managed LLM models or securely connect to external providers like OpenAI!
        </p>
      </div>

      {/* Model Cards Carousel */}
      <div className="relative mb-8">
        <div className="flex gap-4 overflow-hidden">
          {modelCards.map((model, index) => {
            const isVisible = index >= activeCardIndex && index < activeCardIndex + visibleCards
            return isVisible ? (
              <ModelCard key={model.id} name={model.name} type={model.type} icon={model.icon as "databricks" | "openai"} className="w-1/4" />
            ) : null
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
          onClick={handlePrevCard}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
          onClick={handleNextCard}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Filter serving endpoints by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

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
      </div>

      {/* Endpoints Table */}
      <ServingTable endpoints={filteredEndpoints} />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">{currentPage}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={currentPage * itemsPerPage >= filteredEndpoints.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={`${itemsPerPage} / page`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

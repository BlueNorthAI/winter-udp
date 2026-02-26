"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState("Llama 4 Maverick")

  const models = ["Llama 4 Maverick", "Llama 3 70B", "Llama 3 8B", "Claude 3 Opus", "Claude 3 Sonnet", "GPT-4o"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {selectedModel}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {models.map((model) => (
          <DropdownMenuItem
            key={model}
            onClick={() => setSelectedModel(model)}
            className={selectedModel === model ? "bg-muted" : ""}
          >
            {model}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

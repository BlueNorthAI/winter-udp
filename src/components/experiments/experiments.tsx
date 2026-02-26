"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExperimentCard } from "./experiment-card"
import { ExperimentsTable } from "./experiments-table"

export function Experiments() {
  const [searchQuery, setSearchQuery] = useState("")
  const [onlyMyExperiments, setOnlyMyExperiments] = useState(true)
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  const experimentTypes = [
    {
      id: "fine-tuning",
      title: "Foundation Model Fine-tuning",
      description: "Fine-tune a foundation model on your dataset",
      buttonText: "Start fine-tuning",
      isPreview: true,
    },
    {
      id: "forecasting",
      title: "Forecasting",
      description: "Input your dataset and create a forecasting model using AutoML",
      buttonText: "Start training",
      isPreview: true,
    },
    {
      id: "classification",
      title: "Classification",
      description: "Input your dataset and create a classification model using AutoML",
      buttonText: "Start training",
      isPreview: false,
    },
    {
      id: "regression",
      title: "Regression",
      description: "Input your dataset and create a regression model using AutoML",
      buttonText: "Start training",
      isPreview: false,
    },
    {
      id: "custom",
      title: "Custom",
      description: "Create a custom experiment from scratch for your usecase.",
      buttonText: "Create experiment",
      isPreview: false,
    },
  ]

  const visibleCards = 4
  const totalCards = experimentTypes.length

  const handlePrevCard = () => {
    setActiveCardIndex((prev) => (prev === 0 ? totalCards - visibleCards : prev - 1))
  }

  const handleNextCard = () => {
    setActiveCardIndex((prev) => (prev === totalCards - visibleCards ? 0 : prev + 1))
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setOnlyMyExperiments(true)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Experiments</h1>
        <Button variant="outline" disabled>
          Compare (0)
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium mb-4">Create model training</h2>
        <div className="relative">
          <div className="flex gap-4 overflow-hidden">
            {experimentTypes.map((experiment, index) => {
              const isVisible = index >= activeCardIndex && index < activeCardIndex + visibleCards
              return isVisible ? (
                <ExperimentCard
                  key={experiment.id}
                  title={experiment.title}
                  description={experiment.description}
                  buttonText={experiment.buttonText}
                  isPreview={experiment.isPreview}
                  className="w-1/4"
                />
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
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-1">
            <div className="h-1 w-16 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-500"
                style={{ width: `${(activeCardIndex / (totalCards - visibleCards)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-medium mb-4">Experiments list</h2>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Filter experiments"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div 
            className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50 text-blue-800 cursor-pointer"
            onClick={() => setOnlyMyExperiments(!onlyMyExperiments)}
          >
            <Check className="h-4 w-4" />
            <span className="text-sm">Only my experiments</span>
          </div>
          <Button variant="teritary" className="text-blue-600" onClick={handleResetFilters}>
            Reset filters
          </Button>
        </div>

        <ExperimentsTable/>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Search, ChevronDown, ExternalLink, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IntegrationTile } from "./integration-tile"
import { ProviderCard } from "./provider-card"

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">bnai Marketplace</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              powered by{" "}
              <span className="ml-1 text-blue-600 font-medium flex items-center">
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4L4 8L12 12L20 8L12 4Z"
                    fill="#2196F3"
                    stroke="#2196F3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 16L12 20L20 16"
                    stroke="#2196F3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 12L12 16L20 12"
                    stroke="#2196F3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                DELTA SHARING
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button variant="ghost" className="text-blue-600 font-medium">
                Learn <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <Button variant="ghost" className="text-blue-600 font-medium">
              My requests
            </Button>
          </div>
        </div>

        {/* Partner Connect Banner */}
        <div className="flex justify-between items-center mb-12 mt-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4">Partner Connect is now in Marketplace</h2>
            <p className="text-muted-foreground mb-6">
              Find all products from partners in one place while connecting to your favorite integrations
            </p>
            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">View all integrations</Button>
              <Button variant="outline" className="flex items-center gap-2">
                Learn more <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <IntegrationTile name="dbt Cloud" icon="/dbt-logo-display.png" />
            <IntegrationTile name="Tableau Desktop" icon="/abstract-geometric-shapes.png" />
            <IntegrationTile name="Fivetran" icon="/abstract-data-flow.png" />
            <IntegrationTile name="Dataiku" icon="/dataiku-logo-abstract.png" />
            <IntegrationTile name="Power BI Desktop" icon="/power-bi-abstract.png" />
            <IntegrationTile name="Sigma" icon="/abstract-sigma.png" />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3 mb-8">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products"
              className="pl-9 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-10">
            Product <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" className="h-10">
            Category <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" className="h-10">
            Free
          </Button>
        </div>

        {/* Featured Providers */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Featured providers</h3>
            <Button variant="primary" className="text-blue-600">
              View all providers &gt;
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ProviderCard name="Epsilon" logo="/epsilon-symbol.png" />
            <ProviderCard name="FactSet" logo="/factset-office-interior.png" />
            <ProviderCard name="Komodo Health" logo="/abstract-medical-network.png" />
          </div>
        </div>
      </div>
    </div>
  )
}

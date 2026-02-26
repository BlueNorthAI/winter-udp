"use client"

import { RecentItem } from "./item"

interface RecentItemData {
  id: string
  name: string
  path: string
  accessedAt: string
  type: "Query" | "Notebook" | "Dashboard" | "Table" | "Schema"
}

interface RecentsListProps {
  searchQuery?: string
}

export function RecentsList({ searchQuery = "" }: RecentsListProps) {
  // Sample data for recent items
  const recentItems: RecentItemData[] = [
    {
      id: "1",
      name: "01-Deltalakehouse-pre-setup",
      path: "/Users/bluenorthai@outlook.com/01-Ingestion",
      accessedAt: "20 minutes ago",
      type: "Query",
    },
    {
      id: "2",
      name: "01-Ingest-Daily-Pricing-HTTP-Source-Data",
      path: "/Users/bluenorthai@outlook.com/01-Ingestion",
      accessedAt: "1 day ago",
      type: "Notebook",
    },
    {
      id: "3",
      name: "Retail Revenue & Supply Chain",
      path: "/Users/bluenorthai@outlook.com/Sample Dashboards",
      accessedAt: "3 days ago",
      type: "Dashboard",
    },
    {
      id: "4",
      name: "03-Deltalakehouse-silver-layer-table",
      path: "/Users/bluenorthai@outlook.com",
      accessedAt: "3 days ago",
      type: "Query",
    },
    {
      id: "5",
      name: "04-Deltalakehouse-gold-layer-reporting-tables-setup",
      path: "/Users/bluenorthai@outlook.com",
      accessedAt: "3 days ago",
      type: "Query",
    },
    {
      id: "6",
      name: "daily_pricing",
      path: "pricing_analytics.bronze",
      accessedAt: "3 days ago",
      type: "Table",
    },
    {
      id: "7",
      name: "01-Transform-Daily-Pricing-CSV-to-DELTA-Table",
      path: "/Users/bluenorthai@outlook.com/02-Transform",
      accessedAt: "3 days ago",
      type: "Notebook",
    },
    {
      id: "8",
      name: "03-Transform-Reporting-Dimension-Tables",
      path: "/Users/bluenorthai@outlook.com/02-Transform",
      accessedAt: "3 days ago",
      type: "Notebook",
    },
    {
      id: "9",
      name: "03-Transform-Reporting-Dimension-Tablesbp",
      path: "/Users/bluenorthai@outlook.com/02-Transform",
      accessedAt: "5 days ago",
      type: "Notebook",
    },
    {
      id: "10",
      name: "gold",
      path: "pricing_analytics",
      accessedAt: "5 days ago",
      type: "Schema",
    },
    {
      id: "11",
      name: "silver",
      path: "pricing_analytics",
      accessedAt: "5 days ago",
      type: "Schema",
    },
  ]

  // Filter items based on search query
  const filteredItems = recentItems.filter((item) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.path.toLowerCase().includes(searchLower) ||
      item.type.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-1">
      {filteredItems.map((item) => (
        <RecentItem key={item.id} item={item} />
      ))}
    </div>
  )
}

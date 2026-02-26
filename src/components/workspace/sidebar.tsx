"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Folder, FolderOpen, Home, Star, Trash2, FileText, Database } from "lucide-react"
import { cn } from "@/lib/utils"

type TreeItem = {
  id: string
  name: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  href: string
  children?: TreeItem[]
}

export function Sidebar() {
  const treeItems: TreeItem[] = [
    {
      id: "home",
      name: "Home",
      icon: <Home className="h-4 w-4" />,
      href: "/home",
    },
    {
      id: "workspace",
      name: "Workspace",
      icon: <Folder className="h-4 w-4" />,
      activeIcon: <FolderOpen className="h-4 w-4" />,
      href: "/workspace",
      children: [
        {
          id: "favorites",
          name: "Favorites",
          icon: <Star className="h-4 w-4" />,
          href: "/favorites",
        },
        {
          id: "trash",
          name: "Trash",
          icon: <Trash2 className="h-4 w-4" />,
          href: "/trash",
        },
        {
          id: "01-ingestion",
          name: "01-Ingestion",
          icon: <Folder className="h-4 w-4 text-blue-500" />,
          activeIcon: <FolderOpen className="h-4 w-4 text-blue-500" />,
          href: "/workspace/01-ingestion",
          children: [
            {
              id: "notebook-1",
              name: "Data Sources",
              icon: <FileText className="h-4 w-4 text-gray-500" />,
              href: "/workspace/01-ingestion/data-sources",
            },
            {
              id: "notebook-2",
              name: "ETL Process",
              icon: <FileText className="h-4 w-4 text-gray-500" />,
              href: "/workspace/01-ingestion/etl-process",
            },
          ],
        },
        {
          id: "02-transform",
          name: "02-Transform",
          icon: <Folder className="h-4 w-4 text-blue-500" />,
          activeIcon: <FolderOpen className="h-4 w-4 text-blue-500" />,
          href: "/workspace/02-transform",
          children: [
            {
              id: "transform-notebook",
              name: "Data Transformation",
              icon: <FileText className="h-4 w-4 text-gray-500" />,
              href: "/workspace/02-transform/data-transformation",
            },
          ],
        },
        {
          id: "pyspark-intro",
          name: "PySpark-Introduction",
          icon: <Folder className="h-4 w-4 text-blue-500" />,
          activeIcon: <FolderOpen className="h-4 w-4 text-blue-500" />,
          href: "/workspace/pyspark-introduction",
        },
        {
          id: "sample-dashboards",
          name: "Sample Dashboards",
          icon: <Folder className="h-4 w-4 text-blue-500" />,
          activeIcon: <FolderOpen className="h-4 w-4 text-blue-500" />,
          href: "/workspace/sample-dashboards",
        },
        {
          id: "sparksql-intro",
          name: "sparkSQL-Introduction",
          icon: <Folder className="h-4 w-4 text-blue-500" />,
          activeIcon: <FolderOpen className="h-4 w-4 text-blue-500" />,
          href: "/workspace/sparksql-introduction",
        },
        {
          id: "queries",
          name: "Queries",
          icon: <Folder className="h-4 w-4 text-blue-500" />,
          activeIcon: <FolderOpen className="h-4 w-4 text-blue-500" />,
          href: "/workspace/queries",
          children: [
            {
              id: "bronze-layer",
              name: "02-Deltalakehouse-bronze-layer-tables-setup",
              icon: <Database className="h-4 w-4 text-green-500" />,
              href: "/workspace/queries/bronze-layer",
            },
            {
              id: "silver-layer",
              name: "03-Deltalakehouse-silver-layer-table",
              icon: <Database className="h-4 w-4 text-green-500" />,
              href: "/workspace/queries/silver-layer",
            },
            {
              id: "gold-layer",
              name: "04-Deltalakehouse-gold-layer-reporting-table",
              icon: <Database className="h-4 w-4 text-green-500" />,
              href: "/workspace/queries/gold-layer",
            },
          ],
        },
      ],
    },
  ]

  return (
    <div className="w-64 border-r bg-muted/20 h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Workspace</h1>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        <TreeView items={treeItems} />
      </nav>
    </div>
  )
}

interface TreeViewProps {
  items: TreeItem[]
  level?: number
}

function TreeView({ items, level = 0 }: TreeViewProps) {
  return (
    <ul className={cn("space-y-1", level > 0 && "ml-4 mt-1")}>
      {items.map((item) => (
        <TreeViewNode key={item.id} item={item} level={level} />
      ))}
    </ul>
  )
}

interface TreeViewNodeProps {
  item: TreeItem
  level: number
}

function TreeViewNode({ item, level }: TreeViewNodeProps) {
  const [expanded, setExpanded] = useState(level < 1)
  const hasChildren = item.children && item.children.length > 0

  return (
    <li>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mr-1 p-1 rounded-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn("h-3 w-3 text-muted-foreground transition-transform", expanded && "rotate-90")}
            />
          </button>
        ) : (
          <span className="w-5" />
        )}
        <Link
          href={item.href}
          className={cn(
            "flex items-center space-x-2 py-1 px-2 rounded-md text-sm w-full",
            item.id === "workspace" ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted/50",
          )}
        >
          {expanded && item.activeIcon ? item.activeIcon : item.icon}
          <span className="truncate">{item.name}</span>
        </Link>
      </div>
      {hasChildren && expanded && <TreeView items={item.children ?? []} level={level + 1} />}
    </li>
  )
}

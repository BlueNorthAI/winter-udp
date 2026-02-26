"use client"

import { useState } from "react"
import { ChevronRight, Database, FolderClosed, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface TreeNode {
  id: string
  name: string
  type: "folder" | "database" | "table" | "schema"
  children?: TreeNode[]
  expanded?: boolean
}

export function CatalogBrowser() {
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: "my-org",
      name: "My organization",
      type: "folder",
      expanded: true,
      children: [
        {
          id: "adb_uda_dev",
          name: "adb_uda_dev",
          type: "database",
          expanded: false,
          children: [],
        },
        {
          id: "system",
          name: "system",
          type: "database",
          expanded: false,
          children: [],
        },
        {
          id: "pricing_analytics",
          name: "pricing_analytics",
          type: "database",
          expanded: false,
          children: [],
        },
      ],
    },
    {
      id: "delta-shares",
      name: "Delta Shares Received",
      type: "folder",
      expanded: false,
      children: [
        {
          id: "samples",
          name: "samples",
          type: "database",
          children: [],
        },
      ],
    },
    {
      id: "legacy",
      name: "Legacy",
      type: "folder",
      expanded: false,
      children: [
        {
          id: "hive_metastore",
          name: "hive_metastore",
          type: "database",
          children: [],
        },
      ],
    },
  ])

  const toggleNode = (nodeId: string) => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }
    setTreeData(updateNode(treeData))
  }

  const renderTreeNode = (node: TreeNode, level = 0) => {
    const getIcon = () => {
      switch (node.type) {
        case "folder":
          return <FolderClosed className="h-4 w-4 text-gray-500" />
        case "database":
          return <Database className="h-4 w-4 text-blue-500" />
        case "table":
        case "schema":
          return <FileText className="h-4 w-4 text-gray-500" />
        default:
          return <FolderClosed className="h-4 w-4 text-gray-500" />
      }
    }

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer",
            level > 0 && `pl-${level * 4 + 2}px`,
          )}
          onClick={() => toggleNode(node.id)}
          style={{ paddingLeft: level * 16 + 8 }}
        >
          {node.children && node.children.length > 0 && (
            <ChevronRight className={cn("h-4 w-4 mr-1 transition-transform", node.expanded && "rotate-90")} />
          )}
          {!node.children || node.children.length === 0 ? <div className="w-4 mr-1" /> : null}
          {getIcon()}
          <span className="ml-2 text-sm">{node.name}</span>
        </div>
        {node.expanded && node.children && (
          <div>{node.children.map((childNode) => renderTreeNode(childNode, level + 1))}</div>
        )}
      </div>
    )
  }

  return <div className="overflow-y-auto flex-1">{treeData.map((node) => renderTreeNode(node))}</div>
}

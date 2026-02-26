import { FileText, Database, LayoutDashboard, TableIcon, Layers } from "lucide-react"
import Link from "next/link"

export interface RecentItemData {
  id: string
  name: string
  path: string
  accessedAt: string
  type: "Query" | "Notebook" | "Dashboard" | "Table" | "Schema"
}

interface RecentItemProps {
  item: RecentItemData
}

export function RecentItem({ item }: RecentItemProps) {
  return (
    <Link href="#" className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-start space-x-3">
        <div className="bg-muted/50 p-2 rounded-md">{getItemIcon(item.type)}</div>
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-sm text-muted-foreground">{item.path}</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <span className="text-sm text-muted-foreground whitespace-nowrap">{item.accessedAt}</span>
        <span className="text-sm font-medium w-24 text-right">{item.type}</span>
      </div>
    </Link>
  )
}

// Function to get the appropriate icon based on item type
function getItemIcon(type: RecentItemData["type"]) {
  switch (type) {
    case "Query":
      return <Database className="h-5 w-5 text-blue-500" />
    case "Notebook":
      return <FileText className="h-5 w-5 text-gray-500" />
    case "Dashboard":
      return <LayoutDashboard className="h-5 w-5 text-purple-500" />
    case "Table":
      return <TableIcon className="h-5 w-5 text-green-500" />
    case "Schema":
      return <Layers className="h-5 w-5 text-orange-500" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

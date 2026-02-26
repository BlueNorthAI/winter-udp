import Image from "next/image"

interface DashboardCardProps {
  dashboard: {
    id: string
    name: string
    thumbnail: string
    tags: string[]
  }
}

export function DashboardCard({ dashboard }: DashboardCardProps) {
  return (
    <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-100 relative">
        <Image
          src={dashboard.thumbnail || "/placeholder.svg"}
          alt={dashboard.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-blue-600 hover:underline cursor-pointer">{dashboard.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">Sample</p>
      </div>
    </div>
  )
}

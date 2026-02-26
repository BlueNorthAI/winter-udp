import Image from "next/image"

export interface IntegrationTileProps {
  name: string
  icon: string
}

export function IntegrationTile({ name, icon }: IntegrationTileProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <Image src={icon || "/placeholder.svg"} alt={name} width={32} height={32} />
      <span className="font-medium">{name}</span>
    </div>
  )
}

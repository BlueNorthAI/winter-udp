import Image from "next/image"

export interface ProviderCardProps {
  name: string
  logo: string
}

export function ProviderCard({ name, logo }: ProviderCardProps) {
  return (
    <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
      <Image src={logo || "/placeholder.svg"} alt={name} width={64} height={64} className="mb-4" />
      <h4 className="text-lg font-medium">{name}</h4>
    </div>
  )
}

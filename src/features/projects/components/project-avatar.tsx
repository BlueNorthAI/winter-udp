import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ProjectAvatarProps {
  image: string | null
  name: string
  fallbackClassName?: string
  className?: string
}

export function ProjectAvatar({ image, name, fallbackClassName, className }: ProjectAvatarProps) {
  // Get first letter of each word for the fallback
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 1)

  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      {image && <AvatarImage src={image || "/placeholder.svg"} alt={name} />}
      <AvatarFallback className={cn(
        "text-white bg-blue-600 font-semibold text-sm uppercase rounded-md",
        fallbackClassName,
      )}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

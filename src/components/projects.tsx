"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { RiAddCircleFill } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal"
import { DottedSeparator } from "@/components/dotted-separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectsProps {
  collapsed?: boolean
}

export const Projects = ({ collapsed = false }: ProjectsProps) => {
  const pathname = usePathname()
  const { open } = useCreateProjectModal()
  const workspaceId = useWorkspaceId()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { data, isLoading } = useGetProjects({
    workspaceId,
  })

  // On mobile, we always show the full sidebar content when it's open
  const isCollapsed = isMobile ? false : collapsed

  return (
    <div className="flex flex-col">
      {!isCollapsed && <div className="px-4 py-2 text-sm font-medium text-gray-500">Projects</div>}
      <div className="p-2">
        <Button
          className={cn("w-full", isCollapsed ? "justify-center px-2" : "justify-start gap-2")}
          variant="outline"
          onClick={open}
        >
          <RiAddCircleFill className="h-4 w-4" />
          {!isCollapsed && <span>New Project</span>}
        </Button>
      </div>
      <DottedSeparator className="my-2" />
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-2">
          {isLoading ? (
            // Loading skeletons
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  {!isCollapsed && <Skeleton className="h-4 w-24" />}
                </div>
              ))
          ) : data?.documents.length === 0 ? (
            // Empty state
            <div className={cn("text-sm text-gray-500 p-2", isCollapsed && "hidden")}>No projects found</div>
          ) : (
            // Project list
            data?.documents.map((project) => {
              const href = `/workspaces/${workspaceId}/projects/${project.$id}`
              const isActive = pathname.includes(project.$id)

              return (
                <Link href={href} key={project.$id}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full", isCollapsed ? "justify-center px-2" : "justify-start gap-2")}
                    title={isCollapsed ? project.name : undefined}
                  >
                    <ProjectAvatar image={project.imageUrl} name={project.name} />
                    {!isCollapsed && <span className="truncate">{project.name}</span>}
                  </Button>
                </Link>
              )
            })
          )}
        </nav>
      </ScrollArea>
    </div>
  )
}

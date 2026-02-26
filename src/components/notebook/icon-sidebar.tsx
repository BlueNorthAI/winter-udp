"use client"

import { FileIcon, FolderIcon, Network, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface IconSidebarProps {
  activeIcon?: "files" | "folders" | "catalog" | "navigator"
}

export function IconSidebar({ activeIcon = "catalog" }: IconSidebarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-[50px] border-r flex flex-col items-center py-4 bg-muted/20">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className={`h-8 w-8 mb-2 ${activeIcon === "files" ? "bg-muted" : ""}`}>
              <FileIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Files</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 mb-2 ${activeIcon === "folders" ? "bg-muted" : ""}`}
            >
              <FolderIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Folders</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 mb-2 ${activeIcon === "catalog" ? "bg-muted" : ""}`}
            >
              <Network className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Catalog</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 mb-2 ${activeIcon === "navigator" ? "bg-muted" : ""}`}
            >
              <Compass className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Navigator</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Database, Building2 } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function WorkspaceSwitcherHeader() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspaces } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();

  const currentWorkspace = workspaces?.documents.find(
    (ws) => ws.$id === workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 h-9 text-white hover:bg-blue-800 border border-blue-700 rounded-md"
        >
          <Building2 className="h-4 w-4" />
          <span className="max-w-[160px] truncate text-sm font-medium">
            {currentWorkspace?.name || "Select workspace"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
          Workspaces
        </DropdownMenuLabel>
        {workspaces?.documents.map((workspace) => (
          <DropdownMenuItem
            key={workspace.$id}
            onClick={() => router.push(`/workspaces/${workspace.$id}`)}
            className={`flex items-center gap-2 cursor-pointer ${
              workspace.$id === workspaceId ? "bg-blue-50" : ""
            }`}
          >
            <WorkspaceAvatar
              name={workspace.name}
              image={workspace.imageUrl}
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">
                {workspace.name}
              </span>
            </div>
            {workspace.$id === workspaceId && (
              <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
          Data Schemas
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/workspaces/${workspaceId}/catalog`)
          }
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="h-7 w-7 rounded bg-amber-100 flex items-center justify-center">
            <Database className="h-3.5 w-3.5 text-amber-700" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">bronze_dunnhumby</span>
            <span className="text-[10px] text-muted-foreground">
              7 tables - Retail POS data
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            router.push(`/workspaces/${workspaceId}/ingestion`)
          }
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Add Data Source</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={open}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Create Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Breadcrumb } from "@/components/workspace/breadcrumb"
import { WorkspaceHeader } from "@/components/workspace/workspace-header"
import { WorkspaceTable } from "@/components/workspace/workspace-table"
import { Sidebar } from "@/components/workspace/sidebar"

export default function WorkspacePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkspaceHeader />
        <main className="flex-1 overflow-auto p-6">
          <Breadcrumb
            items={[
              { label: "Workspace", href: "/workspace" },
              { label: "Users", href: "/workspace/users" },
            ]}
          />
          <WorkspaceTable />
        </main>
      </div>
    </div>
  )
}

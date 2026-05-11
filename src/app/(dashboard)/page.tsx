import { redirect } from "next/navigation";

import { getWorkspaces } from "@/features/workspaces/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const workspaces = await getWorkspaces();
  if (!workspaces.documents[0]) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Connecting to database...</p>
      </div>
    );
  }
  redirect(`/workspaces/${workspaces.documents[0].$id}/workspacedata`);
};

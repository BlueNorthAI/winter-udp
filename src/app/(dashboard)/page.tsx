import { redirect } from "next/navigation";

import { getWorkspaces } from "@/features/workspaces/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const workspaces = await getWorkspaces();
  if (!workspaces.documents[0]) {
    redirect("/workspaces/create");
  }
  redirect(`/workspaces/${workspaces.documents[0].$id}/workspacedata`);
};

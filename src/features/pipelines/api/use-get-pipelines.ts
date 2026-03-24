import { useQuery } from "@tanstack/react-query";

export const useGetPipelines = (workspaceId: string) => {
  return useQuery({
    queryKey: ["pipelines", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/pipelines?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("Failed to fetch pipelines");
      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId,
  });
};

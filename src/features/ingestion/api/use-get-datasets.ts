import { useQuery } from "@tanstack/react-query";

export const useGetDatasets = (workspaceId: string) => {
  return useQuery({
    queryKey: ["datasets", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/ingestion/datasets?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("Failed to fetch datasets");
      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId,
  });
};

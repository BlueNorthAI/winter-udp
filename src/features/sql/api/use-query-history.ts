import { useQuery } from "@tanstack/react-query";

export const useQueryHistory = (workspaceId: string, page: number = 1) => {
  return useQuery({
    queryKey: ["query-history", workspaceId, page],
    queryFn: async () => {
      const response = await fetch(`/api/sql/history?workspaceId=${workspaceId}&page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch history");
      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId,
  });
};

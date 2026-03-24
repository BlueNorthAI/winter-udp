import { useQuery } from "@tanstack/react-query";

export const useGetKpis = (workspaceId: string) => {
  return useQuery({
    queryKey: ["dashboard-kpis", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard-data/kpis?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("Failed to fetch KPIs");
      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId,
  });
};

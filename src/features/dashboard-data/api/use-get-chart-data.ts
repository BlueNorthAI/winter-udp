import { useQuery } from "@tanstack/react-query";

export const useGetLayerData = (workspaceId: string, layerNum: string) => {
  return useQuery({
    queryKey: ["dashboard-layer", workspaceId, layerNum],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard-data/layer/${layerNum}?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("Failed to fetch layer data");
      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId && !!layerNum,
  });
};

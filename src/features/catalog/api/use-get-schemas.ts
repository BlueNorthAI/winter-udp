import { useQuery } from "@tanstack/react-query";

export const useGetSchemas = (workspaceId: string) => {
  return useQuery({
    queryKey: ["catalog", "schemas", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/catalog/schemas?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("Failed to fetch schemas");
      const { data } = await response.json();
      return data as string[];
    },
    enabled: !!workspaceId,
  });
};

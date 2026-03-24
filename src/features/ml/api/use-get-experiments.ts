import { useQuery } from "@tanstack/react-query";

export const useGetExperiments = (workspaceId: string) => {
  return useQuery({
    queryKey: ["experiments", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/ml/experiments?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("Failed to fetch experiments");
      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId,
  });
};

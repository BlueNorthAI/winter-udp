import { useQuery } from "@tanstack/react-query";

export const useGetPipelineRuns = (pipelineId: string) => {
  return useQuery({
    queryKey: ["pipeline-runs", pipelineId],
    queryFn: async () => {
      const response = await fetch(`/api/pipelines/${pipelineId}/runs`);
      if (!response.ok) throw new Error("Failed to fetch runs");
      const { data } = await response.json();
      return data;
    },
    enabled: !!pipelineId,
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRunPipeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pipelineId: string) => {
      const response = await fetch(`/api/pipelines/${pipelineId}/run`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Pipeline execution failed");
      }

      return (await response.json()).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
      queryClient.invalidateQueries({ queryKey: ["pipeline-runs"] });
    },
  });
};

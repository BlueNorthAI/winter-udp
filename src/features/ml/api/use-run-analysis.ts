import { useMutation } from "@tanstack/react-query";

type AnalysisType = "describe" | "forecast" | "elasticity";

export const useRunAnalysis = () => {
  return useMutation({
    mutationFn: async ({ type, params }: { type: AnalysisType; params: Record<string, unknown> }) => {
      const response = await fetch(`/api/ml/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Analysis failed");
      }

      return (await response.json()).data;
    },
  });
};

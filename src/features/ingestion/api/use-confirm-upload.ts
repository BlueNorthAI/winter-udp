import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConfirmUpload = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      workspaceId: string;
      tableName: string;
      columns: { name: string; type: string; nullable: boolean }[];
      data: Record<string, unknown>[];
      medallionLayer?: string;
    }) => {
      const response = await fetch("/api/ingestion/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Confirm failed");
      }

      return (await response.json()).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });

  return mutation;
};

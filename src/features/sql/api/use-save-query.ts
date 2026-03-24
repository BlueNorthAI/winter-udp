import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSaveQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { workspaceId: string; name: string; sql: string }) => {
      const response = await fetch("/api/sql/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save query");
      }

      return (await response.json()).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-queries"] });
    },
  });
};

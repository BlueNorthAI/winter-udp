import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      workspaceId: string;
      name: string;
      host: string;
      port: number;
      database: string;
      username: string;
      password: string;
      sslEnabled?: boolean;
    }) => {
      const response = await fetch("/api/ingestion/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create connection");
      }

      return (await response.json()).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
};

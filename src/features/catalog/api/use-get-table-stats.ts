import { useQuery } from "@tanstack/react-query";

export const useGetTableStats = (schema: string, table: string) => {
  return useQuery({
    queryKey: ["catalog", "stats", schema, table],
    queryFn: async () => {
      const response = await fetch(`/api/catalog/stats?schema=${schema}&table=${table}`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      const { data } = await response.json();
      return data;
    },
    enabled: !!schema && !!table,
  });
};

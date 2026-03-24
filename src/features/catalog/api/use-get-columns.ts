import { useQuery } from "@tanstack/react-query";

export const useGetColumns = (schema: string, table: string) => {
  return useQuery({
    queryKey: ["catalog", "columns", schema, table],
    queryFn: async () => {
      const response = await fetch(`/api/catalog/columns?schema=${schema}&table=${table}`);
      if (!response.ok) throw new Error("Failed to fetch columns");
      const { data } = await response.json();
      return data;
    },
    enabled: !!schema && !!table,
  });
};

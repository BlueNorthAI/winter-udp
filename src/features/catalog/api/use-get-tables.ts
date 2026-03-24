import { useQuery } from "@tanstack/react-query";

export const useGetTables = (schema: string) => {
  return useQuery({
    queryKey: ["catalog", "tables", schema],
    queryFn: async () => {
      const response = await fetch(`/api/catalog/tables?schema=${schema}`);
      if (!response.ok) throw new Error("Failed to fetch tables");
      const { data } = await response.json();
      return data;
    },
    enabled: !!schema,
  });
};

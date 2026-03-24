import { useMutation } from "@tanstack/react-query";

export const useUploadFile = () => {
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ingestion/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return mutation;
};

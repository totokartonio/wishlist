import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem } from "../api/items";

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

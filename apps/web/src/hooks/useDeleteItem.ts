import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem } from "../api/items";

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

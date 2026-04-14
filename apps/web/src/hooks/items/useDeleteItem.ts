import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem } from "../../api/items";

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { wishlistId: string; id: string }) =>
      deleteItem(variables.wishlistId, variables.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

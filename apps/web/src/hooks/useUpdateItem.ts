import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateItemDto } from "@wishlist/types";
import { updateItem } from "../api/items";

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; dto: UpdateItemDto }) =>
      updateItem(variables.id, variables.dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

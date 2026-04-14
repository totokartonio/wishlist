import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateItemDto } from "@wishlist/types";
import { updateItem } from "../../api/items";

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      wishlistId: string;
      id: string;
      dto: UpdateItemDto;
    }) => updateItem(variables.wishlistId, variables.id, variables.dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem } from "../../api/items";
import type { CreateItemDto } from "@wishlist/types";

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { wishlistId: string; dto: CreateItemDto }) =>
      createItem(variables.wishlistId, variables.dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateWishlistDto } from "@wishlist/types";
import { updateWishlist } from "../../api/wishlists";

export const useUpdateWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; dto: UpdateWishlistDto }) =>
      updateWishlist(variables.id, variables.dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlists"] }),
  });
};

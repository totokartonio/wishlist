import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWishlist } from "../../api/wishlists";
import type { CreateWishlistDto } from "@wishlist/types";

export const useCreateWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateWishlistDto) => createWishlist(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlists"] }),
  });
};

import { useMutation } from "@tanstack/react-query";
import { deleteWishlist } from "../../api/wishlists";

export const useDeleteWishlist = () => {
  return useMutation({
    mutationFn: (id: string) => deleteWishlist(id),
  });
};

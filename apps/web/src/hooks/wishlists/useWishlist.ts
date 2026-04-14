import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../../api/wishlists";

export const useWishlist = (wishlistId: string) => {
  return useQuery({
    queryKey: ["wishlists", wishlistId],
    queryFn: () => getWishlist(wishlistId),
  });
};

import { useQuery } from "@tanstack/react-query";
import { getUserWishlists } from "../../api/users";

export const useGetUserWishlist = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId, "wishlists"],
    queryFn: () => getUserWishlists(userId),
  });
};

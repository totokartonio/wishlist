import { useQuery } from "@tanstack/react-query";
import { getWishlists } from "../../api/wishlists";

export const useWishlists = () => {
  return useQuery({
    queryKey: ["wishlists"],
    queryFn: () => getWishlists(),
  });
};

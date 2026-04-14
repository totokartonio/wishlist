import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../api/items";

export const useItems = (wishlistId: string) => {
  return useQuery({
    queryKey: ["items", wishlistId],
    queryFn: () => getItems(wishlistId),
  });
};

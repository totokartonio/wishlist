import { useQuery } from "@tanstack/react-query";
import { getItems } from "../api/items";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });
};

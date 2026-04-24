import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unclaimItem } from "../../api/items";

export const useUnclaimItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { wishlistId: string; id: string }) =>
      unclaimItem(variables.wishlistId, variables.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

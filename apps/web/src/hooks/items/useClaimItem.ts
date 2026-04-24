import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimItem } from "../../api/items";

export const useClaimItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { wishlistId: string; id: string }) =>
      claimItem(variables.wishlistId, variables.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

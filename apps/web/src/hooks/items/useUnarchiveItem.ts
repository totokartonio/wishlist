import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unarchiveItem } from "../../api/items";

export const useUnarchiveItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { wishlistId: string; id: string }) =>
      unarchiveItem(variables.wishlistId, variables.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

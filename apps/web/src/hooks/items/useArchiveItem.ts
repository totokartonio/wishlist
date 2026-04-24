import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveItem } from "../../api/items";

export const useArchiveItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { wishlistId: string; id: string }) =>
      archiveItem(variables.wishlistId, variables.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

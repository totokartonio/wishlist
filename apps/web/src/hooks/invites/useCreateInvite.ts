import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvite } from "../../api/invites";

export const useCreateInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wishlistId: string) => createInvite(wishlistId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invites"] }),
  });
};

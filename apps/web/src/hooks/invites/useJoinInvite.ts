import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinInvite } from "../../api/invites";

export const useJoinInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => joinInvite(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });
};

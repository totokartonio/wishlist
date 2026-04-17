import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCollaborator } from "../../api/collaborators";

export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { wishlistId: string; id: string }) =>
      removeCollaborator(variables.wishlistId, variables.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["collaborators"] }),
  });
};

import { useMutation } from "@tanstack/react-query";
import { removeCollaborator } from "../../api/collaborators";

export const useRemoveCollaborator = () => {
  return useMutation({
    mutationFn: (variables: { wishlistId: string; id: string }) =>
      removeCollaborator(variables.wishlistId, variables.id),
  });
};

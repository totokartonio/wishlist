import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCollaborator } from "../../api/collaborators";

export const useUpdateCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { wishlistId: string; id: string; role: string }) =>
      updateCollaborator(variables.wishlistId, variables.id, variables.role),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["collaborators"] }),
  });
};

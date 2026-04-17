import { useQuery } from "@tanstack/react-query";
import { getCollaborators } from "../../api/collaborators";

export const useCollaborators = (wishlistId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["collaborators", wishlistId],
    queryFn: () => getCollaborators(wishlistId),
    enabled,
  });
};

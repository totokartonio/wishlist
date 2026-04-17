import { useQuery } from "@tanstack/react-query";
import { getInvite } from "../../api/invites";

export const useInvite = (token: string) => {
  return useQuery({
    queryKey: ["invites", token],
    queryFn: () => getInvite(token),
  });
};

import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/users";

export const useGetUser = (userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId),
    enabled,
  });
};

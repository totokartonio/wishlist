import { redirect } from "@tanstack/react-router";
import { authClient } from "./auth-client";

export const requireAuth = async () => {
  const { data: session } = await authClient.getSession();
  if (!session) {
    throw redirect({ to: "/login" });
  }
};

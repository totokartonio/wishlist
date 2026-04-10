import { createFileRoute, redirect } from "@tanstack/react-router";
import Wishlist from "../components/Wishlist";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: Wishlist,
});

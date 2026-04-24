import { createFileRoute, redirect } from "@tanstack/react-router";
import Login from "../components/Login";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Login,
});

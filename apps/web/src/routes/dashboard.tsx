import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth-guard";
import Dashboard from "../components/Dashboard";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireAuth,
  component: Dashboard,
});

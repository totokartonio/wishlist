import { createFileRoute } from "@tanstack/react-router";
import InvitePage from "../components/InvitePage";

export const Route = createFileRoute("/invites/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useParams();
  return <InvitePage token={token} />;
}

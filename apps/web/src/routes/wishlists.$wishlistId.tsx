import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth-guard";
import Wishlist from "../components/Wishlist";

export const Route = createFileRoute("/wishlists/$wishlistId")({
  beforeLoad: requireAuth,
  component: RouteComponent,
});

function RouteComponent() {
  const { wishlistId } = Route.useParams();
  return <Wishlist wishlistId={wishlistId} />;
}

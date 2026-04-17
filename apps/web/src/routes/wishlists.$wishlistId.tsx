import { createFileRoute } from "@tanstack/react-router";
import Wishlist from "../components/Wishlist";

export const Route = createFileRoute("/wishlists/$wishlistId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { wishlistId } = Route.useParams();
  return <Wishlist wishlistId={wishlistId} />;
}

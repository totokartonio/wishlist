import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Wishlist App</h1>
      <button onClick={() => navigate({ to: "/login" })}>Get started</button>
    </div>
  );
}

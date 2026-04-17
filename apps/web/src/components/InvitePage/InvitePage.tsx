import { useNavigate, Link } from "@tanstack/react-router";
import { useInvite } from "../../hooks/invites/useInvite";
import { useJoinInvite } from "../../hooks/invites/useJoinInvite";
import { useSession } from "../../lib/auth-client";

type Props = {
  token: string;
};

const InvitePage = ({ token }: Props) => {
  const navigate = useNavigate();

  const { data: invite, isLoading, isError } = useInvite(token);
  const { data: session } = useSession();
  const { mutate: joinInvite } = useJoinInvite();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Invite not found or has expired.</p>;
  if (!invite) return null;

  if (!session) {
    return (
      <div>
        <p>To join {invite.wishlist.name} you need to log in</p>
        <Link to="/login">Log in</Link>
      </div>
    );
  }

  const handleJoin = () => {
    joinInvite(token, {
      onSuccess: () =>
        navigate({
          to: "/wishlists/$wishlistId",
          params: { wishlistId: invite.wishlist.id },
        }),
      onError: (error) => {
        if (error.message.includes("400")) {
          navigate({
            to: "/wishlists/$wishlistId",
            params: { wishlistId: invite.wishlist.id },
          });
        }
      },
    });
  };

  return (
    <div>
      <h1>{invite.wishlist.name}</h1>
      {invite.wishlist.description && <p>{invite.wishlist.description}</p>}
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export { InvitePage };

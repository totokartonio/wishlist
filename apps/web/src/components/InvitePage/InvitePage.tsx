import { useNavigate } from "@tanstack/react-router";
import { useInvite } from "../../hooks/invites/useInvite";
import { useJoinInvite } from "../../hooks/invites/useJoinInvite";
import { useSession } from "../../lib/auth-client";
import styles from "./InvitePage.module.css";
import Card from "../ui/Card";
import { Button } from "../ui/Button/Button";
import { LinkButton } from "../ui/Button/LinkButton";

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
    <div className={styles.page}>
      <Card color="secondary" className={styles.card}>
        <h1>Join Wishlist</h1>
        {session ? (
          <>
            <p>
              You were invited to join <strong>{invite.wishlist.name}</strong>
            </p>
            {invite.wishlist.description && (
              <p>{invite.wishlist.description}</p>
            )}
            <Button variant="raised" color="primary" onClick={handleJoin}>
              Join
            </Button>
          </>
        ) : (
          <>
            <p>
              To join <strong>{invite.wishlist.name}</strong> you need to log in
            </p>
            <LinkButton variant="raised" color="primary" to="/login">
              Log in
            </LinkButton>
          </>
        )}
      </Card>
    </div>
  );
};

export { InvitePage };

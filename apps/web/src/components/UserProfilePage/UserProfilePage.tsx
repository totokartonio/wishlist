import { useGetUser } from "../../hooks/users/useGetUser";
import { useGetUserWishlist } from "../../hooks/users/useGetUserWishlists";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "../../lib/auth-client";
import { useEffect } from "react";
import styles from "./UserProfilePage.module.css";
import WishlistsGrid from "../WishlistsGrid";

type Props = {
  userId: string;
};

const UserProfilePage = ({ userId }: Props) => {
  const { data: user, isError, isLoading } = useGetUser(userId, true);
  const { data: wishlists } = useGetUserWishlist(userId);
  const { data: session } = useSession();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id === session?.user.id) navigate({ to: "/dashboard" });
  }, [user, session, navigate]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;
  if (!user) return <p>User doesn't exist</p>;

  return (
    <div className={styles.wrapper}>
      <h1>{user.name}</h1>
      <section className={styles.section}>
        <h2>Wishlists</h2>
        {wishlists ? (
          <WishlistsGrid
            color="primary"
            wishlists={wishlists.map((w) => ({
              ...w,
              role: "viewer" as const,
            }))}
          />
        ) : (
          "No wishlists found"
        )}
      </section>
    </div>
  );
};

export { UserProfilePage };

import { useGetUser } from "../../hooks/users/useGetUser";
import { useGetUserWishlist } from "../../hooks/users/useGetUserWishlists";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "../../lib/auth-client";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

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
    <>
      <h1>{user.name}</h1>
      <div>
        <h2>Wishlists</h2>
        {wishlists ? (
          <ul>
            {wishlists.map((wishlist) => (
              <li key={wishlist.id}>
                <Link
                  to="/wishlists/$wishlistId"
                  params={{ wishlistId: wishlist.id }}
                >
                  {wishlist.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          "No wishlists found"
        )}
      </div>
    </>
  );
};

export { UserProfilePage };

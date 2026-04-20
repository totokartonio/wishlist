import type { WishlistVisibility, UserProfile } from "@wishlist/types";
import { Link } from "@tanstack/react-router";

type Props = {
  name: string;
  visibility: WishlistVisibility;
  created: string;
  owner?: UserProfile;
};

const Info = ({ name, visibility, created, owner }: Props) => {
  return (
    <section>
      <h2>{name}</h2>
      <ul>
        <li>{visibility}</li>
        <li>{created}</li>
        {owner && (
          <li>
            Created by{" "}
            {
              <Link to="/users/$userId" params={{ userId: owner.id }}>
                {owner.name}
              </Link>
            }
          </li>
        )}
      </ul>
    </section>
  );
};

export { Info };

import type { WishlistWithRole } from "@wishlist/types";
import Card from "../ui/Card";
import styles from "./WishlistGrid.module.css";
import { Link } from "@tanstack/react-router";
import Badge from "../ui/Badge";

type Props = {
  wishlists: WishlistWithRole[];
  color: "primary" | "secondary";
};

const WishlistsGrid = ({ wishlists, color }: Props) => {
  return (
    <Card
      color={color === "primary" ? "secondary" : "primary"}
      className={styles.grid}
    >
      {wishlists.map((wishlist) => (
        <Link
          className={styles.container}
          to="/wishlists/$wishlistId"
          params={{ wishlistId: wishlist.id }}
          key={wishlist.id}
        >
          <Card variant="raised" color={color} className={styles.card}>
            <div className={styles.innerContainer}>
              <h3 className={styles.heading}>{wishlist.name}</h3>
              <Badge variant={color === "primary" ? "secondary" : "primary"}>
                {" "}
                {wishlist.visibility.charAt(0).toUpperCase() +
                  wishlist.visibility.slice(1)}
              </Badge>
            </div>
            {wishlist.description && (
              <p className={styles.description}>{wishlist.description}</p>
            )}
          </Card>
        </Link>
      ))}
    </Card>
  );
};

export { WishlistsGrid };

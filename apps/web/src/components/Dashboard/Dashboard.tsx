import { useCreateWishlist } from "../../hooks/wishlists/useCreateWishlist";
import { useWishlists } from "../../hooks/wishlists/useWishlists";
import { useState } from "react";
import type { CreateWishlistDto } from "@wishlist/types";
import WishlistModal from "../WishlistModal";
import WishlistsGrid from "../WishlistsGrid";
import { Button } from "../ui/Button/Button";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: wishlists = [], isLoading, isError } = useWishlists();
  const { mutate: createWishlist } = useCreateWishlist();

  const ownedWishlists = wishlists.filter((w) => w.role === "owner");
  const sharedWishlists = wishlists.filter((w) => w.role !== "owner");

  const handleAdd = (newWishlist: CreateWishlistDto) => {
    createWishlist(newWishlist, { onSuccess: () => setShowModal(false) });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <Button
          variant="raised"
          color="primary"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Create wishlist
        </Button>
      </div>
      <section className={styles.section}>
        <h2>My Wishlists</h2>
        {ownedWishlists.length > 0 ? (
          <WishlistsGrid color="primary" wishlists={ownedWishlists} />
        ) : (
          <Button
            variant="raised"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Create your first wishlist
          </Button>
        )}
      </section>
      {sharedWishlists.length > 0 && (
        <section className={styles.section}>
          <h2>Shared with me</h2>
          <WishlistsGrid color="secondary" wishlists={sharedWishlists} />
        </section>
      )}
      {showModal && (
        <WishlistModal
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
          mode="add"
        />
      )}
    </div>
  );
};

export { Dashboard };

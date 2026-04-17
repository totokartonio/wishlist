import { useCreateWishlist } from "../../hooks/wishlists/useCreateWishlist";
import { useWishlists } from "../../hooks/wishlists/useWishlists";
import WishlistsTable from "./atoms/WishlistsTable";
import { useState } from "react";
import { useUpdateWishlist } from "../../hooks/wishlists/useUpdateWishlist";
import { useDeleteWishlist } from "../../hooks/wishlists/useDeleteWishlist";
import type { Wishlist, CreateWishlistDto } from "@wishlist/types";
import AddWishlistModal from "./atoms/AddWishlistModal";

const Dashboard = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingWishlistId, setEditingWishlistId] = useState<string | null>(
    null,
  );

  const { data: wishlists = [], isLoading, isError } = useWishlists();
  const { mutate: createWishlist } = useCreateWishlist();
  const { mutate: updateWishlist } = useUpdateWishlist();
  const { mutate: deleteWishlist } = useDeleteWishlist();

  const ownedWishlists = wishlists.filter((w) => w.role === "owner");
  const sharedWishlists = wishlists.filter((w) => w.role !== "owner");

  const editingWishlist = editingWishlistId
    ? wishlists.find((wishlist) => wishlist.id === editingWishlistId)
    : null;

  const handleAdd = (newWishlist: CreateWishlistDto) => {
    createWishlist(newWishlist, { onSuccess: () => setShowModal(false) });
  };

  const handleUpdate = (updatedWishlist: Wishlist) => {
    if (!editingWishlistId) return;
    updateWishlist(
      {
        id: editingWishlistId,
        dto: {
          ...updatedWishlist,
          description: updatedWishlist.description ?? undefined,
        },
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setEditingWishlistId(null);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteWishlist(id);
  };

  const handleEdit = (id: string) => {
    setEditingWishlistId(id);
    setShowModal(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <>
      <h1>Dashboard</h1>
      <div>
        <h2>My Wishlists</h2>
        <button
          onClick={() => {
            setEditingWishlistId(null);
            setShowModal(true);
          }}
        >
          Create wishlist
        </button>
        <WishlistsTable
          wishlists={ownedWishlists}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {sharedWishlists.length > 0 && (
        <div>
          <h2>Shared with me</h2>
          <WishlistsTable wishlists={sharedWishlists} />
        </div>
      )}
      {showModal && (
        <AddWishlistModal
          wishlist={editingWishlist || undefined}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export { Dashboard };

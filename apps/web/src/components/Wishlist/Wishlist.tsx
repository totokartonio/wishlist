import styles from "./Wishlist.module.css";
import { useState } from "react";
import type { CreateItemDto, Item, ItemStatus } from "@wishlist/types";
import AddItemModal from "./atoms/AddItemModal";
import ItemsTable from "./atoms/ItemsTable";
import { useWishlist } from "../../hooks/wishlists/useWishlist";
import { useItems } from "../../hooks/items/useItems";
import { useCreateItem } from "../../hooks/items/useCreateItem";
import { useUpdateItem } from "../../hooks/items/useUpdateItem";
import { useDeleteItem } from "../../hooks/items/useDeleteItem";
import Sidebar from "./atoms/Sidebar";
import { useCollaborators } from "../../hooks/collaborators/useCollaborators";
import { useCreateInvite } from "../../hooks/invites/useCreateInvite";
import { useGetUser } from "../../hooks/users/useGetUser";
import { ApiError } from "../../lib/apiError";

type Props = {
  wishlistId: string;
};

const Wishlist = ({ wishlistId }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [inviteUrl, setInviteUrl] = useState<string | undefined>(undefined);

  const { data: items = [], isLoading, isError } = useItems(wishlistId);
  const { mutate: createItem } = useCreateItem();
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: deleteItem } = useDeleteItem();

  const {
    data: wishlist,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
    error: wishlistError,
  } = useWishlist(wishlistId);

  const enabled = !!wishlist;
  const { data: collaborators } = useCollaborators(wishlistId, enabled);
  const { data: user } = useGetUser(wishlist?.ownerId ?? "", enabled);

  const { mutate: createInvite } = useCreateInvite();

  const handleGenerateInvite = () => {
    createInvite(wishlistId, {
      onSuccess: (data) => setInviteUrl(data.url),
    });
  };

  const isOwner = wishlist?.role === "owner";
  const canEdit = wishlist?.role === "owner" || wishlist?.role === "editor";

  const editingItem = editingItemId
    ? items.find((item) => item.id === editingItemId)
    : null;

  const handleAdd = (newItem: CreateItemDto) => {
    createItem(
      { wishlistId, dto: newItem },
      { onSuccess: () => setShowModal(false) },
    );
  };

  const handleUpdate = (updatedItem: Item) => {
    if (!editingItemId) return;
    updateItem(
      { wishlistId, id: editingItemId, dto: updatedItem },
      {
        onSuccess: () => {
          setShowModal(false);
          setEditingItemId(null);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteItem({ wishlistId, id });
  };

  const handleEdit = (id: string) => {
    setEditingItemId(id);
    setShowModal(true);
  };

  const handleChangeStatus = (id: string, status: ItemStatus) => {
    updateItem({ wishlistId, id, dto: { status } });
  };

  if (isLoading || isWishlistLoading) return <p>Loading...</p>;

  if (isWishlistError) {
    if (wishlistError instanceof ApiError && wishlistError.status === 403) {
      return <p>You don't have access to this wishlist.</p>;
    }
    if (wishlistError instanceof ApiError && wishlistError.status === 404) {
      return <p>Wishlist not found.</p>;
    }
    return <p>Something went wrong.</p>;
  }

  if (isError) return <p>Something went wrong.</p>;
  if (!wishlist) return <p>Wishlist not found.</p>;

  return (
    <div className={styles.container}>
      <h1>{wishlist.name}</h1>
      {canEdit && (
        <button
          onClick={() => setShowModal(true)}
          data-testid="wishlist-add-button"
        >
          Add Item
        </button>
      )}
      <button onClick={() => setShowSidebar(true)}>Manage</button>
      <ItemsTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
        canEdit={canEdit}
      />
      {showSidebar && (
        <Sidebar
          isOwner={isOwner}
          owner={user}
          name={wishlist.name}
          visibility={wishlist.visibility}
          created={wishlist.createdAt}
          collaborators={collaborators}
          url={inviteUrl}
          wishlistId={wishlistId}
          onGenerate={handleGenerateInvite}
          onClose={() => setShowSidebar(false)}
        />
      )}
      {showModal && (
        <AddItemModal
          item={editingItem || undefined}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export { Wishlist };

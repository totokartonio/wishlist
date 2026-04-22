import styles from "./Wishlist.module.css";
import { useState } from "react";
import AddItemModal from "./atoms/AddItemModal";
import ItemsTable from "./atoms/ItemsTable";
import { useWishlist } from "../../hooks/wishlists/useWishlist";
import { useItems } from "../../hooks/items/useItems";
import Sidebar from "./atoms/Sidebar";
import { useCollaborators } from "../../hooks/collaborators/useCollaborators";
import { useCreateInvite } from "../../hooks/invites/useCreateInvite";
import { useGetUser } from "../../hooks/users/useGetUser";
import { ApiError } from "../../lib/apiError";
import WishlistModal from "../WishlistModal";
import { useItemActions } from "../../hooks/items/useItemsActions";
import { useWishlistActions } from "../../hooks/wishlists/useWishlistActions";
import DeleteModal from "./atoms/DeleteModal";
import type { ModalMode } from "@wishlist/types";
import { Button } from "../ui/Button/Button";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";

type Props = {
  wishlistId: string;
};

const WishlistPage = ({ wishlistId }: Props) => {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [inviteUrl, setInviteUrl] = useState<string | undefined>(undefined);

  const { data: items = [], isLoading, isError } = useItems(wishlistId);

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

  const {
    editingItemId,
    handleAdd,
    handleUpdateItem,
    handleDeleteItem,
    handleEditItem,
    handleDeleteItemWithConfirm,
    handleChangeStatus,
  } = useItemActions({ wishlistId, setModalMode });

  const { handleUpdateWishlist, handleDeleteWishlist, handleEditWishlist } =
    useWishlistActions({ wishlist, setModalMode });

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
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>{wishlist.name}</h1>
        <button
          onClick={() => setShowSidebar(true)}
          className={styles.iconButton}
        >
          <span>Manage</span> <GearIcon size={24} />
        </button>
      </div>
      {canEdit && (
        <Button
          variant="raised"
          color="primary"
          onClick={() => setModalMode("addItem")}
          data-testid="wishlist-add-button"
          className={styles.addButton}
        >
          Add Wish
        </Button>
      )}
      <ItemsTable
        items={items}
        onEdit={handleEditItem}
        onDelete={handleDeleteItemWithConfirm}
        onChangeStatus={handleChangeStatus}
        canEdit={canEdit}
      />
      {showSidebar && (
        <Sidebar
          isOwner={isOwner}
          canEdit={canEdit}
          owner={user}
          name={wishlist.name}
          visibility={wishlist.visibility}
          created={wishlist.createdAt}
          collaborators={collaborators}
          url={inviteUrl}
          wishlistId={wishlistId}
          onGenerate={handleGenerateInvite}
          onClose={() => setShowSidebar(false)}
          onEdit={handleEditWishlist}
          onDelete={() => setModalMode("deleteWishlist")}
        />
      )}
      {modalMode === "addItem" && (
        <AddItemModal
          item={editingItem || undefined}
          onAdd={handleAdd}
          onUpdate={handleUpdateItem}
          onClose={() => setModalMode(null)}
        />
      )}
      {modalMode === "editWishlist" && (
        <WishlistModal
          wishlist={wishlist}
          mode="edit"
          onClose={() => setModalMode(null)}
          onUpdate={handleUpdateWishlist}
        />
      )}
      {(modalMode === "deleteItem" || modalMode === "deleteWishlist") && (
        <DeleteModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onDelete={
            modalMode === "deleteItem"
              ? () => {
                  if (editingItemId) handleDeleteItem(editingItemId);
                  setModalMode(null);
                }
              : () => {
                  handleDeleteWishlist();
                  setModalMode(null);
                }
          }
        />
      )}
    </div>
  );
};

export { WishlistPage };

import styles from "./Wishlist.module.css";
import { useState } from "react";
import ItemModal from "./atoms/ItemModal";
import ItemsTable from "./atoms/ItemsTable";
import { useWishlist } from "../../hooks/wishlists/useWishlist";
import { useItems } from "../../hooks/items/useItems";
import { useSession } from "../../lib/auth-client";
import Sidebar from "./atoms/Sidebar";
import { useCollaborators } from "../../hooks/collaborators/useCollaborators";
import { useCreateInvite } from "../../hooks/invites/useCreateInvite";
import { useGetUser } from "../../hooks/users/useGetUser";
import { ApiError } from "../../lib/apiError";
import WishlistModal from "../WishlistModal";
import { useItemActions } from "../../hooks/items/useItemsActions";
import { useWishlistActions } from "../../hooks/wishlists/useWishlistActions";
import type { ModalMode } from "@wishlist/types";
import { Button } from "../ui/Button/Button";
import ConfirmationModal from "../ui/ConfirmationModal";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import type { Wishlist } from "@wishlist/types";

type Props = {
  wishlistId: string;
};

const WishlistPage = ({ wishlistId }: Props) => {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [inviteUrl, setInviteUrl] = useState<string | undefined>(undefined);
  const [pendingWishlistUpdate, setPendingWishlistUpdate] =
    useState<Wishlist | null>(null);

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
  const { data: session } = useSession();

  const { mutate: createInvite } = useCreateInvite();

  const {
    editingItemId,
    handleAdd,
    handleUpdateItem,
    handleDeleteItem,
    handleEditItem,
    handleDeleteItemWithConfirm,
    handleClaimItem,
    handleUnclaimItem,
    handleResetClaim,
    handleArchiveItem,
    handleUnarchiveItem,
  } = useItemActions({ wishlistId, setModalMode });

  const {
    handleUpdateWishlist,
    handleDeleteWishlist,
    handleEditWishlist,
    handleLeave,
  } = useWishlistActions({ wishlist, setModalMode });

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
  const showClaim = !isOwner || !wishlist.hideClaimsFromOwner;

  const handleSaveWishlist = (updatedWishlist: Wishlist) => {
    const isGoingPrivate =
      updatedWishlist.visibility === "private" &&
      wishlist?.visibility !== "private";
    const hasCollaborators = (collaborators?.length ?? 0) > 0;

    if (isGoingPrivate && hasCollaborators) {
      setPendingWishlistUpdate(updatedWishlist);
      setModalMode("confirmPrivate");
      return;
    }

    handleUpdateWishlist(updatedWishlist);
  };

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
        onClaim={handleClaimItem}
        onUnclaim={handleUnclaimItem}
        onArchive={handleArchiveItem}
        onUnarchive={handleUnarchiveItem}
        userId={session?.user.id ?? null}
        canEdit={canEdit}
        showClaim={showClaim}
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
          onDelete={() => setModalMode("confirmDeleteWishlist")}
          onLeave={() => setModalMode("confirmLeave")}
        />
      )}
      {modalMode === "addItem" && (
        <ItemModal
          mode="add"
          onAdd={handleAdd}
          onClose={() => setModalMode(null)}
        />
      )}
      {modalMode === "editItem" && editingItem && (
        <ItemModal
          mode="edit"
          item={editingItem}
          onUpdate={handleUpdateItem}
          onClose={() => setModalMode(null)}
          onResetClaim={() => editingItemId && handleResetClaim(editingItemId)}
          onArchive={() => editingItemId && handleArchiveItem(editingItemId)}
          onUnarchive={() =>
            editingItemId && handleUnarchiveItem(editingItemId)
          }
          canEdit={canEdit}
        />
      )}
      {modalMode === "editWishlist" && (
        <WishlistModal
          wishlist={wishlist}
          mode="edit"
          onClose={() => setModalMode(null)}
          onUpdate={handleSaveWishlist}
        />
      )}
      {modalMode === "confirmDeleteItem" && (
        <ConfirmationModal
          title={"Delete Wish?"}
          message={"Are you sure you want to delete this wish?"}
          onConfirm={() => {
            if (editingItemId) handleDeleteItem(editingItemId);
            setModalMode(null);
          }}
          onClose={() => setModalMode(null)}
        />
      )}
      {modalMode === "confirmDeleteWishlist" && (
        <ConfirmationModal
          title={"Delete Wishlist?"}
          message={"Are you sure you want to delete this wishlist?"}
          onConfirm={() => {
            handleDeleteWishlist();
            setModalMode(null);
          }}
          onClose={() => setModalMode(null)}
        />
      )}
      {modalMode === "confirmPrivate" && (
        <ConfirmationModal
          title="Make wishlist private?"
          message={`This will remove all collaborators and invalidate all invite links.`}
          onConfirm={() => {
            if (pendingWishlistUpdate)
              handleUpdateWishlist(pendingWishlistUpdate);
            setPendingWishlistUpdate(null);
            setModalMode(null);
          }}
          onClose={() => {
            setPendingWishlistUpdate(null);
            setModalMode(null);
          }}
        />
      )}
      {modalMode === "confirmLeave" && (
        <ConfirmationModal
          title="Leave wishlist?"
          message="You will lose access to this wishlist. Any items you claimed will be released."
          onConfirm={() => {
            if (session?.user.id) handleLeave(session.user.id);
            setModalMode(null);
          }}
          onClose={() => setModalMode(null)}
        />
      )}
    </div>
  );
};

export { WishlistPage };

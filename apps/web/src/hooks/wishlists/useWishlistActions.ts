import type { Wishlist, ModalMode } from "@wishlist/types";
import { useUpdateWishlist } from "./useUpdateWishlist";
import { useDeleteWishlist } from "./useDeleteWishlist";
import { useNavigate } from "@tanstack/react-router";
import { useRemoveCollaborator } from "../collaborators/useRemoveCollaborator";

type Props = {
  wishlist: Wishlist | undefined;
  setModalMode: (mode: ModalMode) => void;
};

export const useWishlistActions = ({ wishlist, setModalMode }: Props) => {
  const navigate = useNavigate();
  const { mutate: updateWishlist } = useUpdateWishlist();
  const { mutate: deleteWishlist } = useDeleteWishlist();
  const { mutate: removeCollaborator } = useRemoveCollaborator();

  const handleUpdateWishlist = (updatedWishlist: Wishlist) => {
    if (!wishlist) return;
    updateWishlist(
      {
        id: wishlist.id,
        dto: {
          name: updatedWishlist.name,
          description: updatedWishlist.description ?? undefined,
          visibility: updatedWishlist.visibility,
          hideClaimsFromOwner: updatedWishlist.hideClaimsFromOwner,
        },
      },
      { onSuccess: () => setModalMode(null) },
    );
  };

  const handleDeleteWishlist = () => {
    if (!wishlist) return;
    deleteWishlist(wishlist.id, {
      onSuccess: () => navigate({ to: "/dashboard" }),
    });
  };

  const handleEditWishlist = () => {
    setModalMode("editWishlist");
  };

  const handleLeave = (userId: string) => {
    if (!wishlist) return;
    removeCollaborator(
      { wishlistId: wishlist.id, id: userId },
      { onSuccess: () => navigate({ to: "/dashboard" }) },
    );
  };

  return {
    handleUpdateWishlist,
    handleDeleteWishlist,
    handleEditWishlist,
    handleLeave,
  };
};

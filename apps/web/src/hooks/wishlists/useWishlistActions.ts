import type { Wishlist, ModalMode } from "@wishlist/types";
import { useUpdateWishlist } from "./useUpdateWishlist";
import { useDeleteWishlist } from "./useDeleteWishlist";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  wishlist: Wishlist | undefined;
  setModalMode: (mode: ModalMode) => void;
};

export const useWishlistActions = ({ wishlist, setModalMode }: Props) => {
  const navigate = useNavigate();
  const { mutate: updateWishlist } = useUpdateWishlist();
  const { mutate: deleteWishlist } = useDeleteWishlist();

  const handleUpdateWishlist = (updatedWishlist: Wishlist) => {
    if (!wishlist) return;
    updateWishlist(
      {
        id: wishlist.id,
        dto: {
          name: updatedWishlist.name,
          description: updatedWishlist.description ?? undefined,
          visibility: updatedWishlist.visibility,
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

  return {
    handleUpdateWishlist,
    handleDeleteWishlist,
    handleEditWishlist,
  };
};

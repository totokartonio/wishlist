import { useState } from "react";
import type { CreateItemDto, Item, UpdateItemDto } from "@wishlist/types";
import { useCreateItem } from "./useCreateItem";
import { useUpdateItem } from "./useUpdateItem";
import { useDeleteItem } from "./useDeleteItem";
import { useClaimItem } from "./useClaimItem";
import { useUnclaimItem } from "./useUnclaimItem";
import { useArchiveItem } from "./useArchiveItem";
import { useUnarchiveItem } from "./useUnarchiveItem";
import { useSession, signIn } from "../../lib/auth-client";
import { type ModalMode } from "@wishlist/types";

type Props = {
  wishlistId: string;
  setModalMode: (mode: ModalMode) => void;
};

export const useItemActions = ({ wishlistId, setModalMode }: Props) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const { data: session } = useSession();
  const { mutate: createItem } = useCreateItem();
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: deleteItem } = useDeleteItem();
  const { mutate: claimItem } = useClaimItem();
  const { mutate: unclaimItem } = useUnclaimItem();
  const { mutate: archiveItem } = useArchiveItem();
  const { mutate: unarchiveItem } = useUnarchiveItem();

  const handleAdd = (newItem: CreateItemDto) => {
    createItem(
      { wishlistId, dto: newItem },
      { onSuccess: () => setModalMode(null) },
    );
  };

  const handleUpdateItem = (updatedItem: Item) => {
    if (!editingItemId) return;

    const dto: UpdateItemDto = {
      image: updatedItem.image,
      name: updatedItem.name,
      price: updatedItem.price,
      currency: updatedItem.currency,
      status: updatedItem.status,
      link: updatedItem.link,
    };

    updateItem(
      { wishlistId, id: editingItemId, dto },
      {
        onSuccess: () => {
          setModalMode(null);
          setEditingItemId(null);
        },
      },
    );
  };

  const handleDeleteItem = (id: string) => {
    deleteItem({ wishlistId, id });
  };

  const handleEditItem = (id: string) => {
    setEditingItemId(id);
    setModalMode("editItem");
  };

  const handleDeleteItemWithConfirm = (id: string) => {
    setEditingItemId(id);
    setModalMode("confirmDeleteItem");
  };

  const handleClaimItem = async (id: string) => {
    if (!session) {
      try {
        await signIn.anonymous();
      } catch {
        return;
      }
    }
    claimItem({ wishlistId, id });
  };

  const handleUnclaimItem = (id: string) => {
    unclaimItem({ wishlistId, id });
  };

  const handleResetClaim = (id: string) => {
    updateItem({ wishlistId, id, dto: { status: "want" } });
  };

  const handleArchiveItem = (id: string) => {
    archiveItem({ wishlistId, id });
  };

  const handleUnarchiveItem = (id: string) => {
    unarchiveItem({ wishlistId, id });
  };

  return {
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
  };
};

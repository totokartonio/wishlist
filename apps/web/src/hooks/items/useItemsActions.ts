import { useState } from "react";
import type { CreateItemDto, Item, ItemStatus } from "@wishlist/types";
import { useCreateItem } from "./useCreateItem";
import { useUpdateItem } from "./useUpdateItem";
import { useDeleteItem } from "./useDeleteItem";

type ModalMode =
  | "addItem"
  | "editWishlist"
  | "deleteItem"
  | "deleteWishlist"
  | null;

type Props = {
  wishlistId: string;
  setModalMode: (mode: ModalMode) => void;
};

export const useItemActions = ({ wishlistId, setModalMode }: Props) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const { mutate: createItem } = useCreateItem();
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: deleteItem } = useDeleteItem();

  const handleAdd = (newItem: CreateItemDto) => {
    createItem(
      { wishlistId, dto: newItem },
      { onSuccess: () => setModalMode(null) },
    );
  };

  const handleUpdateItem = (updatedItem: Item) => {
    if (!editingItemId) return;
    updateItem(
      { wishlistId, id: editingItemId, dto: updatedItem },
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
    setModalMode("addItem");
  };

  const handleDeleteItemWithConfirm = (id: string) => {
    setEditingItemId(id);
    setModalMode("deleteItem");
  };

  const handleChangeStatus = (id: string, status: ItemStatus) => {
    updateItem({ wishlistId, id, dto: { status } });
  };

  return {
    editingItemId,
    handleAdd,
    handleUpdateItem,
    handleDeleteItem,
    handleEditItem,
    handleDeleteItemWithConfirm,
    handleChangeStatus,
  };
};

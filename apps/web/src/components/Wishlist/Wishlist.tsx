import styles from "./Wishlist.module.css";
import { useState } from "react";
import type { Item, ItemStatus } from "@wishlist/types";
import AddItemModal from "./atoms/AddItemModal";
import ItemsTable from "./atoms/ItemsTable";
import { useItems } from "../../hooks/useItems";
import { useCreateItem } from "../../hooks/useCreateItem";
import { useUpdateItem } from "../../hooks/useUpdateItem";
import { useDeleteItem } from "../../hooks/useDeleteItem";

const Wishlist = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const { data: items = [], isLoading, isError } = useItems();
  const { mutate: createItem } = useCreateItem();
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: deleteItem } = useDeleteItem();

  const editingItem = editingItemId
    ? items.find((item) => item.id === editingItemId)
    : null;

  const handleAdd = (newItem: Item) => {
    createItem(newItem, { onSuccess: () => setShowModal(false) });
  };

  const handleUpdate = (updatedItem: Item) => {
    if (!editingItemId) return;
    updateItem(
      { id: editingItemId, dto: updatedItem },
      {
        onSuccess: () => {
          setShowModal(false);
          setEditingItemId(null);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
  };

  const handleEdit = (id: string) => {
    setEditingItemId(id);
    setShowModal(true);
  };

  const handleChangeStatus = (id: string, status: ItemStatus) => {
    updateItem({ id, dto: { status } });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div className={styles.container}>
      <h1>Wishlist</h1>
      <button
        onClick={() => setShowModal(true)}
        data-testid="wishlist-add-button"
      >
        Add Item
      </button>
      <ItemsTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
      />
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

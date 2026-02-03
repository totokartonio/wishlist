import styles from "./Wishlist.module.css";
import { useState } from "react";
import type { Item } from "../../types";
import { items as initialItems } from "../../data";
import AddItemModal from "./atoms/AddItemModal";
import ItemsTable from "./atoms/ItemsTable";

const Wishlist = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const editingItem = editingItemId
    ? items.find((item) => item.id === editingItemId)
    : null;

  const handleAdd = (newItem: Item) => {
    const newItems = [...items, newItem];
    setItems(newItems);
  };

  const handleUpdate = (updatedItem: Item) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    setItems(updatedItems);
    setEditingItemId(null);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);

    setItems(newItems);
  };

  const handleEdit = (id: string) => {
    setEditingItemId(id);
    setShowModal(true);
  };

  return (
    <div className={styles.container}>
      <h1>Wishlist</h1>
      <button
        onClick={() => setShowModal(true)}
        data-testid="wishlist-add-button"
      >
        Add Item
      </button>
      <ItemsTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
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

import styles from "./AddItemModal.module.css";
import { useState, type SubmitEventHandler } from "react";
import type { Item } from "../../../../types";
import Modal from "../../../ui/Modal";

type FormData = {
  name: string;
  price: string;
  link: string;
};

type Props = {
  item?: Item;
  onAdd: (item: Item) => void;
  onUpdate: (item: Item) => void;
  onClose: () => void;
};

const defaultFormData: FormData = {
  name: "",
  price: "",
  link: "",
};

const AddItemModal = ({ item, onAdd, onUpdate, onClose }: Props) => {
  const [formData, setFormData] = useState(
    item
      ? { name: item.name, price: item.price, link: item.link }
      : defaultFormData,
  );

  const isEditing = !!item;
  const title = isEditing ? "Edit Item" : "New Item";
  const buttonText = isEditing ? "Save Changes" : "Add Item";

  const handleOnSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.price || !formData.link) return;

    if (isEditing && item) {
      const updatedItem: Item = { ...item, ...formData };

      onUpdate(updatedItem);

      return;
    }

    const newItem: Item = {
      id: crypto.randomUUID(),
      image: "Image",
      status: "want",
      ...formData,
    };

    onAdd(newItem);

    setFormData(defaultFormData);
    onClose();
  };
  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleOnSubmit} className={styles.form}>
        <h2>{title}</h2>
        <div className={styles.field}>
          <label htmlFor="item-name">Name</label>
          <input
            type="text"
            id="item-name"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="item-price">Price</label>
          <input
            type="text"
            id="item-price"
            value={formData.price}
            onChange={(event) =>
              setFormData({ ...formData, price: event.target.value })
            }
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="item-link">Link</label>
          <input
            type="text"
            id="item-link"
            value={formData.link}
            onChange={(event) =>
              setFormData({ ...formData, link: event.target.value })
            }
          />
        </div>
        <button type="submit">{buttonText}</button>
      </form>
    </Modal>
  );
};

export { AddItemModal };

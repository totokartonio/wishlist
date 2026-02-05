import styles from "./AddItemModal.module.css";
import { useState, type SubmitEventHandler } from "react";
import { CURRENCIES } from "../../../../types";
import type { Currency, Item } from "../../../../types";
import Modal from "../../../ui/Modal";

type FormData = {
  name: string;
  price: number;
  currency: Currency;
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
  price: 0,
  currency: "USD",
  link: "",
};

const AddItemModal = ({ item, onAdd, onUpdate, onClose }: Props) => {
  const [formData, setFormData] = useState(
    item
      ? {
          name: item.name,
          price: item.price,
          currency: item.currency,
          link: item.link,
        }
      : defaultFormData,
  );
  const [error, setError] = useState<boolean>(false);

  const isEditing = !!item;
  const title = isEditing ? "Edit Item" : "New Item";
  const buttonText = isEditing ? "Save Changes" : "Add Item";

  const handleOnSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.price || !formData.link) {
      setError(true);
      return;
    }

    if (isEditing && item) {
      const updatedItem: Item = { ...item, ...formData };

      onUpdate(updatedItem);

      onClose();

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
      <form onSubmit={handleOnSubmit} className={styles.form} noValidate>
        <h2>{title}</h2>
        {error && (
          <div
            role="alert"
            className={styles.formError}
            data-testid="error-message"
          >
            Please fill all fields
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor="item-name">Name</label>
          <input
            type="text"
            id="item-name"
            data-testid="add-item-modal-name-input"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
            onBlur={() => setError(false)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="item-price">Price</label>
          <input
            type="number"
            min={0}
            step={0.01}
            id="item-price"
            data-testid="add-item-modal-price-input"
            value={formData.price}
            onChange={(event) =>
              setFormData({ ...formData, price: Number(event.target.value) })
            }
            onBlur={() => setError(false)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="item-currency">Currency</label>
          <select
            id="item-currency"
            data-testid="add-item-modal-currency-select"
            value={formData.currency}
            onChange={(event) =>
              setFormData({
                ...formData,
                currency: event.target.value as Currency,
              })
            }
            onBlur={() => setError(false)}
            required
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="item-link">Link</label>
          <input
            type="text"
            id="item-link"
            data-testid="add-item-modal-link-input"
            value={formData.link}
            onChange={(event) =>
              setFormData({ ...formData, link: event.target.value })
            }
            onBlur={() => setError(false)}
            required
          />
        </div>
        <button type="submit" data-testid="add-item-modal-submit-button">
          {buttonText}
        </button>
      </form>
    </Modal>
  );
};

export { AddItemModal };

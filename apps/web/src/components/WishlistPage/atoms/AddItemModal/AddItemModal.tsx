import styles from "./AddItemModal.module.css";
import { useState, type SubmitEventHandler } from "react";
import { CURRENCIES, type CreateItemDto } from "@wishlist/types";
import type { Currency, Item } from "@wishlist/types";
import Modal from "../../../ui/Modal";
import { Button } from "../../../ui/Button/Button";
import Select from "../../../ui/Select";
import Input from "../../../ui/Input";

type FormData = {
  name: string;
  price: string;
  currency: Currency | null;
  link: string;
};

type Props = {
  item?: Item;
  onAdd: (item: CreateItemDto) => void;
  onUpdate: (item: Item) => void;
  onClose: () => void;
};

const defaultFormData: FormData = {
  name: "",
  price: "",
  currency: null,
  link: "",
};

const AddItemModal = ({ item, onAdd, onUpdate, onClose }: Props) => {
  const [formData, setFormData] = useState(
    item
      ? {
          name: item.name,
          price: item.price === 0 ? "" : String(item.price),
          currency: item.currency,
          link: item.link,
        }
      : defaultFormData,
  );
  const [error, setError] = useState<boolean>(false);

  const isEditing = !!item;
  const title = isEditing ? "Edit Item" : "New Item";
  const buttonText = isEditing ? "Save Changes" : "Add Item";

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!formData.name) {
      setError(true);
      return;
    }

    if (isEditing && item) {
      const updatedItem: Item = {
        ...item,
        ...formData,
        price: formData.price === "" ? 0 : Number(formData.price),
      };

      onUpdate(updatedItem);

      onClose();

      return;
    }

    const newItem: CreateItemDto = {
      image: "Image",
      status: "want",
      ...formData,
      price: formData.price === "" ? 0 : Number(formData.price),
    };

    onAdd(newItem);

    setFormData(defaultFormData);
    onClose();
  };
  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
        <Input
          label="Name:"
          type="text"
          id="item-name"
          data-testid="add-item-modal-name-input"
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          onBlur={() => setError(false)}
          required
          className={styles.input}
        />
        <Input
          label="Price:"
          type="number"
          min={0}
          step={0.01}
          id="item-price"
          data-testid="add-item-modal-price-input"
          value={formData.price}
          onChange={(event) =>
            setFormData({ ...formData, price: event.target.value })
          }
          onBlur={() => setError(false)}
        />
        <Select
          label="Currency:"
          id="item-currency"
          data-testid="add-item-modal-currency-select"
          value={formData.currency ?? ""}
          onChange={(event) =>
            setFormData({
              ...formData,
              currency:
                event.target.value === ""
                  ? null
                  : (event.target.value as Currency),
            })
          }
          onBlur={() => setError(false)}
          required
        >
          <option value="">—</option>
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <Input
          label="Link:"
          type="text"
          id="item-link"
          data-testid="add-item-modal-link-input"
          value={formData.link}
          onChange={(event) =>
            setFormData({ ...formData, link: event.target.value })
          }
          onBlur={() => setError(false)}
        />
        <Button
          variant="flat"
          color="primary"
          type="submit"
          data-testid="add-item-modal-submit-button"
        >
          {buttonText}
        </Button>
      </form>
    </Modal>
  );
};

export { AddItemModal };

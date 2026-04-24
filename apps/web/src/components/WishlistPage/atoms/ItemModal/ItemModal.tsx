import styles from "./ItemModal.module.css";
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
  onClose: () => void;
} & (
  | {
      mode: "add";
      onAdd: (item: CreateItemDto) => void;
      item?: never;
      onUpdate?: never;
      canEdit?: never;
      onResetClaim?: never;
      onArchive?: never;
      onUnarchive?: never;
    }
  | {
      mode: "edit";
      onUpdate: (item: Item) => void;
      item: Item;
      canEdit: boolean;
      onResetClaim: () => void;
      onArchive: () => void;
      onUnarchive: () => void;
      onAdd?: never;
    }
);

const defaultFormData: FormData = {
  name: "",
  price: "",
  currency: null,
  link: "",
};

const ItemModal = ({
  mode,
  item,
  canEdit,
  onAdd,
  onUpdate,
  onClose,
  onResetClaim,
  onArchive,
  onUnarchive,
}: Props) => {
  const [formData, setFormData] = useState<FormData>(
    mode === "edit"
      ? {
          name: item.name,
          price: item.price === 0 ? "" : String(item.price),
          currency: item.currency,
          link: item.link,
        }
      : defaultFormData,
  );
  const [error, setError] = useState<boolean>(false);
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);

  const isEditing = mode === "edit";
  const title = isEditing ? "Edit Wish" : "New Wish";
  const buttonText = isEditing ? "Save Changes" : "Add Wish";

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
        {isEditing && canEdit && (
          <>
            {confirmingReset ? (
              <div className={styles.claimReset}>
                <p className={styles.message}>
                  This will release the current claim. Are you sure?
                </p>
                <div className={styles.buttonGroup}>
                  <Button
                    variant="ghost"
                    color="primary"
                    type="button"
                    onClick={() => {
                      onResetClaim();
                      setConfirmingReset(false);
                    }}
                  >
                    Yes, release claim
                  </Button>
                  <Button
                    variant="flat"
                    color="secondary"
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.claimReset}>
                <p className={styles.message}>
                  If the wish was claimed, this will release it.
                </p>
                <div className={styles.buttonGroup}>
                  <Button
                    variant="ghost"
                    color="primary"
                    type="button"
                    onClick={() => setConfirmingReset(true)}
                  >
                    Reset claim
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {(!isEditing || canEdit) && (
          <div className={styles.footer}>
            <div className={styles.buttonGroup}>
              {isEditing && (
                <Button
                  variant="flat"
                  color="secondary"
                  type="button"
                  onClick={item.archived ? onUnarchive : onArchive}
                >
                  {item.archived ? "Unarchive" : "Archive"}
                </Button>
              )}
              <Button
                variant="flat"
                color="primary"
                type="submit"
                data-testid="add-item-modal-submit-button"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export { ItemModal };

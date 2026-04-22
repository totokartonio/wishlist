import {
  type Wishlist,
  type WishlistVisibility,
  WISHLIST_VISIBILITY,
  type CreateWishlistDto,
} from "@wishlist/types";
import Modal from "../ui/Modal";
import { useState, type SubmitEventHandler } from "react";
import styles from "./WishlistModal.module.css";
import { Button } from "../ui/Button/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

type Props = {
  onClose: () => void;
} & (
  | {
      mode: "add";
      onAdd: (wishlist: CreateWishlistDto) => void;
      wishlist?: never;
      onUpdate?: never;
    }
  | {
      mode: "edit";
      wishlist: Wishlist;
      onUpdate: (wishlist: Wishlist) => void;
      onAdd?: never;
    }
);

type FormData = {
  name: string;
  description: string;
  visibility: WishlistVisibility;
};

const defaultFormData: FormData = {
  name: "",
  description: "",
  visibility: "private",
};

const WishlistModal = ({ onClose, mode, wishlist, onAdd, onUpdate }: Props) => {
  const [formData, setFormData] = useState<FormData>(
    mode === "edit"
      ? {
          name: wishlist.name,
          description: wishlist.description ?? "",
          visibility: wishlist.visibility,
        }
      : defaultFormData,
  );
  const [error, setError] = useState<boolean>(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.visibility) {
      setError(true);
      return;
    }

    if (mode === "edit") {
      onUpdate({ ...wishlist, ...formData });
      onClose();
      return;
    }

    onAdd({
      name: formData.name,
      description: formData.description || undefined,
      visibility: formData.visibility,
    });

    setFormData(defaultFormData);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2>{mode === "edit" ? "Edit Wishlist" : "New Wishlist"}</h2>
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
          label="Name"
          type="text"
          id="wishlist-name"
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          onBlur={() => setError(false)}
          required
        />
        <Input
          label="Description"
          type="text"
          id="wishlist-description"
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
          onBlur={() => setError(false)}
        />
        <Select
          label="Visibility"
          id="wishlist-visibility"
          value={formData.visibility}
          onChange={(event) =>
            setFormData({
              ...formData,
              visibility: event.target.value as WishlistVisibility,
            })
          }
        >
          {WISHLIST_VISIBILITY.map((visibility) => (
            <option key={visibility} value={visibility}>
              {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
            </option>
          ))}
        </Select>
        <Button variant="flat" color="primary" type="submit">
          {mode === "edit" ? "Save Changes" : "Add Wishlist"}
        </Button>
      </form>
    </Modal>
  );
};

export { WishlistModal };

import {
  type Wishlist,
  type WishlistVisibility,
  WISHLIST_VISIBILITY,
  type CreateWishlistDto,
} from "@wishlist/types";
import Modal from "../../../../components/ui/Modal";
import { useState, type SubmitEventHandler } from "react";
import styles from "./AddWishlistModal.module.css";

type Props = {
  wishlist?: Wishlist;
  onClose: () => void;
  onUpdate: (Wishlist: Wishlist) => void;
  onAdd: (wishlist: CreateWishlistDto) => void;
};

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

const AddWishlistModal = ({ wishlist, onClose, onUpdate, onAdd }: Props) => {
  const [formData, setFormData] = useState(
    wishlist
      ? {
          name: wishlist.name,
          description: wishlist.description,
          visibility: wishlist.visibility,
        }
      : defaultFormData,
  );
  const [error, setError] = useState<boolean>(false);

  const isEditing = !!wishlist;
  const title = isEditing ? "Edit Wishlist" : "New Wishlist";
  const buttonText = isEditing ? "Save Changes" : "Add Wishlist";

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.visibility) {
      setError(true);
      return;
    }

    if (isEditing && wishlist) {
      const updatedWishlist: Wishlist = { ...wishlist, ...formData };

      onUpdate(updatedWishlist);

      onClose();

      return;
    }

    const newWishlist: CreateWishlistDto = {
      name: formData.name,
      description: formData.description || undefined,
      visibility: formData.visibility,
    };

    onAdd(newWishlist);

    setFormData(defaultFormData);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
          <label htmlFor="wishlist-name">Name</label>
          <input
            type="text"
            id="wishlist-name"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
            onBlur={() => setError(false)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="wishlist-description">Description</label>
          <input
            type="text"
            id="wishlist-description"
            value={formData.description || ""}
            onChange={(event) =>
              setFormData({ ...formData, description: event.target.value })
            }
            onBlur={() => setError(false)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="wishlist-visibility">Visibility</label>
          <select
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
          </select>
        </div>
        <button type="submit">{buttonText}</button>
      </form>
    </Modal>
  );
};

export { AddWishlistModal };

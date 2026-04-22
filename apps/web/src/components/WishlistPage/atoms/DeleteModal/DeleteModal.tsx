import { Button } from "../../../ui/Button/Button";
import Modal from "../../../ui/Modal";
import styles from "./DeleteModal.module.css";

type Props = {
  mode: "deleteItem" | "deleteWishlist";
  onClose: () => void;
  onDelete: () => void;
};

const DeleteModal = ({ mode, onClose, onDelete }: Props) => {
  return (
    <Modal onClose={onClose}>
      <h2>Delete {mode === "deleteItem" ? "Item" : "Wishlist"}</h2>
      <p>
        Are you sure you want to delete this{" "}
        {mode === "deleteItem" ? "item" : "wishlist"}?
      </p>
      <div className={styles.buttonGroup}>
        <Button variant="flat" color="primary" onClick={onDelete}>
          Yes
        </Button>
        <Button variant="ghost" color="secondary" onClick={onClose}>
          No
        </Button>
      </div>
    </Modal>
  );
};

export { DeleteModal };

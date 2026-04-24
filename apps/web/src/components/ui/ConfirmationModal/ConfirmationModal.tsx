import { Button } from "../Button/Button";
import Modal from "../Modal";
import styles from "./ConfirmationModal.module.css";

type Props = {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

const ConfirmationModal = ({
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = "Yes",
  cancelLabel = "No",
}: Props) => {
  return (
    <Modal onClose={onClose}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className={styles.buttonGroup}>
        <Button variant="flat" color="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="ghost" color="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
};

export { ConfirmationModal };

import type { ReactNode } from "react";
import styles from "./Modal.module.css";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ onClose, children }: Props) => {
  return createPortal(
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
        role="presentation"
        data-testid="modal-backdrop"
      />
      <div className={styles.modal}>
        <div className={styles.container}>
          <button
            onClick={onClose}
            className={styles.closeButton}
            data-testid="modal-close-button"
            aria-label="Close modal"
          >
            <XIcon size={18} />
          </button>
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
};

export { Modal };

import type { ReactNode } from "react";
import styles from "./Modal.module.css";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";

type Props = {
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ onClose, children }: Props) => {
  return (
    <>
      <div className={styles.backdrop} onClick={onClose} role="presentation" />
      <div className={styles.modal}>
        <div className={styles.container}>
          <button onClick={onClose} className={styles.closeButton}>
            <XIcon size={18} />
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export { Modal };

import styles from "./Drawer.module.css";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";

type Props = {
  onClose: () => void;
  className?: string;
  children: ReactNode;
};

const Drawer = ({ onClose, className, children }: Props) => {
  return createPortal(
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
        role="presentation"
        data-testid="modal-backdrop"
      />
      <div className={`${styles.drawer} ${className ?? ""}`}>
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>
          <Button
            type="button"
            variant="ghost"
            color="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </>,
    document.body,
  );
};

export { Drawer };

import Modal from "../../../components/ui/Modal";
import styles from "./LogOutModal.module.css";
import { Button } from "../../../components/ui/Button/Button";

type Props = {
  onClose: () => void;
  onLogout: () => void;
};

const LogOutModal = ({ onClose, onLogout }: Props) => {
  return (
    <Modal onClose={onClose}>
      <h2>Log Out</h2>
      <p>Are you sure you want to log out?</p>
      <div className={styles.buttonGroup}>
        <Button variant="ghost" color="secondary" onClick={onClose}>
          No
        </Button>
        <Button variant="flat" color="primary" onClick={onLogout}>
          Yes
        </Button>
      </div>
    </Modal>
  );
};

export { LogOutModal };

import Modal from "../../../components/ui/Modal";
import styles from "./LogOutModal.module.css";

type Props = {
  onClose: () => void;
  onLogout: () => void;
};

const LogOutModal = ({ onClose, onLogout }: Props) => {
  return (
    <Modal onClose={onClose}>
      <h2>Log out</h2>
      <p>Are you sure you want to log out?</p>
      <div className={styles.buttonGroup}>
        <button onClick={onClose}>No</button>
        <button onClick={onLogout}>Yes</button>
      </div>
    </Modal>
  );
};

export { LogOutModal };

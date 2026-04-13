import { useNavigate } from "@tanstack/react-router";
import styles from "./Header.module.css";
import { useSession, signOut } from "../../lib/auth-client";
import { useState } from "react";
import LogOutModal from "./LogOutModal";

const Header = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const { data: session } = useSession();
  const loggedIn = !!session;
  const userName = session?.user.name;

  const handleClick = async () => {
    if (loggedIn) {
      setShowModal(true);
      return;
    }
    navigate({ to: "/login" });
  };
  const handleLogout = async () => {
    await signOut();
    setShowModal(false);
    navigate({ to: "/login" });
  };

  return (
    <div className={styles.header}>
      <div>Logo</div>
      <nav className={styles.navBar}>
        {loggedIn && <div>{userName}</div>}
        <button onClick={handleClick}>{loggedIn ? "Log out" : "Log in"}</button>
      </nav>
      {showModal && (
        <LogOutModal
          onClose={() => setShowModal(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export { Header };

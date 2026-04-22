import { Link, useNavigate } from "@tanstack/react-router";
import styles from "./Header.module.css";
import { useSession, signOut } from "../../lib/auth-client";
import { useState } from "react";
import LogOutModal from "./LogOutModal";
import { Button } from "../ui/Button/Button";

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
      <div className={styles.logo}>Logo</div>
      <nav className={styles.navBar}>
        {loggedIn && (
          <div>
            <Link to="/dashboard">{userName}</Link>
          </div>
        )}
        <Button
          onClick={handleClick}
          size="sm"
          variant={loggedIn ? "ghost" : "flat"}
          color={loggedIn ? "secondary" : "primary"}
        >
          {loggedIn ? "Log out" : "Log in"}
        </Button>
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

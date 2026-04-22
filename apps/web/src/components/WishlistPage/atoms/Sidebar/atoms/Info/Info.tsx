import type { WishlistVisibility, UserProfile } from "@wishlist/types";
import { Link } from "@tanstack/react-router";
import { UserIcon } from "@phosphor-icons/react/dist/csr/User";
import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { CalendarIcon } from "@phosphor-icons/react/dist/csr/Calendar";
import { PencilIcon } from "@phosphor-icons/react/dist/csr/Pencil";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import styles from "./Info.module.css";

type Props = {
  name: string;
  visibility: WishlistVisibility;
  created: string;
  owner?: UserProfile;
  isOwner: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const Info = ({
  name,
  visibility,
  created,
  owner,
  canEdit,
  isOwner,
  onEdit,
  onDelete,
}: Props) => {
  const formattedDate = new Date(created).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>{name}</h2>
        {canEdit && (
          <div className={styles.buttonGroup}>
            <button
              className={styles.iconButton}
              aria-label="Edit"
              onClick={onEdit}
            >
              <PencilIcon size={18} />
            </button>
            {isOwner && (
              <button
                className={styles.iconButton}
                aria-label="Delete"
                onClick={onDelete}
              >
                <TrashIcon size={18} />
              </button>
            )}
          </div>
        )}
      </div>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <EyeIcon className={styles.icon} size={20} />
          <div>{visibility.charAt(0).toUpperCase() + visibility.slice(1)}</div>
        </li>
        <li className={styles.listItem}>
          <CalendarIcon className={styles.icon} size={20} />
          <div>{formattedDate}</div>
        </li>
        {owner && (
          <li className={styles.listItem}>
            <UserIcon className={styles.icon} size={20} />
            <div>
              {
                <Link to="/users/$userId" params={{ userId: owner.id }}>
                  {owner.name}
                </Link>
              }
            </div>
          </li>
        )}
      </ul>
    </section>
  );
};

export { Info };

import styles from "../ItemsTable.module.css";
import { PencilIcon } from "@phosphor-icons/react/dist/csr/Pencil";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { ArchiveIcon } from "@phosphor-icons/react/dist/csr/Archive";
import type { Item } from "@wishlist/types";

type Props = {
  item: Item;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
};

const Actions = ({ item, onEdit, onDelete, onArchive, onUnarchive }: Props) => {
  return (
    <div className={styles.buttonGroup}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Edit"
        onClick={() => onEdit(item.id)}
        data-testid="items-table-edit-button"
      >
        <PencilIcon size={22} className={styles.editIcon} />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Delete"
        onClick={() => onDelete(item.id)}
        data-testid="items-table-delete-button"
      >
        <TrashIcon size={22} className={styles.deleteIcon} />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label={item.archived ? "Unarchive" : "Archive"}
        onClick={() =>
          item.archived ? onUnarchive(item.id) : onArchive(item.id)
        }
        data-testid="items-table-archive-button"
      >
        <ArchiveIcon size={22} className={styles.archiveIcon} />
      </button>
    </div>
  );
};

export { Actions };

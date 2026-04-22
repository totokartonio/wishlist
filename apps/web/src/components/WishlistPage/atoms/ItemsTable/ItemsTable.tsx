import type { ChangeEvent } from "react";
import { ITEM_STATUSES, type Item, type ItemStatus } from "@wishlist/types";
import styles from "./ItemsTable.module.css";
import { CURRENCY_SYMBOLS } from "../../../../data";
import { PencilIcon } from "@phosphor-icons/react/dist/csr/Pencil";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import Select from "../../../ui/Select";

type Props = {
  items: Item[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: ItemStatus) => void;
  canEdit: boolean;
};

const ItemsTable = ({
  items,
  onEdit,
  onDelete,
  onChangeStatus,
  canEdit,
}: Props) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>, id: string) => {
    const newStatus = event.target.value as ItemStatus;
    onChangeStatus(id, newStatus);
  };
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr data-testid="items-table-header-row">
            <th aria-label="Preview" />
            <th className={styles.nameCell}>Item Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Link</th>
            {canEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} data-testid="items-table-body-row">
              <td>
                <div className={styles.placeholder} />
              </td>
              <td className={styles.nameCell}>{item.name}</td>
              <td>
                {item.price === 0 && !item.currency
                  ? "—"
                  : item.currency
                    ? CURRENCY_SYMBOLS[item.currency] + item.price
                    : item.price}
              </td>
              <td>
                <Select
                  id={`select-item-status-${item.id}`}
                  value={item.status}
                  data-testid="items-table-status"
                  onChange={(event) => handleChange(event, item.id)}
                  className={styles.select}
                >
                  {ITEM_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </Select>
              </td>
              <td>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    data-testid="items-table-link"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                ) : (
                  "—"
                )}
              </td>
              {canEdit && (
                <td>
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
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ItemsTable };

import type { ChangeEvent } from "react";
import {
  ITEM_STATUSES,
  type Item,
  type Currency,
  type ItemStatus,
} from "../../../../types";
import styles from "./ItemsTable.module.css";

type Props = {
  items: Item[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: ItemStatus) => void;
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  RUB: "₽",
};

const ItemsTable = ({ items, onEdit, onDelete, onChangeStatus }: Props) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>, id: string) => {
    const newStatus = event.target.value as ItemStatus;
    onChangeStatus(id, newStatus);
  };
  return (
    <table className={styles.table}>
      <thead>
        <tr data-testid="items-table-header-row">
          <th aria-label="Preview" />
          <th>Item Name</th>
          <th>Price</th>
          <th>Status</th>
          <th>Link</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} data-testid="items-table-body-row">
            <td>{item.image}</td>
            <td>{item.name}</td>
            <td>{CURRENCY_SYMBOLS[item.currency] + item.price}</td>
            <td>
              <select
                value={item.status}
                data-testid="items-table-status"
                onChange={(event) => handleChange(event, item.id)}
              >
                {ITEM_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <a
                href={item.link}
                target="_blank"
                data-testid="items-table-link"
              >
                Open
              </a>
            </td>
            <td>
              <button
                type="button"
                onClick={() => onEdit(item.id)}
                data-testid="items-table-edit-button"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                data-testid="items-table-delete-button"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { ItemsTable };

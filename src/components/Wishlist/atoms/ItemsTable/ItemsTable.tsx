import type { Item } from "../../../../types";
import styles from "./ItemsTable.module.css";

type Props = {
  items: Item[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const ItemsTable = ({ items, onEdit, onDelete }: Props) => {
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
            <td>{item.price}</td>
            <td>
              <select
                defaultValue={item.status}
                data-testid="items-table-status"
              >
                <option value="want">Want</option>
                <option value="bought">Bought</option>
                <option value="archived">Archived</option>
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

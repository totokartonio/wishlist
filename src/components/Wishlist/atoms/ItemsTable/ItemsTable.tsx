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
        <tr>
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
          <tr key={item.id}>
            <td>{item.image}</td>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>
              <select defaultValue={item.status}>
                <option value="want">Want</option>
                <option value="bought">Bought</option>
                <option value="archived">Archived</option>
              </select>
            </td>
            <td>
              <a href={item.link} target="_blank">
                Open
              </a>
            </td>
            <td>
              <button type="button" onClick={() => onEdit(item.id)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(item.id)}>
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

import { type Item } from "@wishlist/types";
import styles from "./ItemsTable.module.css";
import { CURRENCY_SYMBOLS } from "../../../../data";
import { ClaimButton } from "./atoms/ClaimButton";
import { Actions } from "./atoms/Actions";

type Props = {
  items: Item[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClaim: (id: string) => void;
  onUnclaim: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  userId: string | null;
  canEdit: boolean;
  showClaim: boolean;
};

const ItemsTable = ({
  items,
  onEdit,
  onDelete,
  onClaim,
  onUnclaim,
  onArchive,
  onUnarchive,
  userId,
  canEdit,
  showClaim,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr data-testid="items-table-header-row">
            <th aria-label="Preview" />
            <th className={styles.nameCell}>Item Name</th>
            <th>Price</th>
            {showClaim && <th>Status</th>}
            <th>Link</th>
            {canEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              data-testid="items-table-body-row"
              className={item.archived ? styles.archived : ""}
            >
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
              {showClaim && (
                <td>
                  <ClaimButton
                    item={item}
                    userId={userId}
                    onClaim={onClaim}
                    onUnclaim={onUnclaim}
                  />
                </td>
              )}
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
                  <Actions
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onArchive={onArchive}
                    onUnarchive={onUnarchive}
                  />
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

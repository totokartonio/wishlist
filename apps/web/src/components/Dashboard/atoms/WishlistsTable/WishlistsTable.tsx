import type { WishlistWithRole } from "@wishlist/types";
import { Link } from "@tanstack/react-router";

type Props = {
  wishlists: WishlistWithRole[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const WishlistsTable = ({ onEdit, onDelete, wishlists }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Visibility</th>
          {onEdit && onDelete && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {wishlists.map((wishlist) => (
          <tr key={wishlist.id}>
            <td>
              <Link
                to="/wishlists/$wishlistId"
                params={{ wishlistId: wishlist.id }}
              >
                {wishlist.name}
              </Link>
            </td>
            <td>{wishlist.description}</td>
            <td>
              {wishlist.visibility.charAt(0).toUpperCase() +
                wishlist.visibility.slice(1)}
            </td>
            {onEdit && onDelete && (
              <td>
                <button onClick={() => onEdit(wishlist.id)}>Edit</button>
                <button onClick={() => onDelete(wishlist.id)}>Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { WishlistsTable };

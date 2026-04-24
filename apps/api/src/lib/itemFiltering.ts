import type { Item, WishlistRole } from "@wishlist/types";

/**
 * Filter items for a given requester based on their role and the wishlist's
 * surprise mode setting.
 *
 * Rules:
 * - Archived items are hidden from viewers and anonymous requesters
 * - When surprise mode is on, owners see claimed items as "want" status
 * - claimedByUserId is only visible to the claimer themselves
 */
type FilterableItem = {
  archived: boolean;
  status: string;
  claimedByUserId: string | null;
};

export const filterItemsForRole = <T extends FilterableItem>(
  items: T[],
  role: WishlistRole,
  hideClaimsFromOwner: boolean,
  requesterId: string | null,
): T[] => {
  return items
    .filter((item) => {
      if (item.archived && role !== "owner" && role !== "editor") {
        return false;
      }
      return true;
    })
    .map((item) => {
      const hideClaim =
        role === "owner" && hideClaimsFromOwner && item.status === "claimed";

      return {
        ...item,
        status: hideClaim ? "want" : item.status,
        claimedByUserId:
          item.claimedByUserId === requesterId ? item.claimedByUserId : null,
      };
    });
};

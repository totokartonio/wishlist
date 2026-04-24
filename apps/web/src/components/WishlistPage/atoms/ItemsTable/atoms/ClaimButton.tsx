import { Button } from "../../../../ui/Button/Button";
import type { Item } from "@wishlist/types";

type Props = {
  item: Item;
  userId: string | null;
  onClaim: (id: string) => void;
  onUnclaim: (id: string) => void;
};

const ClaimButton = ({ item, userId, onClaim, onUnclaim }: Props) => {
  const claimedByMe =
    item.claimedByUserId !== null && item.claimedByUserId === userId;
  const claimedBySomeoneElse = item.claimedByUserId !== null && !claimedByMe;

  return (
    <Button
      variant="ghost"
      color="primary"
      type="button"
      disabled={claimedBySomeoneElse}
      onClick={() => (claimedByMe ? onUnclaim(item.id) : onClaim(item.id))}
      data-testid="items-table-claim-button"
    >
      {claimedByMe ? "Unclaim" : claimedBySomeoneElse ? "Claimed" : "Claim"}
    </Button>
  );
};

export { ClaimButton };

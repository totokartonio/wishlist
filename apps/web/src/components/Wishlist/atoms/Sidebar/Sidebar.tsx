import type {
  Collaborator,
  UserProfile,
  WishlistVisibility,
} from "@wishlist/types";
import Info from "./atoms/Info";
import Collaborators from "./atoms/Collaborators";
import InviteLink from "./atoms/InviteLink";

type Props = {
  isOwner: boolean;
  owner?: UserProfile;
  name: string;
  visibility: WishlistVisibility;
  created: string;
  collaborators: Collaborator[] | undefined;
  url?: string;
  onGenerate: () => void;
  onClose: () => void;
  wishlistId: string;
};

const Sidebar = ({
  isOwner,
  owner,
  name,
  visibility,
  created,
  collaborators,
  url,
  wishlistId,
  onGenerate,
  onClose,
}: Props) => {
  return (
    <aside data-testid="wishlist-sidebar">
      <Info
        name={name}
        visibility={visibility}
        created={created}
        owner={owner}
      />
      <Collaborators
        isOwner={isOwner}
        collaborators={collaborators}
        wishlistId={wishlistId}
      />
      {isOwner && visibility === "invite" && (
        <InviteLink url={url} onGenerate={onGenerate} />
      )}
      <button onClick={onClose}>Close</button>
    </aside>
  );
};

export { Sidebar };

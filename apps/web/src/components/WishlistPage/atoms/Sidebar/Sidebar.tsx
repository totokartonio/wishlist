import type {
  Collaborator,
  UserProfile,
  WishlistVisibility,
} from "@wishlist/types";
import Info from "./atoms/Info";
import Collaborators from "./atoms/Collaborators";
import InviteLink from "./atoms/InviteLink";
import Drawer from "../../../ui/Drawer";

type Props = {
  isOwner: boolean;
  canEdit: boolean;
  owner?: UserProfile;
  name: string;
  visibility: WishlistVisibility;
  created: string;
  collaborators: Collaborator[] | undefined;
  url?: string;
  onGenerate: () => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  wishlistId: string;
};

const Sidebar = ({
  isOwner,
  canEdit,
  owner,
  name,
  visibility,
  created,
  collaborators,
  url,
  wishlistId,
  onGenerate,
  onClose,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Drawer onClose={onClose}>
      <aside data-testid="wishlist-sidebar">
        <Info
          name={name}
          visibility={visibility}
          created={created}
          owner={owner}
          isOwner={isOwner}
          canEdit={canEdit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <Collaborators
          isOwner={isOwner}
          collaborators={collaborators}
          wishlistId={wishlistId}
        />
        {isOwner && visibility === "invite" && (
          <InviteLink url={url} onGenerate={onGenerate} />
        )}
      </aside>
    </Drawer>
  );
};

export { Sidebar };

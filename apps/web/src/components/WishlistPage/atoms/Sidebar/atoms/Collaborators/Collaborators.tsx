import type { Collaborator } from "@wishlist/types";
import { useRemoveCollaborator } from "../../../../../../hooks/collaborators/useRemoveCollaborator";
import { useUpdateCollaborator } from "../../../../../../hooks/collaborators/useUpdateCollaborator";
import { RoleSelect } from "./RoleSelect";
import styles from "./Collaborators.module.css";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import Badge from "../../../../../ui/Badge";
import { Button } from "../../../../../ui/Button/Button";

type Props = {
  isOwner: boolean;
  collaborators: Collaborator[] | undefined;
  wishlistId: string;
  onLeave: () => void;
};

const Collaborators = ({
  isOwner,
  collaborators,
  wishlistId,
  onLeave,
}: Props) => {
  const { mutate: removeCollaborator } = useRemoveCollaborator();
  const { mutate: updateCollaborator } = useUpdateCollaborator();

  const handleRemove = (userId: string) => {
    removeCollaborator({ wishlistId, id: userId });
  };
  const handleUpdate = (userId: string, role: string) => {
    updateCollaborator({ wishlistId, id: userId, role });
  };
  return (
    <section className={styles.container}>
      <h3>Collaborators</h3>
      {!collaborators || collaborators.length === 0 ? (
        <p>No collaborators added</p>
      ) : (
        <ul className={styles.list}>
          {collaborators.map((collaborator) => (
            <li key={collaborator.id} className={styles.listItem}>
              <strong className={styles.name}>{collaborator.user.name}</strong>
              {isOwner ? (
                <RoleSelect
                  id={collaborator.id}
                  defaultValue={collaborator.role}
                  onUpdate={(role) => handleUpdate(collaborator.userId, role)}
                />
              ) : (
                <Badge
                  variant={collaborator.role === "editor" ? "green" : "blue"}
                >
                  {collaborator.role}
                </Badge>
              )}
              {isOwner && (
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Delete"
                  onClick={() => handleRemove(collaborator.userId)}
                >
                  <TrashIcon size={22} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!isOwner && (
        <Button
          variant="flat"
          color="secondary"
          type="button"
          onClick={onLeave}
        >
          Leave wishlist
        </Button>
      )}
    </section>
  );
};

export { Collaborators };

import type { Collaborator } from "@wishlist/types";
import { useRemoveCollaborator } from "../../../../../../hooks/collaborators/useRemoveCollaborator";
import { useUpdateCollaborator } from "../../../../../../hooks/collaborators/useUpdateCollaborator";
import { RoleSelect } from "./RoleSelect";

type Props = {
  isOwner: boolean;
  collaborators: Collaborator[] | undefined;
  wishlistId: string;
};

const Collaborators = ({ isOwner, collaborators, wishlistId }: Props) => {
  const { mutate: removeCollaborator } = useRemoveCollaborator();
  const { mutate: updateCollaborator } = useUpdateCollaborator();

  const handleRemove = (userId: string) => {
    removeCollaborator({ wishlistId, id: userId });
  };
  const handleUpdate = (userId: string, role: string) => {
    updateCollaborator({ wishlistId, id: userId, role });
  };
  return (
    <section>
      {!collaborators || collaborators.length === 0 ? (
        <p>No collaborators added</p>
      ) : (
        <ul>
          {collaborators.map((collaborator) => (
            <li key={collaborator.id}>
              <strong>{collaborator.user.name}</strong>
              {isOwner ? (
                <RoleSelect
                  defaultValue={collaborator.role}
                  onUpdate={(role) => handleUpdate(collaborator.userId, role)}
                />
              ) : (
                <span>{collaborator.role}</span>
              )}
              {isOwner && (
                <button
                  type="button"
                  onClick={() => handleRemove(collaborator.userId)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export { Collaborators };

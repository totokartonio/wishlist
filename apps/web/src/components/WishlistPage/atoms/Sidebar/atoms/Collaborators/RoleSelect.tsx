import { useState, type ChangeEvent } from "react";
import Select from "../../../../../ui/Select";
import styles from "./Collaborators.module.css";

type Props = {
  id: string;
  defaultValue: string;
  onUpdate: (role: string) => void;
};

const RoleSelect = ({ id, defaultValue, onUpdate }: Props) => {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
    onUpdate(event.target.value);
  };
  return (
    <Select
      id={`role-${id}`}
      aria-label="Role of collaborator"
      onChange={handleChange}
      value={value}
      className={styles.select}
    >
      <option value="viewer">Viewer</option>
      <option value="editor">Editor</option>
    </Select>
  );
};

export { RoleSelect };

import { useState, type ChangeEvent } from "react";

type Props = {
  defaultValue: string;
  onUpdate: (role: string) => void;
};

const RoleSelect = ({ defaultValue, onUpdate }: Props) => {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
    onUpdate(event.target.value);
  };
  return (
    <select
      aria-label="Role of collaborator"
      onChange={handleChange}
      value={value}
    >
      <option value="viewer">Viewer</option>
      <option value="editor">Editor</option>
    </select>
  );
};

export { RoleSelect };

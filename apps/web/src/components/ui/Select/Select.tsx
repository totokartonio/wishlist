import styles from "./Select.module.css";

type Props = {
  id: string;
  label?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ id, label, error, className, children, ...props }: Props) => {
  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${styles.select} ${error ? styles.selectError : ""} ${props.disabled ? styles.disabled : ""} ${className ?? ""}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span id={`${id}-error`} role="alert" className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};

export { Select };

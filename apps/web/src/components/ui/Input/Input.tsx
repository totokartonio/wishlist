import styles from "./Input.module.css";

type Props = {
  id: string;
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  id,
  label,
  error,
  rightElement,
  className,
  ...props
}: Props) => {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.innerContainer}>
        <input
          id={id}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${styles.input} ${error ? styles.inputError : ""} ${props.disabled ? styles.disabled : ""} ${rightElement ? styles.hasRightElement : ""} ${className ?? ""}`}
          {...props}
        />
        {rightElement && (
          <div className={styles.rightElement}>{rightElement}</div>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};

export { Input };

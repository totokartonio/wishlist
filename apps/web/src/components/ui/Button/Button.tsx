import styles from "./Button.module.css";

type Props = {
  variant: "raised" | "flat" | "ghost";
  color: "primary" | "secondary" | "danger";
  size?: "md" | "sm";
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant,
  color,
  size = "md",
  children,
  className,
  ...props
}: Props) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[color]} ${styles[size]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };

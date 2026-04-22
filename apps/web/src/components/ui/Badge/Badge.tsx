import styles from "./Badge.module.css";

type Props = {
  variant: "primary" | "secondary" | "neutral" | "blue" | "green";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Badge = ({ variant, className, children, ...props }: Props) => {
  return (
    <div
      className={`${styles.badge} ${styles[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };

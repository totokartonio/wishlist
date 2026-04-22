import styles from "./Card.module.css";

type Props = {
  variant?: "flat" | "raised";
  color?: "primary" | "secondary" | "neutral";
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Card = ({
  variant = "flat",
  color = "neutral",
  children,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${styles[color]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };

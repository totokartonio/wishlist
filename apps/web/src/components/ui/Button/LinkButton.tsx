import { Link, type LinkProps } from "@tanstack/react-router";
import styles from "./Button.module.css";

type Props = {
  variant: "raised" | "flat" | "ghost";
  color: "primary" | "secondary" | "danger";
  size?: "md" | "sm";
  children: React.ReactNode;
  className?: string;
} & LinkProps;

const LinkButton = ({
  variant,
  color,
  size = "md",
  children,
  className,
  ...props
}: Props) => {
  return (
    <Link
      className={`${styles.button} ${styles[variant]} ${styles[color]} ${styles[size]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export { LinkButton };

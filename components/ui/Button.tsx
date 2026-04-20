import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "ghost";

interface ButtonProps {
  variant?: Variant;
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export default function Button({
  variant = "primary",
  href,
  type = "button",
  className = "",
  children,
  onClick,
}: ButtonProps) {
  const classes = `btn btn-${variant} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

import clsx from "clsx";
import type { ReactNode } from "react";

interface BoxPropsI extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  dropShadow?: "sm" | "md" | "xl" | null;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export default function Box({
  dropShadow = null,
  size = "md",
  children,
  className,
  ...props
}: BoxPropsI) {
  const dropShadowClass = {
    sm: "drop-shadow-sm",
    md: "drop-shadow-md",
    xl: "drop-shadow-xl",
    null: "",
  }[dropShadow ?? "null"];

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "w-full",
  }[size];

  return (
    <div className={clsx(dropShadowClass, sizeClass, className)} {...props}>
      {children}
    </div>
  );
}

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonPropsT extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}
export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = true,
  loading = false,
  className,
  ...props
}: ButtonPropsT) {
  const buttonVariants = {
    primary: "bg-palatinate_blue text-white hover:bg-palatinte_blue/90",
    secondary: "bg-viridian text-white hover:bg-viridian/90",
    outline: "border border-eerie_black text-eerie_black",
    ghost: "bg-transparent text-eerie_black hover:bg-eerie_black/10",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };
  const baseButtonClass =
    "rounded-xl font-medium transition-colors duration-200";
  return (
    <button
      className={clsx(
        baseButtonClass,
        buttonVariants[variant],
        sizes[size],
        fullWidth && "w-full",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    ></button>
  );
}

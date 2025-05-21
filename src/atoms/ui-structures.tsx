import clsx from "clsx";
import type { ReactNode } from "react";

interface StackPropsI extends React.AllHTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  direction?: "row" | "col";
  justify?: "center" | "end" | "start";
  align?: "center" | "end" | "start";
}
export function Stack({
  children,
  direction = "row",
  justify = "start",
  align = "start",
  ...props
}: StackPropsI) {
  return (
    <div
      className={clsx(
        "flex",
        {
          "flex-row": direction === "row",
          "flex-col": direction === "col",
        },
        {
          "justify-start": justify === "start",
          "justify-center": justify === "center",
          "justify-end": justify === "end",
        },
        {
          "items-start": align === "start",
          "items-center": align === "center",
          "items-end": align === "end",
        }
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface GridI extends React.AllHTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  cols: number | string | string[];
  rows?: number | string | string[];
  justifyItems?: "center" | "end" | "start";
  alignItems?: "center" | "end" | "start";
}

export function Grid({
  children,
  cols,
  rows,
  justifyItems = "start",
  alignItems = "start",
  ...props
}: GridI) {
  const resolveGridTemplate = (
    value: string | number | string[] | undefined
  ) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.join(" ");
    return typeof value === "number" ? `repeat(${value}, 1fr)` : value;
  };

  return (
    <div
      className={clsx(
        "grid",
        {
          "justify-items-start": justifyItems === "start",
          "justify-items-center": justifyItems === "center",
          "justify-items-end": justifyItems === "end",
        },
        {
          "items-start": alignItems === "start",
          "items-center": alignItems === "center",
          "items-end": alignItems === "end",
        }
      )}
      style={{
        gridTemplateColumns: resolveGridTemplate(cols),
        gridTemplateRows: resolveGridTemplate(rows),
      }}
      {...props}
    >
      {children}
    </div>
  );
}

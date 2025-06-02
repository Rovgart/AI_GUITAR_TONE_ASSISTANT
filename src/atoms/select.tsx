import type React from "react";
import type { AllHTMLAttributes } from "react";

interface SelectPropsI extends AllHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
}
export default function Select() {
  return <select></select>;
}

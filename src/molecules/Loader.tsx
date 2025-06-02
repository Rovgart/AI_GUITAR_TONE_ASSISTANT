import React from "react";
import { ClipLoader } from "react-spinners";

interface LoaderProps {
  size?: number;
  color?: string;
  loading?: boolean;
  text?: string;
  overlay?: boolean;
  className?: string;
  variant?: "default" | "inline" | "button" | "full-screen";
}

export default function Loader({
  size = 40,
  color = "#3b82f6", // Default blue color
  loading = true,
  text,
  overlay = false,
  className = "",
  variant = "default",
}: LoaderProps) {
  if (!loading) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "inline":
        return "inline-flex items-center gap-2";
      case "button":
        return "inline-flex items-center justify-center gap-2 px-4 py-2";
      case "full-screen":
        return "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50";
      default:
        return "flex flex-col items-center justify-center gap-3 p-4";
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case "inline":
      case "button":
        return "text-sm";
      case "full-screen":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  return (
    <>
      {overlay && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-lg z-10" />
      )}
      <div
        className={`
          ${getVariantStyles()}
          ${overlay ? "absolute inset-0 z-20" : ""}
          ${className}
        `}
      >
        <ClipLoader color={color} size={size} />
        {text && (
          <span className={`text-gray-600 font-medium ${getTextSize()}`}>
            {text}
          </span>
        )}
      </div>
    </>
  );
}

// Specialized form loader component
export function FormLoader({
  loading = true,
  text = "Processing...",
  size = 24,
}: {
  loading?: boolean;
  text?: string;
  size?: number;
}) {
  return (
    <Loader
      loading={loading}
      text={text}
      size={size}
      variant="inline"
      className="text-blue-600"
    />
  );
}

// Button loader component
export function ButtonLoader({
  loading = true,
  text = "Loading...",
  size = 18,
  disabled = false,
  children,
  onClick,
  className = "",
  type = "button",
}: {
  loading?: boolean;
  text?: string;
  size?: number;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${
          loading || disabled
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-blue-600 hover:bg-blue-700 text-white active:transform active:scale-95"
        }
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <ClipLoader color="currentColor" size={size} />
          <span>{text}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Overlay loader for forms
export function FormOverlayLoader({
  loading = true,
  text = "Saving changes...",
}: {
  loading?: boolean;
  text?: string;
}) {
  return (
    <Loader
      loading={loading}
      text={text}
      overlay={true}
      size={32}
      className="rounded-lg"
    />
  );
}

// Full screen loader
export function FullScreenLoader({
  loading = true,
  text = "Loading application...",
}: {
  loading?: boolean;
  text?: string;
}) {
  return (
    <Loader loading={loading} text={text} variant="full-screen" size={50} />
  );
}

// Skeleton loader for forms
export function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded w-32"></div>
    </div>
  );
}

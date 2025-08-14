// components/ui/spinner.tsx
import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  let sizeClass = "w-8 h-8"; // default md
  if (size === "sm") sizeClass = "w-4 h-4";
  if (size === "lg") sizeClass = "w-12 h-12";

  return (
    <div
      className={`border-4 border-t-black border-gray-200 rounded-full transition-all duration-300 animate-spin ${sizeClass} ${className}`}
    ></div>
  );
};

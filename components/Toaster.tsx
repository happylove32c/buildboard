"use client";

import { Fragment, useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

export default function Toaster({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-gray-500";

  return (
    <div className="fixed p-4 bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded shadow-lg transition-all duration-300`}
      >
        {message}
      </div>
    </div>
  );
}

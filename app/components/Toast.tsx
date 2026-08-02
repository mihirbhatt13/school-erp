"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

let toastListeners: Array<(toast: ToastMessage) => void> = [];

export function showToast(message: string, type: "success" | "error" | "warning" | "info" = "success", title?: string) {
  const toast: ToastMessage = {
    id: Math.random().toString(36).substring(2, 9),
    message,
    type,
    title,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    toastListeners.push(handleToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const bgColors = {
          success: "bg-emerald-600 border-emerald-700 text-white shadow-emerald-600/30",
          error: "bg-rose-600 border-rose-700 text-white shadow-rose-600/30",
          warning: "bg-amber-500 border-amber-600 text-white shadow-amber-500/30",
          info: "bg-indigo-600 border-indigo-700 text-white shadow-indigo-600/30",
        };

        const icons = {
          success: "✓",
          error: "✕",
          warning: "⚠️",
          info: "ℹ️",
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 border shadow-xl flex items-start gap-3 transition-all duration-300 transform translate-y-0 animate-bounce-short ${bgColors[toast.type]}`}
          >
            <span className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {icons[toast.type]}
            </span>
            <div className="flex-1 text-xs">
              {toast.title && <strong className="block font-bold mb-0.5 text-sm">{toast.title}</strong>}
              <p className="font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white/80 hover:text-white font-bold text-xs p-1"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

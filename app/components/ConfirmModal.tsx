"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm Delete",
  cancelText = "Cancel",
  type = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const btnBg = {
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30",
    info: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30",
  };

  const iconBg = {
    danger: "bg-rose-50 border-rose-100 text-rose-600",
    warning: "bg-amber-50 border-amber-100 text-amber-600",
    info: "bg-indigo-50 border-indigo-100 text-indigo-600",
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 text-slate-800">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl font-bold flex-shrink-0 ${iconBg[type]}`}>
            {type === "danger" ? "🗑️" : type === "warning" ? "⚠️" : "ℹ️"}
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${btnBg[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

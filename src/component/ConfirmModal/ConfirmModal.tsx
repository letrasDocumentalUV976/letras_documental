"use client";

import { ReactNode } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  title,
  description,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  variant = "primary",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-primary hover:bg-primary/90";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 p-4 animate-fade-up">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md border-2 border-primary p-2 font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/3"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 rounded-md p-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 sm:w-1/3 ${confirmClasses}`}
          >
            {isLoading && (
              <AiOutlineLoading3Quarters className="animate-spin" size={18} />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

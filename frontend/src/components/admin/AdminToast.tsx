"use client";

import React from "react";

interface AdminToastProps {
  visible: boolean;
  title?: string;
  message: string;
  icon?: string;
  onClose?: () => void;
}

export default function AdminToast({
  visible,
  title,
  message,
  icon = "check_circle",
  onClose,
}: AdminToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-space-md bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-2xl transition-all duration-300 transform ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <span className="material-symbols-outlined text-secondary-fixed text-[22px]">
        {icon}
      </span>
      <div className="flex flex-col">
        {title && (
          <span className="font-label-md text-label-md font-bold">{title}</span>
        )}
        <span className="font-body-sm text-body-sm text-inverse-on-surface/90">
          {message}
        </span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-outline-variant hover:text-inverse-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}

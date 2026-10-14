"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface EditableGameProvider {
  slug: "rov" | "freefire" | "roblox";
  name: string;
  iconUrl: string;
  isActive: boolean;
}

interface GameLogoEditModalProps {
  open: boolean;
  provider: EditableGameProvider | null;
  onClose: () => void;
  onSave: (slug: "rov" | "freefire" | "roblox", data: { name: string; iconUrl: string; isActive: boolean }) => void;
}

const GAME_LOGO_PRESETS = [
  { label: "RoV Icon", url: "/game-logos/rov/rov-icon.png" },
  { label: "RoV Logo", url: "/game-logos/rov/rov-logo.png" },
  { label: "Free Fire Icon", url: "/game-logos/freefire/freefire-icon.png" },
  { label: "Free Fire Logo", url: "/game-logos/freefire/freefire-logo.png" },
  { label: "Roblox Icon", url: "/game-logos/roblox/roblox-icon.png" },
  { label: "Roblox Logo", url: "/game-logos/roblox/roblox-logo.png" },
];

export default function GameLogoEditModal({ open, provider, onClose, onSave }: GameLogoEditModalProps) {
  const { tx } = useLanguage();
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (provider) {
      setName(provider.name);
      setIconUrl(provider.iconUrl);
      setIsActive(provider.isActive);
    }
  }, [provider, open]);

  if (!open || !provider) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden">
        <div className="p-space-lg bg-surface-container-low flex items-center justify-between border-b border-surface-container">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
              {tx("Storefront Top-Up Game Logo", "โลโก้เกมเติมเงินหน้าร้าน")}
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-0.5">
              {tx(`Edit ${provider.name} Logo & Name`, `แก้ไขโลโก้และชื่อเกม ${provider.name}`)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-lg space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-white shadow-md shrink-0">
              <img src={iconUrl || "/game-logos/rov/rov-icon.png"} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="font-label-sm text-label-sm text-on-surface-variant">
                {tx("Live Preview (Used in Home 3-Card Fan & /topup)", "ตัวอย่างแสดงผลจริง (ใช้ในการ์ด 3 ใบหน้าแรก และหน้า /topup)")}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors shadow-xs">
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>{tx("Upload Logo from Computer", "อัปโหลดรูปโลโก้จากเครื่อง")}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") setIconUrl(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface font-semibold uppercase">
              {tx("Game Display Name *", "ชื่อเกมที่แสดงบนหน้าร้าน *")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-label-sm text-label-sm text-on-surface font-semibold uppercase">
              {tx("Logo Image URL or Asset Path *", "ลิงก์รูปภาพโลโก้เกม *")}
            </label>
            <input
              type="text"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="/game-logos/rov/rov-icon.png or https://..."
              className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low font-label-sm text-label-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container"
            />
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-label-sm text-[11px] text-outline">{tx("game-logos Presets:", "เลือกรูปจาก game-logos:")}</span>
              {GAME_LOGO_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setIconUrl(p.url)}
                  className={`px-2 py-0.5 rounded font-label-sm text-[11px] transition-colors ${
                    iconUrl === p.url
                      ? "bg-primary text-on-primary font-bold"
                      : "bg-surface-container text-on-surface-variant hover:bg-primary-fixed hover:text-primary"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-space-lg bg-surface-container-low flex items-center justify-end gap-space-sm border-t border-surface-container">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-sm text-label-sm hover:bg-surface-container transition-colors"
          >
            {tx("Cancel", "ยกเลิก")}
          </button>
          <button
            type="button"
            onClick={() => onSave(provider.slug, { name: name.trim() || provider.name, iconUrl: iconUrl.trim() || provider.iconUrl, isActive })}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm font-bold hover:bg-primary-container transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>{tx("Save Game Logo", "บันทึกโลโก้เกม")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

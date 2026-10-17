"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface NewGamePayload {
  name: string;
  slug: string;
  inputMode: "UID" | "ID_PASS";
  iconUrl: string;
  isActive: boolean;
}

interface GameCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewGamePayload) => Promise<void> | void;
}

const PRESET_ICONS = [
  { label: "RoV Icon", url: "/game-logos/rov/rov-icon.png" },
  { label: "Free Fire Icon", url: "/game-logos/freefire/freefire-icon.png" },
  { label: "Roblox Icon", url: "/game-logos/roblox/roblox-icon.png" },
];

export default function GameCreateModal({ open, onClose, onSave }: GameCreateModalProps) {
  const { tx } = useLanguage();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [inputMode, setInputMode] = useState<"UID" | "ID_PASS">("UID");
  const [iconUrl, setIconUrl] = useState("/game-logos/rov/rov-icon.png");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!slug || slug === autoSlug.slice(0, -1)) {
      setSlug(autoSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter game name");
      return;
    }
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug || !/^[a-z0-9_-]+$/.test(cleanSlug)) {
      alert("Please enter a valid slug (lowercase alphanumeric with hyphens or underscores)");
      return;
    }
    setSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        slug: cleanSlug,
        inputMode,
        iconUrl: iconUrl.trim() || "/game-logos/rov/rov-icon.png",
        isActive,
      });
      setName("");
      setSlug("");
      setInputMode("UID");
      setIconUrl("/game-logos/rov/rov-icon.png");
      setIsActive(true);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-space-lg bg-surface-container-low flex items-center justify-between border-b border-surface-container">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
              {tx("Top-Up Configuration", "การตั้งค่าระบบเติมเกม")}
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-0.5">
              {tx("Add New Game Title", "เพิ่มเกมใหม่ในระบบ")}
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

        <form onSubmit={handleSubmit} className="p-space-lg space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border-2 border-white shadow-md shrink-0">
              <img src={iconUrl || "/game-logos/rov/rov-icon.png"} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="font-label-sm text-label-sm text-on-surface-variant">
                {tx("Game Icon Preview", "ตัวอย่างไอคอนเกม")}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors shadow-xs">
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>{tx("Upload Icon", "อัปโหลดไอคอน")}</span>
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
              {tx("Game Name *", "ชื่อเกม *")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={tx("e.g., Genshin Impact, Valorant", "เช่น Genshin Impact, Valorant")}
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface font-semibold uppercase">
              {tx("Unique Slug (Identifier) *", "สลักระบุเกม (Slug) *")}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              placeholder="e.g., genshin, valorant"
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-sm text-body-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-label-sm text-label-sm text-on-surface font-semibold uppercase">
              {tx("Top-Up Delivery Input Mode *", "รูปแบบการเติมเงินเข้าเกม *")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInputMode("UID")}
                className={`p-3 rounded-xl border flex flex-col text-left transition-all ${
                  inputMode === "UID"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-surface-container bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-1.5 font-label-md text-label-md font-bold">
                  <span className="material-symbols-outlined text-[18px]">tag</span>
                  <span>Player UID</span>
                </div>
                <span className="font-body-xs text-body-xs opacity-80 mt-1">
                  {tx("Instant API injection via player ID number", "เติมเงินเข้าทันทีผ่านเลข UID")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode("ID_PASS")}
                className={`p-3 rounded-xl border flex flex-col text-left transition-all ${
                  inputMode === "ID_PASS"
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-surface-container bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-1.5 font-label-md text-label-md font-bold">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>ID & Password</span>
                </div>
                <span className="font-body-xs text-body-xs opacity-80 mt-1">
                  {tx("Automated bot pool login & purchase", "บอทล็อกอินเติมให้อัตโนมัติ")}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-label-sm text-label-sm text-on-surface font-semibold uppercase">
              {tx("Icon URL / Presets", "URL รูปไอคอน หรือ เลือกเทมเพลต")}
            </label>
            <input
              type="text"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="/game-logos/... or https://..."
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_ICONS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setIconUrl(preset.url)}
                  className="px-2 py-0.5 rounded-md bg-surface-container text-[11px] font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface font-medium">
              {tx("Active & Visible in Storefront", "เปิดใช้งานและแสดงผลบนหน้าร้าน")}
            </span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              {tx("Cancel", "ยกเลิก")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? tx("Creating...", "กำลังสร้าง...") : tx("Create Game Title", "บันทึกสร้างเกม")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { AdminBannerItem } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface BannerFormDrawerProps {
  open: boolean;
  editingBanner: AdminBannerItem | null;
  onClose: () => void;
  onSave: (data: {
    title: string;
    caption: string;
    imageUrl: string;
    targetUrl: string;
    order: number;
    scheduleLabel: string;
    active: boolean;
  }) => void;
  onTestRender: () => void;
}

const SLIDE_PRESETS = [
  { label: "Roblox (WebP)", url: "/pic-banner-slide/roblox.webp" },
  { label: "RoV (JPEG)", url: "/pic-banner-slide/rov.jpeg" },
  { label: "Free Fire (JPEG)", url: "/pic-banner-slide/freefire.jpeg" },
  { label: "Roblox 2 (JPEG)", url: "/pic-banner-slide/roblox.jpeg" },
];

export default function BannerFormDrawer({ open, editingBanner, onClose, onSave, onTestRender }: BannerFormDrawerProps) {
  const { tx } = useLanguage();
  const [title, setTitle] = useState("Roblox Blox Fruits Special Deal");
  const [caption, setCaption] = useState("Instant Robux delivery + verified Max Level Blox Fruits accounts.");
  const [imageUrl, setImageUrl] = useState("/pic-banner-slide/roblox.webp");
  const [targetUrl, setTargetUrl] = useState("/topup");
  const [order, setOrder] = useState(1);
  const [schedule, setSchedule] = useState("Always Active");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (editingBanner) {
      setTitle(editingBanner.title);
      setCaption(editingBanner.caption);
      setImageUrl(editingBanner.imageUrl || "/pic-banner-slide/roblox.webp");
      setTargetUrl(editingBanner.targetUrl);
      setOrder(editingBanner.order);
      setSchedule(editingBanner.scheduleLabel);
      setActive(editingBanner.active);
    } else {
      setTitle("");
      setCaption("Instant Robux delivery + verified Max Level Blox Fruits accounts.");
      setImageUrl("/pic-banner-slide/roblox.webp");
      setTargetUrl("/topup");
      setOrder(1);
      setSchedule("Always Active");
      setActive(true);
    }
  }, [editingBanner, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter banner campaign title");
      return;
    }
    if (!imageUrl.trim()) {
      alert("Please provide or upload a banner image");
      return;
    }
    onSave({
      title: title.trim(),
      caption: caption.trim() || "Promotional banner",
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl.trim() || "/topup",
      order: Number(order) || 1,
      scheduleLabel: schedule.trim() || "Always Active",
      active,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end transition-opacity duration-300">
      <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity cursor-pointer" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-surface-container-lowest h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-l border-surface-container-high">
        <div className="p-space-xl pb-space-lg bg-surface-container-lowest flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-sm text-label-sm text-primary uppercase font-semibold">
                {tx("Storefront Hero Component", "คอมโพเนนต์แบนเนอร์หน้าร้าน")}
              </span>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-[11px] font-medium">
                {tx(`Slot #${order} Selected`, `เลือกตำแหน่งที่ #${order}`)}
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              {editingBanner
                ? tx("Edit Promotional Banner", "แก้ไขแบนเนอร์โปรโมชั่น")
                : tx("Add New Promotional Banner", "เพิ่มแบนเนอร์โปรโมชั่นใหม่")}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {tx("Configure slide background image, storefront destination URLs, and publication order.", "ตั้งค่ารูปภาพพื้นหลังสไลด์ ลิงก์ปลายทางบนหน้าร้าน และลำดับการแสดงผล")}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-xl space-y-space-lg flex-1">
          <div className="space-y-1.5">
            <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
              {tx("Banner Title *", "หัวข้อแบนเนอร์ *")}
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" placeholder="e.g. Roblox Blox Fruits Special Deal" type="text" />
          </div>

          <div className="space-y-1.5">
            <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
              {tx("Caption Description", "คำอธิบายโปรโมชั่นย่อย")}
            </label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" placeholder={tx("Highlight promotional incentive or package discount...", "ระบุรายละเอียดส่วนลดหรือโบนัสพิเศษ...")} type="text" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
                {tx("Banner Image (Upload File or URL) *", "รูปภาพแบนเนอร์ (อัปโหลดไฟล์หรือใส่ URL) *")}
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors shadow-xs">
                <span className="material-symbols-outlined text-[15px]">upload_file</span>
                <span>{tx("Upload Image File", "อัปโหลดรูปจากเครื่อง")}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") setImageUrl(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" placeholder="/pic-banner-slide/roblox.webp or https://..." type="text" />

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-label-sm text-label-sm text-outline">{tx("pic-banner-slide Presets:", "เลือกรูปจาก pic-banner-slide:")}</span>
              {SLIDE_PRESETS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors ${imageUrl === preset.url ? "bg-primary text-on-primary font-semibold" : "bg-surface-container text-on-surface-variant hover:bg-primary-fixed hover:text-primary"}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="relative rounded-xl bg-surface-container-low overflow-hidden h-40 border border-surface-container mt-2">
              <img className="w-full h-full object-cover" src={imageUrl || "/pic-banner-slide/roblox.webp"} alt="Banner preview" />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface font-label-sm text-[11px] max-w-[90%] truncate">
                {imageUrl.startsWith("data:") ? tx("Uploaded Custom Image File", "ไฟล์รูปภาพที่อัปโหลดจากเครื่อง") : imageUrl}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
              {tx("Target Link URL *", "ลิงก์ปลายทางเมื่อคลิก *")}
            </label>
            <input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" placeholder="/topup or /accounts" type="text" />
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-label-sm text-label-sm text-outline">{tx("Quick Select:", "เลือกด่วน:")}</span>
              {["/topup", "/accounts", "/orders"].map((val) => (
                <button key={val} type="button" onClick={() => setTargetUrl(val)} className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:bg-primary-fixed hover:text-primary transition-colors">
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
            <div className="space-y-1.5">
              <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
                {tx("Display Sort Order", "ลำดับการแสดงผล")}
              </label>
              <input value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" max={10} min={1} type="number" />
            </div>

            <div className="space-y-1.5">
              <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
                {tx("Promotion Schedule", "ระยะเวลาโปรโมชั่น")}
              </label>
              <input value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest font-label-sm text-label-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" type="text" />
            </div>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-headline-sm text-headline-sm text-on-surface">{tx("Publish Immediately", "เปิดแสดงผลทันที")}</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{tx("Make live in storefront hero carousel upon saving.", "นำขึ้นแสดงในสไลด์หน้าแรกทันทีหลังกดบันทึก")}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input checked={active} onChange={(e) => setActive(e.target.checked)} className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>
        </div>

        <div className="p-space-lg bg-surface-container-low/70 flex items-center justify-between gap-space-md">
          <button type="button" onClick={onClose} className="h-10 px-space-lg rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-body-sm text-body-sm shadow-sm transition-colors">
            {tx("Cancel", "ยกเลิก")}
          </button>
          <div className="flex items-center gap-space-sm">
            <button type="button" onClick={onTestRender} className="h-10 px-space-md rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>{tx("Test Render", "ทดสอบการแสดงผล")}</span>
            </button>
            <button type="button" onClick={handleSubmit} className="h-10 px-space-xl rounded-lg bg-inverse-surface text-inverse-on-surface hover:opacity-95 font-body-sm text-body-sm font-medium flex items-center gap-1.5 shadow-md transition-all">
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{tx("Save Banner", "บันทึกแบนเนอร์")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

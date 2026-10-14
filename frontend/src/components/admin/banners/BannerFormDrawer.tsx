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
    targetUrl: string;
    order: number;
    scheduleLabel: string;
    active: boolean;
  }) => void;
  onTestRender: () => void;
}

const DEFAULT_PREVIEW_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDY18QAc90tR7KgdmuyEr9w4OvTJI7pqQTKnzVQZz1K1qnGfzFiwWVnRUfoWtEG5ykkJf72RyGJ3DSA4bfOdQ_y1WsVPo7123iZmGBc_Gl20SUze0fqlECWMERf7-1pvAHZqHtRToJBTb02O5gShXa6NlYLEf-WvkA2XsaHlt7_vDV6bj1ePfkzmgitAE17Ba6qsxasvrU5s9mqTdwCanY4FIk_UEUB4R7myGxc4g63ypMXjoNG3lgY";

export default function BannerFormDrawer({ open, editingBanner, onClose, onSave, onTestRender }: BannerFormDrawerProps) {
  const { tx } = useLanguage();
  const [title, setTitle] = useState("Roblox Blox Fruits Special Deal");
  const [caption, setCaption] = useState("Instant Robux delivery + free Legendary Fruit roll chance for purchases exceeding 500฿.");
  const [targetUrl, setTargetUrl] = useState("/topup/roblox");
  const [order, setOrder] = useState(1);
  const [schedule, setSchedule] = useState("2025-03-01 — 2025-03-31");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (editingBanner) {
      setTitle(editingBanner.title);
      setCaption(editingBanner.caption);
      setTargetUrl(editingBanner.targetUrl);
      setOrder(editingBanner.order);
      setSchedule(editingBanner.scheduleLabel);
      setActive(editingBanner.active);
    } else {
      setTitle("");
      setCaption("Instant Robux delivery + free Legendary Fruit roll chance for purchases exceeding 500฿.");
      setTargetUrl("/topup/roblox");
      setOrder(1);
      setSchedule("2025-03-01 — 2025-03-31");
      setActive(true);
    }
  }, [editingBanner, open]);

  if (!open) return null;

  const handleSubmit = () => {
    onSave({
      title: title.trim() || "New Storefront Campaign Banner",
      caption: caption.trim() || "Limited-time promotional bonus across all game packages.",
      targetUrl: targetUrl.trim() || "/topup",
      order: Number(order) || 1,
      scheduleLabel: schedule.trim() || "Until 31 Mar, 23:59",
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
              {tx(
                "Configure artwork, storefront destination URLs, and publication timeframe.",
                "ตั้งค่ารูปภาพ ลิงก์ปลายทางบนหน้าร้าน และช่วงเวลาการแสดงผล"
              )}
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
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" placeholder="e.g. Steam Summer Sale Extravaganza" type="text" />
            <p className="font-body-sm text-body-sm text-outline">
              {tx("Displayed in slider navigation bullets and accessibility labels.", "แสดงในจุดนำทางสไลด์และป้ายกำกับของแบนเนอร์")}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
              {tx("Caption Description", "คำอธิบายโปรโมชั่นย่อย")}
            </label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" placeholder={tx("Highlight promotional incentive or package discount...", "ระบุรายละเอียดส่วนลดหรือโบนัสพิเศษ...")} type="text" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
                {tx("Banner Artwork Preview *", "ตัวอย่างรูปภาพแบนเนอร์ *")}
              </label>
              <span className="font-label-sm text-label-sm text-outline">
                {tx("Aspect Ratio: 16:5 (1920 × 600 px)", "อัตราส่วน: 16:5 (1920 × 600 px)")}
              </span>
            </div>
            <div className="relative group rounded-xl bg-surface-container-low overflow-hidden transition-all flex flex-col items-center justify-center min-h-[170px] p-space-md text-center">
              <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-40 transition-opacity">
                <img className="w-full h-full object-cover" src={editingBanner?.imageUrl || DEFAULT_PREVIEW_IMG} alt="Banner preview" />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center space-y-2 p-space-sm bg-inverse-surface/60 backdrop-blur-md rounded-xl text-inverse-on-surface max-w-sm">
                <span className="material-symbols-outlined text-[28px] text-secondary-fixed">cloud_upload</span>
                <div>
                  <p className="font-body-sm text-body-sm font-medium">
                    {tx("Drag & drop new high-res artwork or ", "ลากและวางรูปภาพความละเอียดสูง หรือ ")}
                    <span className="text-secondary-fixed underline cursor-pointer">{tx("browse", "เลือกไฟล์")}</span>
                  </p>
                  <p className="font-label-sm text-[11px] text-inverse-on-surface/80">
                    {tx("WebP, PNG, or AVIF (Max 4MB per asset)", "รองรับ WebP, PNG หรือ AVIF (สูงสุด 4MB)")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
              {tx("Target Link URL *", "ลิงก์ปลายทางเมื่อคลิก *")}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">link</span>
                <input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" placeholder="/topup/game-slug or https://..." type="text" />
              </div>
              <button type="button" onClick={() => setTargetUrl("/topup")} className="h-10 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1 shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[16px]">touch_app</span>
                <span>{tx("Internal Route", "ลิงก์ภายในเว็บ")}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-label-sm text-label-sm text-outline">{tx("Quick Select:", "เลือกด่วน:")}</span>
              {[
                { label: "/topup/roblox", val: "/topup/roblox" },
                { label: "/accounts/rov", val: "/accounts/rov" },
                { label: "/topup", val: "/topup" },
                { label: "/accounts", val: "/accounts" },
                { label: "Discord URL", val: "https://discord.gg/apexpay" },
              ].map((route) => (
                <button key={route.label} type="button" onClick={() => setTargetUrl(route.val)} className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:bg-primary-fixed hover:text-primary transition-colors">
                  {route.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
            <div className="space-y-1.5">
              <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
                {tx("Display Sort Order", "ลำดับการแสดงผล")}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">format_list_numbered</span>
                <input value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" max={10} min={1} type="number" />
              </div>
              <p className="font-body-sm text-body-sm text-outline">{tx("#1 appears first on storefront home.", "ลำดับ #1 จะแสดงเป็นภาพแรกสุดบนหน้าเว็บ")}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wide">
                {tx("Promotion Schedule", "ระยะเวลาโปรโมชั่น")}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">calendar_month</span>
                <input value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest font-label-sm text-label-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-surface-container" type="text" />
              </div>
              <p className="font-body-sm text-body-sm text-outline">{tx("Auto-deactivates at campaign expiry.", "ปิดการแสดงผลอัตโนมัติเมื่อสิ้นสุดแคมเปญ")}</p>
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

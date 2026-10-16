"use client";

import React, { useEffect, useState } from "react";
import { AdminTopUpPackage } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface PackageFormDrawerProps {
  open: boolean;
  editingPackage: AdminTopUpPackage | null;
  onClose: () => void;
  onSave: (data: {
    game: "Roblox" | "RoV" | "FreeFire";
    name: string;
    denomination: string;
    cost: number;
    price: number;
    tag: string;
  }) => void;
}

export default function PackageFormDrawer({ open, editingPackage, onClose, onSave }: PackageFormDrawerProps) {
  const { tx } = useLanguage();
  const [game, setGame] = useState<"Roblox" | "RoV" | "FreeFire">("Roblox");
  const [name, setName] = useState("");
  const [denomination, setDenomination] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [tag, setTag] = useState("");
  const [instant, setInstant] = useState(true);

  useEffect(() => {
    if (editingPackage) {
      setGame(editingPackage.game);
      setName(editingPackage.name);
      setDenomination(editingPackage.denomination);
      setCost(String(editingPackage.cost));
      setPrice(String(editingPackage.price));
      setTag(editingPackage.tag);
      setInstant(true);
    } else {
      setGame("Roblox");
      setName("");
      setDenomination("");
      setCost("");
      setPrice("");
      setTag("");
      setInstant(true);
    }
  }, [editingPackage, open]);

  if (!open) return null;

  const numCost = parseFloat(cost) || 0;
  const numPrice = parseFloat(price) || 0;
  const diff = numPrice - numCost;
  const pct = numPrice > 0 ? ((diff / numPrice) * 100).toFixed(1) : "0.0";

  let marginText = "฿0.00 (0.0%)";
  let marginClass = "font-label-lg text-label-lg font-bold text-on-surface";
  if (numPrice > 0) {
    if (diff >= 0) {
      marginText = `+฿${diff.toFixed(2)} (+${pct}%)`;
      marginClass = "font-label-lg text-label-lg font-bold text-secondary";
    } else {
      marginText = `-฿${Math.abs(diff).toFixed(2)} (${pct}%)`;
      marginClass = "font-label-lg text-label-lg font-bold text-error";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter package name");
      return;
    }
    if (!numPrice || numPrice <= 0) {
      alert("Please enter a valid retail price (> 0)");
      return;
    }
    onSave({
      game,
      name: name.trim(),
      denomination: denomination.trim() || name.trim(),
      cost: numCost > 0 ? numCost : Math.round(numPrice * 0.8),
      price: numPrice,
      tag: tag.trim() || "Standard",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-surface-container-lowest shadow-xl p-margin-desktop flex flex-col justify-between overflow-y-auto relative z-10">
          <div className="flex flex-col gap-space-xl">
            <div className="flex items-center justify-between pb-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">add_box</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    {editingPackage
                      ? tx(`Edit Package (${editingPackage.sku})`, `แก้ไขแพ็กเกจ (${editingPackage.sku})`)
                      : tx("Add Top-Up Package", "เพิ่มแพ็กเกจเติมเกม")}
                  </h3>
                  <span className="font-label-sm text-label-sm text-outline">
                    {tx("Direct Injection SKU Provisioning", "ตั้งค่าแพ็กเกจเชื่อมต่อระบบเติมอัตโนมัติ")}
                  </span>
                </div>
              </div>
              <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form id="package-form" onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">
                  {tx("Target Game Protocol", "ค่ายเกมและโปรโตคอล")}
                </label>
                <div className="relative">
                  <select value={game} onChange={(e) => setGame(e.target.value as "Roblox" | "RoV" | "FreeFire")} className="w-full h-10 px-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                    <option value="Roblox">{tx("Roblox (Bot Queue Dispatch)", "Roblox (ส่งผ่านคิวบอท)")}</option>
                    <option value="RoV">{tx("Arena of Valor / RoV (IQ-Bank API)", "RoV (เชื่อมต่อ IQ-Bank API)")}</option>
                    <option value="FreeFire">{tx("Free Fire (Garena Webhook)", "Free Fire (Garena เว็บฮุค)")}</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-space-md top-2.5 text-outline pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">
                    {tx("Package Title", "ชื่อแพ็กเกจ")}
                  </label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="h-10 px-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 2,000 Robux" required type="text" />
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">
                    {tx("Denomination Value", "จำนวนหน่วยที่ได้รับ")}
                  </label>
                  <input value={denomination} onChange={(e) => setDenomination(e.target.value)} className="h-10 px-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 2000" required type="number" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">
                    {tx("Wholesale Cost (฿)", "ราคาต้นทุน (฿)")}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-space-md text-outline font-label-md text-label-md">฿</span>
                    <input value={cost} onChange={(e) => setCost(e.target.value)} className="w-full h-10 pl-8 pr-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" placeholder="250.00" required step="0.5" type="number" />
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">
                    {tx("Storefront Price (฿)", "ราคาขายหน้าร้าน (฿)")}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-space-md text-outline font-label-md text-label-md">฿</span>
                    <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-10 pl-8 pr-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" placeholder="320.00" required step="0.5" type="number" />
                  </div>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline uppercase">
                    {tx("Projected Net Margin", "กำไรสุทธิที่คาดการณ์")}
                  </span>
                  <span className={marginClass}>{marginText}</span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[24px]">price_check</span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">
                  {tx("Promotional Tag / Badge", "ป้ายกำกับโปรโมชั่น")}
                </label>
                <input value={tag} onChange={(e) => setTag(e.target.value)} className="h-10 px-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. +100 Bonus, 20% OFF, Hot Deal" type="text" />
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
                <div className="flex flex-col max-w-[80%]">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    {tx("Automated IQ-Bank Trigger", "สั่งเติมอัตโนมัติผ่าน IQ-Bank")}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {tx("Instantly execute via API without manual backoffice order approval.", "ดำเนินการเติมทันทีผ่าน API โดยไม่ต้องรอแอดมินอนุมัติ")}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={instant} onChange={(e) => setInstant(e.target.checked)} className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-surface-container-high after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              <div className="flex items-center gap-space-xs p-space-sm rounded-lg bg-tertiary-fixed/40 text-on-tertiary-fixed">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="font-label-sm text-label-sm">
                  {tx("Automatic inventory lock will engage once published to storefront.", "ระบบล็อกสต็อกอัตโนมัติจะทำงานทันทีเมื่อเผยแพร่ขึ้นหน้าร้าน")}
                </span>
              </div>
            </form>
          </div>

          <div className="pt-space-xl flex items-center gap-space-sm justify-end">
            <button type="button" onClick={onClose} className="px-space-lg py-space-sm rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high transition-colors">
              {tx("Cancel", "ยกเลิก")}
            </button>
            <button type="submit" form="package-form" className="px-space-xl py-space-sm rounded-xl bg-primary text-on-primary font-body-sm text-body-sm hover:bg-primary-container transition-all flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{editingPackage ? tx("Update SKU", "อัปเดตแพ็กเกจ") : tx("Publish SKU", "บันทึกและเปิดขาย")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

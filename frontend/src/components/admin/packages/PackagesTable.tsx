"use client";

import React, { useState } from "react";
import { AdminTopUpPackage } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface PackagesTableProps {
  selectedGame: "roblox" | "rov" | "freefire";
  packages: AdminTopUpPackage[];
  onOpenNew: () => void;
  onEdit: (pkg: AdminTopUpPackage) => void;
  onDelete: (sku: string) => void;
  onToggleActive: (sku: string) => void;
}

const GAME_META = {
  roblox: { titleEn: "Roblox Top-Up Packages", titleTh: "แพ็กเกจเติมเกม Roblox", badgeEn: "10 Active SKU", badgeTh: "10 แพ็กเกจที่เปิดขาย", icon: "token" },
  rov: { titleEn: "Arena of Valor (RoV) Top-Up Packages", titleTh: "แพ็กเกจเติมคูปอง RoV", badgeEn: "14 Active SKU", badgeTh: "14 แพ็กเกจที่เปิดขาย", icon: "sports_esports" },
  freefire: { titleEn: "Free Fire Top-Up Packages", titleTh: "แพ็กเกจเติมเพชร Free Fire", badgeEn: "18 Active SKU", badgeTh: "18 แพ็กเกจที่เปิดขาย", icon: "local_fire_department" },
};

export default function PackagesTable({
  selectedGame,
  packages,
  onOpenNew,
  onEdit,
  onDelete,
  onToggleActive,
}: PackagesTableProps) {
  const { tx } = useLanguage();
  const [skuFilter, setSkuFilter] = useState<"all" | "popular" | "high-margin">("all");
  const meta = GAME_META[selectedGame];

  const filteredPackages = packages.filter((pkg) => {
    const marginPct = pkg.price > 0 ? ((pkg.price - pkg.cost) / pkg.price) * 100 : 0;
    if (skuFilter === "popular") return pkg.tag !== "Standard";
    if (skuFilter === "high-margin") return marginPct > 18;
    return true;
  });

  const renderIconBox = (style: AdminTopUpPackage["iconStyle"]) => {
    if (style === "primary") return "w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0";
    if (style === "tertiary") return "w-9 h-9 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0";
    return "w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0";
  };

  const renderTagBadge = (style: AdminTopUpPackage["tagStyle"]) => {
    if (style === "secondary") return "inline-flex items-center px-space-sm py-0.5 rounded-md bg-secondary-container/50 text-on-secondary-fixed font-label-sm text-label-sm font-medium";
    if (style === "tertiary") return "inline-flex items-center px-space-sm py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-medium";
    if (style === "primary") return "inline-flex items-center px-space-sm py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-medium";
    return "inline-flex items-center px-space-sm py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm";
  };

  return (
    <section className="flex flex-col gap-space-lg rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">{meta.icon}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">{tx(meta.titleEn, meta.titleTh)}</h2>
              <span className="px-space-sm py-0.5 rounded-md bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant">
                {tx(meta.badgeEn, meta.badgeTh)}
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {tx(
                "Settlement currency: Thai Baht (THB ฿) • Auto-synced with Garena IQ-Bank wholesale cost API",
                "สกุลเงิน: บาท (THB ฿) • ซิงค์ราคาทุนอัตโนมัติผ่าน Garena IQ-Bank API"
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex items-center p-1 rounded-xl bg-surface-container-low">
            {(
              [
                { id: "all", labelEn: "All SKUs", labelTh: "ทุกแพ็กเกจ" },
                { id: "popular", labelEn: "Promotional", labelTh: "โปรโมชั่น" },
                { id: "high-margin", labelEn: "High Margin (>18%)", labelTh: "กำไรสูง (>18%)" },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSkuFilter(btn.id)}
                className={
                  skuFilter === btn.id
                    ? "px-space-md py-1 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm transition-all"
                    : "px-space-md py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-all"
                }
              >
                {tx(btn.labelEn, btn.labelTh)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenNew}
            className="flex items-center gap-1.5 px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-body-sm text-body-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>{tx("New SKU", "เพิ่มแพ็กเกจ")}</span>
          </button>
        </div>
      </div>

      {/* 4 Mini Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">{tx("Active Catalog Value", "มูลค่าแพ็กเกจทั้งหมด")}</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              ฿12,840 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">{tx("/ cart capacity", "/ ความจุตะกร้า")}</span>
            </span>
          </div>
          <span className="material-symbols-outlined text-outline text-[22px]">account_balance_wallet</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">{tx("Avg. Gross Margin", "กำไรขั้นต้นเฉลี่ย")}</span>
            <span className="font-headline-sm text-headline-sm text-secondary">21.84%</span>
          </div>
          <span className="material-symbols-outlined text-secondary text-[22px]">trending_up</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">{tx("Fast Delivery Rate", "อัตราจัดส่งไว")}</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">99.4%</span>
          </div>
          <span className="material-symbols-outlined text-primary text-[22px]">bolt</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">{tx("Worker Bots Connected", "บอทที่เชื่อมต่ออยู่")}</span>
            <span className="font-headline-sm text-headline-sm text-tertiary">{tx("8 / 8 Online", "8 / 8 ออนไลน์")}</span>
          </div>
          <span className="material-symbols-outlined text-tertiary text-[22px]">smart_toy</span>
        </div>
      </div>

      {/* SKU Table */}
      <div className="overflow-x-auto -mx-space-xl px-space-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase">
              <th className="py-space-sm px-space-md rounded-l-lg">{tx("Package & Denomination", "แพ็กเกจ & จำนวนหน่วย")}</th>
              <th className="py-space-sm px-space-md">{tx("Promotion Tag", "ป้ายโปรโมชั่น")}</th>
              <th className="py-space-sm px-space-md text-right">{tx("Wholesale Cost", "ราคาทุน")}</th>
              <th className="py-space-sm px-space-md text-right">{tx("Storefront Price", "ราคาหน้าร้าน")}</th>
              <th className="py-space-sm px-space-md text-right">{tx("Net Profit (Margin)", "กำไรสุทธิ (มาร์จิ้น)")}</th>
              <th className="py-space-sm px-space-md text-center">{tx("Auto-Dispatch", "ส่งอัตโนมัติ")}</th>
              <th className="py-space-sm px-space-md text-center">{tx("Active Status", "สถานะเปิดขาย")}</th>
              <th className="py-space-sm px-space-md text-right rounded-r-lg">{tx("Actions", "จัดการ")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low font-body-sm text-body-sm text-on-surface">
            {filteredPackages.map((pkg) => {
              const profit = pkg.price - pkg.cost;
              const marginPct = pkg.price > 0 ? ((profit / pkg.price) * 100).toFixed(1) : "0.0";
              return (
                <tr key={pkg.sku} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-md">
                      <div className={renderIconBox(pkg.iconStyle)}>
                        <span className="material-symbols-outlined text-[20px]">{pkg.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">{pkg.name}</span>
                        <span className="font-label-sm text-label-sm text-outline">{pkg.subtitle}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <span className={renderTagBadge(pkg.tagStyle)}>{pkg.tag}</span>
                  </td>
                  <td className="py-space-md px-space-md text-right font-label-md text-label-md text-outline">
                    ฿{pkg.cost.toFixed(2)}
                  </td>
                  <td className="py-space-md px-space-md text-right font-label-md text-label-md font-semibold text-on-surface">
                    ฿{pkg.price.toFixed(2)}
                  </td>
                  <td className="py-space-md px-space-md text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-label-md text-label-md text-secondary font-semibold">
                        +฿{profit.toFixed(2)}
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary-fixed-dim/90 bg-secondary/10 px-1 rounded">
                        +{marginPct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md text-center">
                    <span className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm font-medium">
                      <span className="material-symbols-outlined text-[16px]">bolt</span> {tx("Instant", "ทันที")}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={pkg.active}
                        onChange={() => onToggleActive(pkg.sku)}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </td>
                  <td className="py-space-md px-space-md text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(pkg)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                        title={tx("Edit Package", "แก้ไขแพ็กเกจ")}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(pkg.sku)}
                        className="p-1.5 rounded-lg text-error hover:bg-error-container/40 transition-colors"
                        title={tx("Delete SKU", "ลบแพ็กเกจ")}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-sm">
        <span className="font-label-sm text-label-sm text-outline">
          {tx(
            `Showing ${filteredPackages.length} of 10 configured game packages • Auto-sync interval: 60s`,
            `แสดง ${filteredPackages.length} จาก 10 แพ็กเกจ • ซิงค์อัตโนมัติทุก 60 วินาที`
          )}
        </span>
        <div className="flex items-center gap-space-xs">
          <button type="button" disabled className="px-space-md py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container transition-colors disabled:opacity-40">
            {tx("Previous", "ก่อนหน้า")}
          </button>
          <span className="px-space-sm font-label-sm text-label-sm text-on-surface">{tx("Page 1 / 2", "หน้า 1 / 2")}</span>
          <button type="button" className="px-space-md py-1 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-colors">
            {tx("Next", "ถัดไป")}
          </button>
        </div>
      </div>
    </section>
  );
}

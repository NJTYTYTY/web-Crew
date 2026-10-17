"use client";

import React, { useState } from "react";
import { AdminTopUpPackage } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface PackagesTableProps {
  selectedGame: string;
  packages: AdminTopUpPackage[];
  onOpenNew: () => void;
  onEdit: (pkg: AdminTopUpPackage) => void;
  onDelete: (sku: string) => void;
  onToggleActive: (sku: string) => void;
}

const GAME_META: Record<string, { titleEn: string; titleTh: string; icon: string }> = {
  roblox: { titleEn: "Roblox Top-Up Packages", titleTh: "แพ็กเกจเติมเกม Roblox", icon: "token" },
  rov: { titleEn: "Arena of Valor (RoV) Top-Up Packages", titleTh: "แพ็กเกจเติมคูปอง RoV", icon: "sports_esports" },
  freefire: { titleEn: "Free Fire Top-Up Packages", titleTh: "แพ็กเกจเติมเพชร Free Fire", icon: "local_fire_department" },
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
  const meta = GAME_META[selectedGame.toLowerCase()] || {
    titleEn: `${selectedGame.toUpperCase()} Top-Up Packages`,
    titleTh: `แพ็กเกจเติมเกม ${selectedGame}`,
    icon: "sports_esports",
  };

  const gamePackages = packages.filter((pkg) => {
    const pkgGame = (pkg.game || "").toLowerCase();
    const sel = selectedGame.toLowerCase();
    if (sel === "rov") return pkgGame === "rov" || pkgGame.includes("rov") || pkgGame.includes("valor");
    if (sel === "freefire") return pkgGame === "freefire" || pkgGame.includes("fire");
    if (sel === "roblox") return pkgGame === "roblox";
    return pkgGame === sel || pkgGame.includes(sel) || sel.includes(pkgGame);
  });
  const activeCount = gamePackages.filter((pkg) => pkg.active).length;
  const totalValue = gamePackages.filter((pkg) => pkg.active).reduce((sum, pkg) => sum + pkg.price, 0);
  const avgMargin =
    gamePackages.length > 0
      ? (
          gamePackages.reduce(
            (sum, pkg) => sum + (pkg.price > 0 ? ((pkg.price - pkg.cost) / pkg.price) * 100 : 0),
            0
          ) / gamePackages.length
        ).toFixed(2)
      : "0.00";

  const filteredPackages = gamePackages.filter((pkg) => {
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
    if (style === "secondary") return "inline-flex items-center px-space-sm py-0.5 rounded-md bg-secondary-container/50 text-on-secondary-fixed font-label-sm text-label-sm font-medium whitespace-nowrap";
    if (style === "tertiary") return "inline-flex items-center px-space-sm py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-medium whitespace-nowrap";
    if (style === "primary") return "inline-flex items-center px-space-sm py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-medium whitespace-nowrap";
    return "inline-flex items-center px-space-sm py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm whitespace-nowrap";
  };

  return (
    <section className="flex flex-col gap-space-lg rounded-xl bg-surface-container-lowest p-5 sm:p-space-xl shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex items-start sm:items-center gap-space-md">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[24px]">{meta.icon}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-space-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">{tx(meta.titleEn, meta.titleTh)}</h2>
              <span className="px-space-sm py-0.5 rounded-md bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap shrink-0">
                {tx(`${activeCount} Active SKU`, `${activeCount} แพ็กเกจที่เปิดขาย`)}
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

        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <div className="flex items-center p-1 rounded-xl bg-surface-container-low overflow-x-auto max-w-full">
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
                    ? "px-space-md py-1 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm transition-all whitespace-nowrap shrink-0"
                    : "px-space-md py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-all whitespace-nowrap shrink-0"
                }
              >
                {tx(btn.labelEn, btn.labelTh)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenNew}
            className="inline-flex items-center gap-1.5 px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-body-sm text-body-sm hover:bg-primary-container transition-all whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>{tx("New SKU", "เพิ่มแพ็กเกจ")}</span>
          </button>
        </div>
      </div>

      {/* 4 Mini Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">{tx("Active Catalog Value", "มูลค่าแพ็กเกจทั้งหมด")}</span>
            <span className="font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">
              ฿{totalValue.toLocaleString()} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">{tx("/ active sum", "/ รวมที่เปิดขาย")}</span>
            </span>
          </div>
          <span className="material-symbols-outlined text-outline text-[22px] shrink-0">account_balance_wallet</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">{tx("Avg. Gross Margin", "กำไรขั้นต้นเฉลี่ย")}</span>
            <span className="font-headline-sm text-headline-sm text-secondary whitespace-nowrap">{avgMargin}%</span>
          </div>
          <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">trending_up</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">{tx("Fast Delivery Rate", "อัตราจัดส่งไว")}</span>
            <span className="font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">99.4%</span>
          </div>
          <span className="material-symbols-outlined text-primary text-[22px] shrink-0">bolt</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">{tx("Worker Bots Connected", "บอทที่เชื่อมต่ออยู่")}</span>
            <span className="font-headline-sm text-headline-sm text-tertiary whitespace-nowrap">{tx("8 / 8 Online", "8 / 8 ออนไลน์")}</span>
          </div>
          <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0">smart_toy</span>
        </div>
      </div>

      {/* SKU Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase">
              <th className="py-space-sm px-space-md rounded-l-lg whitespace-nowrap">{tx("Package & Denomination", "แพ็กเกจ & จำนวนหน่วย")}</th>
              <th className="py-space-sm px-space-md whitespace-nowrap">{tx("Promotion Tag", "ป้ายโปรโมชั่น")}</th>
              <th className="py-space-sm px-space-md text-right whitespace-nowrap">{tx("Wholesale Cost", "ราคาทุน")}</th>
              <th className="py-space-sm px-space-md text-right whitespace-nowrap">{tx("Storefront Price", "ราคาหน้าร้าน")}</th>
              <th className="py-space-sm px-space-md text-right whitespace-nowrap">{tx("Net Profit (Margin)", "กำไรสุทธิ (มาร์จิ้น)")}</th>
              <th className="py-space-sm px-space-md text-center whitespace-nowrap">{tx("Auto-Dispatch", "ส่งอัตโนมัติ")}</th>
              <th className="py-space-sm px-space-md text-center whitespace-nowrap">{tx("Active Status", "สถานะเปิดขาย")}</th>
              <th className="py-space-sm px-space-md text-right rounded-r-lg whitespace-nowrap">{tx("Actions", "จัดการ")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low font-body-sm text-body-sm text-on-surface">
            {filteredPackages.map((pkg) => {
              const profit = pkg.price - pkg.cost;
              const marginPct = pkg.price > 0 ? ((profit / pkg.price) * 100).toFixed(1) : "0.0";
              return (
                <tr key={pkg.sku} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="py-space-md px-space-md whitespace-nowrap">
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
                  <td className="py-space-md px-space-md whitespace-nowrap">
                    <span className={renderTagBadge(pkg.tagStyle)}>{pkg.tag}</span>
                  </td>
                  <td className="py-space-md px-space-md text-right font-label-md text-label-md text-outline whitespace-nowrap">
                    ฿{pkg.cost.toFixed(2)}
                  </td>
                  <td className="py-space-md px-space-md text-right font-label-md text-label-md font-semibold text-on-surface whitespace-nowrap">
                    ฿{pkg.price.toFixed(2)}
                  </td>
                  <td className="py-space-md px-space-md text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-label-md text-label-md text-secondary font-semibold">
                        +฿{profit.toFixed(2)}
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary-fixed-dim/90 bg-secondary/10 px-1 rounded">
                        +{marginPct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm font-medium whitespace-nowrap">
                      <span className="material-symbols-outlined text-[16px]">bolt</span> {tx("Instant", "ทันที")}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md text-center whitespace-nowrap">
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
                  <td className="py-space-md px-space-md text-right whitespace-nowrap">
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
            `Showing ${filteredPackages.length} of ${gamePackages.length} configured game packages • Live PostgreSQL Sync`,
            `แสดง ${filteredPackages.length} จาก ${gamePackages.length} แพ็กเกจ • ซิงค์กับฐานข้อมูลเรียลไทม์`
          )}
        </span>
        <div className="flex items-center gap-space-xs shrink-0">
          <button type="button" disabled className="px-space-md py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container transition-colors disabled:opacity-40 whitespace-nowrap">
            {tx("Previous", "ก่อนหน้า")}
          </button>
          <span className="px-space-sm font-label-sm text-label-sm text-on-surface whitespace-nowrap">{tx("Page 1 / 1", "หน้า 1 / 1")}</span>
          <button type="button" disabled className="px-space-md py-1 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-colors disabled:opacity-40 whitespace-nowrap">
            {tx("Next", "ถัดไป")}
          </button>
        </div>
      </div>
    </section>
  );
}

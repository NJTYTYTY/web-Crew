"use client";

import React, { useState } from "react";
import { AdminGameAccount } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface AccountsTableProps {
  accounts: AdminGameAccount[];
  onEdit: (account: AdminGameAccount) => void;
  onDelete: (id: string, title: string) => void;
  onToast: (title: string, message: string) => void;
}

export default function AccountsTable({
  accounts,
  onEdit,
  onDelete,
  onToast,
}: AccountsTableProps) {
  const { tx } = useLanguage();
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPair = (acc: AdminGameAccount) => {
    const pair = `${acc.username}:${acc.password}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(pair);
    }
    onToast(tx("Copied to Clipboard", "คัดลอกลงคลิปบอร์ดแล้ว"), `${tx("Vault item", "ข้อมูลไอดี")}: ${acc.username}`);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <th className="py-space-md px-space-lg font-semibold whitespace-nowrap">{tx("Item & Title", "รายการ & ชื่อไอดี")}</th>
              <th className="py-space-md px-space-md font-semibold whitespace-nowrap">{tx("Platform & Server", "แพลตฟอร์ม & เซิร์ฟเวอร์")}</th>
              <th className="py-space-md px-space-md font-semibold whitespace-nowrap">{tx("Specs & Description", "สเปค & รายละเอียด")}</th>
              <th className="py-space-md px-space-md font-semibold text-right whitespace-nowrap">{tx("Price (THB)", "ราคา (บาท)")}</th>
              <th className="py-space-md px-space-md font-semibold text-center whitespace-nowrap">{tx("Status", "สถานะ")}</th>
              <th className="py-space-md px-space-md font-semibold whitespace-nowrap">{tx("Instant Vault Credentials", "ข้อมูลรหัสผ่านในคลังนิรภัย")}</th>
              <th className="py-space-md px-space-lg font-semibold text-right whitespace-nowrap">{tx("Actions", "จัดการ")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
            {accounts.map((acc) => {
              const isRevealed = !!revealedIds[acc.id];
              const isSold = acc.status === "sold";
              return (
                <tr key={acc.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-space-md px-space-lg">
                    <div className="flex items-center gap-space-md min-w-[260px]">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0 shadow-sm">
                        <img className="w-full h-full object-cover" src={acc.imageUrl} alt={acc.title} />
                        <span
                          className={`absolute top-1 left-1 bg-surface-container-lowest/90 px-1 rounded font-label-sm text-[9px] font-bold whitespace-nowrap ${
                            acc.platform === "roblox" ? "text-primary" : "text-tertiary"
                          }`}
                        >
                          {acc.code}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                          {acc.title}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline flex items-center gap-1 whitespace-nowrap">
                          <span className="material-symbols-outlined text-[14px] shrink-0">{acc.subIcon}</span>
                          {acc.subtitle}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-space-md px-space-md whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      {acc.platform === "roblox" ? (
                        <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-lg font-label-sm text-label-sm bg-inverse-surface text-inverse-on-surface font-medium whitespace-nowrap">
                          <span className="material-symbols-outlined text-[13px] text-tertiary-fixed shrink-0">smart_toy</span>
                          {acc.platformLabel}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-lg font-label-sm text-label-sm bg-surface-container-high text-on-primary-container font-medium whitespace-nowrap">
                          <span className="material-symbols-outlined text-[13px] text-primary shrink-0">sports_esports</span>
                          {acc.platformLabel}
                        </span>
                      )}
                      <span className="font-label-sm text-[11px] text-outline whitespace-nowrap">
                        {acc.serverRegion || (acc.platform === "rov" ? "TH / Garena Server" : "Global Server")}
                      </span>
                    </div>
                  </td>

                  <td className="py-space-md px-space-md max-w-[280px]">
                    <div className="flex flex-col gap-0.5 font-label-sm text-label-sm">
                      <span className="text-on-surface font-medium whitespace-nowrap">{acc.spec1}</span>
                      <span className="text-on-surface-variant font-normal whitespace-nowrap">{acc.spec2} • {acc.spec3}</span>
                      {acc.description && (
                        <span className="text-outline text-[11px] truncate" title={acc.description}>
                          {acc.description}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-space-md px-space-md text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">
                        ฿{acc.priceThb.toLocaleString()}
                      </span>
                      <span className={`font-label-sm text-label-sm ${isSold ? "text-outline" : "text-secondary"}`}>
                        {acc.priceUsd}
                      </span>
                    </div>
                  </td>

                  <td className="py-space-md px-space-md text-center whitespace-nowrap">
                    {isSold ? (
                      <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline shrink-0"></span>
                        {tx("Sold", "ขายแล้ว")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-fixed font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                        {tx("Available", "พร้อมขาย")}
                      </span>
                    )}
                  </td>

                  <td className="py-space-md px-space-md whitespace-nowrap">
                    <div
                      className={`flex items-center gap-space-sm bg-surface-container-low px-space-sm py-1.5 rounded-lg max-w-fit whitespace-nowrap ${
                        isSold ? "opacity-70" : ""
                      }`}
                    >
                      <span className="font-label-sm text-label-sm text-on-surface tracking-wider">
                        {acc.username} / {isRevealed ? acc.password : "••••••••"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(acc.id)}
                        className="text-outline hover:text-primary transition-colors shrink-0"
                        title={tx("Toggle view", "แสดง/ซ่อนรหัสผ่าน")}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isRevealed ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyPair(acc)}
                        className="text-outline hover:text-on-surface transition-colors shrink-0"
                        title={tx("Copy pair", "คัดลอกไอดีและรหัสผ่าน")}
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                    </div>
                  </td>

                  <td className="py-space-md px-space-lg text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(acc)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        title={tx("Edit Account & Description", "แก้ไขไอดีและรายละเอียด")}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onToast(
                            tx("Vault Item Loaded", "โหลดข้อมูลคลังนิรภัยแล้ว"),
                            `User: ${acc.username} | PIN: ${acc.pin}`
                          )
                        }
                        className="p-1.5 rounded-lg text-primary hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                        title={tx("View Full Vault Credentials", "ดูข้อมูลคลังนิรภัยทั้งหมด")}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isSold ? "history_edu" : "key"}
                        </span>
                      </button>
                      {!isSold && (
                        <button
                          type="button"
                          onClick={() => onDelete(acc.id, acc.title)}
                          className="p-1.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors"
                          title={tx("Remove listing", "ลบรายการ")}
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-space-lg py-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm whitespace-nowrap">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {tx("Page 1 of 25", "หน้า 1 จาก 25")}
          </span>
          <span className="text-outline-variant font-label-sm">•</span>
          <span className="font-label-sm text-label-sm text-outline">
            {tx("Queue latency: 18ms", "ความหน่วงคิว: 18ms")}
          </span>
        </div>
        <div className="flex items-center gap-space-xs shrink-0">
          <button
            type="button"
            disabled
            className="px-space-md py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {tx("Previous", "ก่อนหน้า")}
          </button>
          <button type="button" className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">1</button>
          <button type="button" className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center hover:bg-surface-container transition-colors">2</button>
          <button type="button" className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center hover:bg-surface-container transition-colors">3</button>
          <span className="px-1 text-outline font-label-sm text-label-sm">...</span>
          <button type="button" className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center hover:bg-surface-container transition-colors">25</button>
          <button
            type="button"
            className="px-space-md py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors whitespace-nowrap"
          >
            {tx("Next", "ถัดไป")}
          </button>
        </div>
      </div>
    </div>
  );
}

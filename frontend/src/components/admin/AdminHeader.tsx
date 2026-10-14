"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { APEX_ADMIN_LOGO_URL } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminHeader() {
  const router = useRouter();
  const { lang, toggleLang, tx } = useLanguage();
  const [globalQuery, setGlobalQuery] = useState("");
  const [showNotifToast, setShowNotifToast] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalQuery.trim()) {
      router.push("/admin/orders");
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter-desktop">
      <div className="flex items-center gap-space-lg">
        <img
          alt="ApexPay Admin Logo"
          className="h-8 w-auto object-contain"
          src={APEX_ADMIN_LOGO_URL}
        />
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-space-md text-[18px] text-outline">
            search
          </span>
          <input
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            className="w-80 h-9 pl-9 pr-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
            placeholder={tx(
              "Search queue UID, game ID, order token...",
              "ค้นหา UID คิว, รหัสเกม, หรือรหัสคำสั่งซื้อ..."
            )}
            type="text"
          />
        </form>
      </div>

      <div className="flex items-center gap-space-md">
        <button
          type="button"
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high"
          title={tx("Switch Language", "เปลี่ยนภาษา")}
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            translate
          </span>
          <span className={lang === "en" ? "font-bold text-primary" : "text-on-surface-variant"}>
            EN
          </span>
          <span className="text-outline-variant">|</span>
          <span className={lang === "th" ? "font-bold text-primary" : "text-on-surface-variant"}>
            ไทย
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-space-xs px-space-sm py-space-xs rounded-xl bg-secondary-container/40 text-on-secondary-fixed">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-sm text-label-sm uppercase tracking-wide">
            {tx("Live Sync", "ซิงค์สด")}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-space-xs px-space-sm py-space-xs rounded-xl bg-surface-container-low text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span className="font-label-sm text-label-sm">UTC+7 14:32:09</span>
        </div>

        <div className="hidden sm:inline-flex items-center px-space-sm py-space-xs rounded-xl bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
          {tx("admin_iq: ACTIVE", "แอดมิน_iq: ออนไลน์")}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifToast((prev) => !prev)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            title={tx("Gateway Alerts", "การแจ้งเตือนเกตเวย์")}
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
          </button>

          {showNotifToast && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface-container-lowest p-space-md shadow-xl border border-surface-container-high z-50">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <span className="font-label-sm text-label-sm uppercase text-primary font-semibold">
                  {tx("System Telemetry", "สถานะระบบ")}
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifToast(false)}
                  className="text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>
              <div className="pt-2 space-y-2 font-body-sm text-body-sm">
                <p className="text-on-surface font-medium">
                  {tx(
                    "3 RoV orders awaiting manual OTP",
                    "คำสั่งซื้อ RoV 3 รายการรอยืนยัน OTP"
                  )}
                </p>
                <p className="text-on-surface-variant text-body-sm">
                  {tx(
                    "IQ-Bank Webhook stream operating at 99.98% SLA (42ms avg).",
                    "ระบบ IQ-Bank Webhook ทำงานปกติ 99.98% SLA (เฉลี่ย 42ms)"
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]">
            person
          </span>
        </div>
      </div>
    </header>
  );
}

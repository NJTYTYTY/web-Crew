"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { clearAdminSession, getAdminSession, logoutApi } from "@/lib/api";

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const router = useRouter();
  const { lang, toggleLang, tx } = useLanguage();
  const [globalQuery, setGlobalQuery] = useState("");
  const [showNotifToast, setShowNotifToast] = useState(false);
  const [operatorName, setOperatorName] = useState("admin_iq");

  useEffect(() => {
    const u = getAdminSession();
    if (u?.username) setOperatorName(u.username);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalQuery.trim()) {
      router.push(`/admin/orders?q=${encodeURIComponent(globalQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    clearAdminSession();
    await logoutApi().catch(() => {});
    router.replace("/admin/login");
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-4 sm:px-6 lg:px-gutter-desktop gap-3">
      <div className="flex items-center gap-2 sm:gap-space-md min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface shrink-0"
          aria-label="Open sidebar navigation"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-xs shrink-0">
            <img alt="NEXUS PLAY" className="w-full h-full object-cover" src="/logopic.webp" />
          </div>
          <span className="hidden sm:inline text-sm font-extrabold tracking-tight text-slate-900">
            NEXUS<span className="text-indigo-600">PLAY</span>
          </span>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center flex-1 max-w-xs sm:max-w-sm">
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
            search
          </span>
          <input
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
            placeholder={tx(
              "Search queue UID, game ID, order token...",
              "ค้นหา UID คิว, รหัสเกม, หรือรหัสคำสั่งซื้อ..."
            )}
            type="text"
          />
        </form>
      </div>

      <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
        <button
          type="button"
          onClick={toggleLang}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high whitespace-nowrap shrink-0"
          title={tx("Switch Language", "เปลี่ยนภาษา")}
        >
          <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
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

        <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-space-xs rounded-xl bg-secondary-container/40 text-on-secondary-fixed whitespace-nowrap shrink-0">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0"></span>
          <span className="font-label-sm text-label-sm uppercase tracking-wide whitespace-nowrap">
            {tx("Live Sync", "ซิงค์สด")}
          </span>
        </div>

        <div className="hidden sm:inline-flex items-center px-space-sm py-space-xs rounded-xl bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm whitespace-nowrap shrink-0">
          {tx(`${operatorName}: ADMIN`, `${operatorName}: แอดมิน`)}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowNotifToast((prev) => !prev)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors shrink-0"
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
                <span className="font-label-sm text-label-sm uppercase text-primary font-semibold whitespace-nowrap">
                  {tx("System Telemetry", "สถานะระบบ")}
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifToast(false)}
                  className="text-outline hover:text-on-surface shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>
              <div className="pt-2 space-y-2 font-body-sm text-body-sm">
                <p className="text-on-surface font-medium">
                  {tx(
                    "NEXUS PLAY PostgreSQL connected",
                    "เชื่อมต่อฐานข้อมูล NEXUS PLAY PostgreSQL แล้ว"
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

        <button
          type="button"
          onClick={handleSignOut}
          className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-error-container/50 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors shrink-0"
          title={tx("Sign Out Admin", "ออกจากระบบแอดมิน")}
        >
          <span className="material-symbols-outlined text-[18px]">
            logout
          </span>
        </button>
      </div>
    </header>
  );
}

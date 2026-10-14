"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APEX_ADMIN_LOGO_URL } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface NavItem {
  labelEn: string;
  labelTh: string;
  href: string;
  icon: string;
  matchPaths: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    labelEn: "Dashboard Overview",
    labelTh: "ภาพรวมระบบ",
    href: "/admin",
    icon: "grid_view",
    matchPaths: ["/admin"],
  },
  {
    labelEn: "Game Accounts",
    labelTh: "คลังไอดีเกม",
    href: "/admin/accounts",
    icon: "sports_esports",
    matchPaths: ["/admin/accounts"],
  },
  {
    labelEn: "Top-Up Games & Packages",
    labelTh: "เกมเติมเงิน & แพ็กเกจ",
    href: "/admin/topup",
    icon: "inventory_2",
    matchPaths: ["/admin/topup", "/admin/packages"],
  },
  {
    labelEn: "Orders & Top-Up Queue",
    labelTh: "รายการสั่งซื้อ & คิวเติมเกม",
    href: "/admin/orders",
    icon: "sync_alt",
    matchPaths: ["/admin/orders"],
  },
  {
    labelEn: "Homepage Banners",
    labelTh: "จัดการแบนเนอร์หน้าแรก",
    href: "/admin/banners",
    icon: "view_carousel",
    matchPaths: ["/admin/banners"],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { lang, toggleLang, tx } = useLanguage();

  const isItemActive = (item: NavItem) => {
    if (item.href === "/admin") {
      return pathname === "/admin";
    }
    return item.matchPaths.some((p) => pathname.startsWith(p));
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between">
      <div className="flex flex-col">
        <Link
          href="/admin"
          className="h-16 px-space-lg flex items-center gap-space-sm bg-surface-container-lowest"
        >
          <img
            alt="ApexPay Admin Logo"
            className="h-8 w-auto object-contain"
            src={APEX_ADMIN_LOGO_URL}
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">
              ApexPay
            </span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
              {tx("Backoffice", "ระบบหลังบ้าน")}
            </span>
          </div>
        </Link>

        <div className="px-space-md py-space-sm">
          <div className="px-space-sm py-space-xs font-label-sm text-label-sm uppercase text-outline tracking-wider">
            {tx("Navigation", "เมนูหลัก")}
          </div>
          <nav className="mt-space-xs flex flex-col gap-space-xs">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "flex items-center gap-space-md px-space-md py-space-sm rounded-xl transition-colors bg-primary-container text-on-primary-container font-medium shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                      : "flex items-center gap-space-md px-space-md py-space-sm rounded-xl font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span>{tx(item.labelEn, item.labelTh)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-space-md bg-surface-container-lowest space-y-2">
        <button
          type="button"
          onClick={toggleLang}
          className="w-full flex items-center justify-between px-space-md py-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors font-body-sm text-body-sm text-on-surface"
        >
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">
              language
            </span>
            <span>{tx("Language", "ภาษา")}</span>
          </div>
          <span className="font-label-sm text-label-sm font-semibold">
            <span className={lang === "en" ? "text-primary" : "text-outline"}>EN</span>
            {" | "}
            <span className={lang === "th" ? "text-primary" : "text-outline"}>ไทย</span>
          </span>
        </button>

        <Link
          href="/"
          className="flex items-center justify-between px-space-md py-space-sm rounded-xl bg-surface-container-low text-primary hover:bg-surface-container transition-colors font-body-sm text-body-sm"
        >
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[18px]">
              storefront
            </span>
            <span>{tx("Live Storefront", "หน้าร้านค้าจริง")}</span>
          </div>
          <span className="material-symbols-outlined text-[16px]">
            open_in_new
          </span>
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center justify-between px-space-md py-space-sm rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm"
        >
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              lock
            </span>
            <span>{tx("Switch to Login", "สลับหน้าเข้าสู่ระบบ")}</span>
          </div>
          <span className="material-symbols-outlined text-[16px]">logout</span>
        </Link>
      </div>
    </aside>
  );
}

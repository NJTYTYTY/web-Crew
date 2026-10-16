"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { clearAdminSession, logoutApi } from "@/lib/api";

interface NavItem {
  labelEn: string;
  labelTh: string;
  href: string;
  icon: string;
  matchPaths: string[];
}

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
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

export default function AdminSidebar({
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLang, tx } = useLanguage();

  const isItemActive = (item: NavItem) => {
    if (item.href === "/admin") {
      return pathname === "/admin";
    }
    return item.matchPaths.some((p) => pathname.startsWith(p));
  };

  const handleAdminSignOut = async () => {
    clearAdminSession();
    await logoutApi().catch(() => {});
    if (onCloseMobile) onCloseMobile();
    router.replace("/admin/login");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          <div className="h-16 px-space-lg flex items-center justify-between bg-surface-container-lowest border-b border-surface-container">
            <Link
              href="/admin"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 min-w-0 group"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <img
                  alt="NEXUS PLAY Logo"
                  className="w-full h-full object-cover"
                  src="/logopic.webp"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-extrabold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                  NEXUS<span className="text-indigo-600">PLAY</span>
                </span>
                <span className="font-label-sm text-[10px] text-primary uppercase tracking-wider whitespace-nowrap font-bold">
                  {tx("Admin Backoffice", "ระบบหลังบ้าน")}
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="px-space-md py-space-sm">
            <div className="px-space-sm py-space-xs font-label-sm text-label-sm uppercase text-outline tracking-wider whitespace-nowrap">
              {tx("Navigation", "เมนูหลัก")}
            </div>
            <nav className="mt-space-xs flex flex-col gap-space-xs">
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "flex items-center gap-space-md px-space-md py-space-sm rounded-xl transition-colors bg-primary-container text-on-primary-container font-medium shadow-[0_1px_4px_rgba(0,0,0,0.06)] whitespace-nowrap"
                        : "flex items-center gap-space-md px-space-md py-space-sm rounded-xl font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors whitespace-nowrap"
                    }
                  >
                    <span className="material-symbols-outlined text-[20px] shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate">{tx(item.labelEn, item.labelTh)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest space-y-2 border-t border-surface-container">
          <button
            type="button"
            onClick={toggleLang}
            className="w-full flex items-center justify-between px-space-md py-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors font-body-sm text-body-sm text-on-surface whitespace-nowrap"
          >
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                language
              </span>
              <span className="whitespace-nowrap">{tx("Language", "ภาษา")}</span>
            </div>
            <span className="font-label-sm text-label-sm font-semibold whitespace-nowrap shrink-0">
              <span className={lang === "en" ? "text-primary" : "text-outline"}>EN</span>
              {" | "}
              <span className={lang === "th" ? "text-primary" : "text-outline"}>ไทย</span>
            </span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-between px-space-md py-space-sm rounded-xl bg-surface-container-low text-primary hover:bg-surface-container transition-colors font-body-sm text-body-sm whitespace-nowrap"
          >
            <div className="flex items-center gap-space-sm min-w-0">
              <span className="material-symbols-outlined text-[18px] shrink-0">
                storefront
              </span>
              <span className="truncate">{tx("Live Storefront", "หน้าร้านค้าจริง")}</span>
            </div>
            <span className="material-symbols-outlined text-[16px] shrink-0">
              open_in_new
            </span>
          </Link>
          <button
            type="button"
            onClick={handleAdminSignOut}
            className="w-full flex items-center justify-between px-space-md py-space-sm rounded-xl bg-error-container/40 text-on-error-container hover:bg-error-container transition-colors font-body-sm text-body-sm whitespace-nowrap"
          >
            <div className="flex items-center gap-space-sm min-w-0">
              <span className="material-symbols-outlined text-[18px] text-error shrink-0">
                logout
              </span>
              <span className="truncate font-medium">{tx("Sign Out Admin", "ออกจากระบบแอดมิน")}</span>
            </div>
            <span className="material-symbols-outlined text-[16px] shrink-0">arrow_forward</span>
          </button>
        </div>
      </aside>
    </>
  );
}

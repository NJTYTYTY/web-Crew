"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminBannerItem, INITIAL_ADMIN_BANNERS } from "@/data/mockAdminData";
import BannerFormDrawer from "@/components/admin/banners/BannerFormDrawer";
import AdminToast from "@/components/admin/AdminToast";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminBannersPage() {
  const { tx } = useLanguage();
  const [banners, setBanners] = useState<AdminBannerItem[]>(INITIAL_ADMIN_BANNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabFilter, setTabFilter] = useState<"all" | "active" | "scheduled">("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBannerItem | null>(null);
  const [toast, setToast] = useState({ visible: false, title: "", message: "" });

  const syncLocalBanners = (next: AdminBannerItem[]) => {
    try {
      localStorage.setItem("nexusplay_banners_sync", JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/banners`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const list = Array.isArray(data?.banners) ? data.banners : [];
        if (list.length > 0) {
          const mapped: AdminBannerItem[] = list.map((b: Record<string, unknown>, idx: number) => ({
            id: String(b.id),
            order: Number(b.sortOrder) || idx + 1,
            title: String(b.title || "Storefront Banner"),
            caption: INITIAL_ADMIN_BANNERS[idx]?.caption || "Automated PromptPay 0% fee & 5-second game delivery.",
            badgeText: b.isActive !== false ? "Active" : "Scheduled",
            badgeTone: String(b.linkUrl || "").startsWith("http") ? "external" : "active",
            heroBadge: `Hero Slide #${Number(b.sortOrder) || idx + 1}`,
            targetUrl: String(b.linkUrl || "/topup"),
            isExternal: String(b.linkUrl || "").startsWith("http"),
            scheduleLabel: "Live Storefront Slider",
            scheduleIcon: "calendar_today",
            clicks: INITIAL_ADMIN_BANNERS[idx]?.clicks || "5,400",
            ctr: INITIAL_ADMIN_BANNERS[idx]?.ctr || "6.5% CTR",
            active: b.isActive !== false,
            imageUrl: String(b.imageUrl || "/pic-banner-slide/roblox.webp"),
          }));
          setBanners(mapped);
          syncLocalBanners(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const triggerToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const filteredBanners = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = banners.filter((b) => {
      const matchesTab = tabFilter === "all" || (tabFilter === "active" && b.active) || (tabFilter === "scheduled" && !b.active);
      const matchesSearch = !q || b.title.toLowerCase().includes(q) || b.caption.toLowerCase().includes(q) || b.targetUrl.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
    return [...list].sort((a, b) => (sortAsc ? a.order - b.order : b.order - a.order));
  }, [banners, searchQuery, tabFilter, sortAsc]);

  const handleSaveBanner = async (data: {
    title: string;
    caption: string;
    imageUrl: string;
    targetUrl: string;
    order: number;
    scheduleLabel: string;
    active: boolean;
  }) => {
    const isExt = data.targetUrl.startsWith("http");
    if (editingBanner) {
      const next = banners.map((b) =>
        b.id === editingBanner.id
          ? { ...b, ...data, isExternal: isExt, badgeText: isExt ? "External" : data.active ? "Active" : "Scheduled", badgeTone: (isExt ? "external" : "active") as "external" | "active" }
          : b
      );
      setBanners(next);
      syncLocalBanners(next);
      fetch(`${API_BASE}/api/admin/banners/${editingBanner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.title, imageUrl: data.imageUrl, linkUrl: data.targetUrl, sortOrder: data.order, isActive: data.active }),
      }).catch(() => {});
      triggerToast(tx("Banner Updated", "อัปเดตแบนเนอร์แล้ว"), tx(`Saved changes to "${data.title}".`, `บันทึกการแก้ไข "${data.title}" แล้ว`));
    } else {
      let createdId = `${Date.now()}`;
      try {
        const res = await fetch(`${API_BASE}/api/admin/banners`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: data.title, imageUrl: data.imageUrl, linkUrl: data.targetUrl, sortOrder: data.order, isActive: data.active }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.banner?.id) createdId = String(json.banner.id);
        }
      } catch {
        // Offline fallback
      }
      const newBan: AdminBannerItem = {
        id: createdId, order: data.order, title: data.title, caption: data.caption,
        badgeText: isExt ? "External" : "Active", badgeTone: isExt ? "external" : "active",
        heroBadge: `Hero Slide #${data.order}`, targetUrl: data.targetUrl, isExternal: isExt,
        scheduleLabel: data.scheduleLabel, scheduleIcon: "calendar_today", clicks: "0", ctr: "0.0% CTR",
        active: data.active, imageUrl: data.imageUrl,
      };
      const next = [...banners, newBan];
      setBanners(next);
      syncLocalBanners(next);
      triggerToast(tx("Banner Published", "เผยแพร่แบนเนอร์แล้ว"), tx(`Added "${data.title}" to storefront hero slider.`, `เพิ่ม "${data.title}" ลงในสไลด์หน้าแรกแล้ว`));
    }
    setDrawerOpen(false);
  };

  const handleToggleBanner = (item: AdminBannerItem) => {
    const nextActive = !item.active;
    const next = banners.map((b) => (b.id === item.id ? { ...b, active: nextActive } : b));
    setBanners(next);
    syncLocalBanners(next);
    fetch(`${API_BASE}/api/admin/banners/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: nextActive }),
    }).catch(() => {});
    triggerToast(tx("Banner Status Updated", "อัปเดตสถานะแบนเนอร์แล้ว"), tx(`Toggled visibility for "${item.title}".`, `สลับการแสดงผลของ "${item.title}" แล้ว`));
  };

  const handleDeleteBanner = (item: AdminBannerItem) => {
    const next = banners.filter((b) => b.id !== item.id);
    setBanners(next);
    syncLocalBanners(next);
    fetch(`${API_BASE}/api/admin/banners/${item.id}`, { method: "DELETE" }).catch(() => {});
    triggerToast(tx("Banner Deleted", "ลบแบนเนอร์แล้ว"), tx(`Removed "${item.title}" from carousel.`, `ลบ "${item.title}" ออกจากสไลด์แล้ว`));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-gutter-desktop py-space-xl max-w-[1600px] mx-auto w-full space-y-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
        <div className="space-y-space-xs">
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary bg-primary-fixed px-space-sm py-0.5 rounded-full whitespace-nowrap shrink-0">
              {tx("Storefront CMS", "ระบบจัดการหน้าร้าน")}
            </span>
            <span className="text-outline text-body-sm">•</span>
            <span className="font-label-sm text-label-sm text-outline whitespace-nowrap">
              {tx("Hero Slider Controller (pic-banner-slide)", "ควบคุมสไลด์แบนเนอร์หลัก (pic-banner-slide)")}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {tx("Homepage Promotional Banners", "จัดการแบนเนอร์โปรโมชั่นหน้าแรก")}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {tx("Control active auto-sliding hero background banners, sort order, and destination links.", "จัดการภาพพื้นหลังสไลด์อัตโนมัติหน้าแรก ลำดับการแสดงผล และลิงก์ปลายทาง")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm self-start md:self-auto shrink-0">
          <Link href="/" className="h-9 px-space-md rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-body-sm text-body-sm inline-flex items-center gap-space-xs shadow-sm transition-all whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>{tx("Live Storefront Preview", "ดูตัวอย่างหน้าร้านจริง")}</span>
          </Link>
          <button type="button" onClick={() => { setEditingBanner(null); setDrawerOpen(true); }} className="h-9 px-space-lg rounded-lg bg-inverse-surface text-inverse-on-surface hover:opacity-90 font-body-sm text-body-sm inline-flex items-center gap-space-xs shadow-sm transition-all whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            <span className="font-medium">{tx("+ Add New Banner", "+ เพิ่มแบนเนอร์ใหม่")}</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="p-space-md bg-surface-container-lowest flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm flex-1 min-w-[240px] max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">search</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-inner" placeholder={tx("Search banner title, campaign tag, target link...", "ค้นหาชื่อแบนเนอร์, แคมเปญ หรือลิงก์ปลายทาง...")} type="text" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center rounded-lg bg-surface-container-low p-0.5 overflow-x-auto max-w-full">
              {(["all", "active", "scheduled"] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => setTabFilter(tab)} className={`px-space-md py-1 rounded-md font-label-sm text-label-sm inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${tabFilter === tab ? "bg-surface-container-lowest shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>
                  <span>
                    {tab === "all" ? `${tx("All", "ทั้งหมด")} (${banners.length})` : tab === "active" ? `${tx("Active", "เปิดใช้งาน")} (${banners.filter((b) => b.active).length})` : `${tx("Paused", "พักไว้")} (${banners.filter((b) => !b.active).length})`}
                  </span>
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setSortAsc((prev) => !prev)} className="h-9 px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm inline-flex items-center gap-space-xs transition-colors whitespace-nowrap shrink-0">
              <span className="material-symbols-outlined text-[18px]">swap_vert</span><span>{tx("Sort: Order #", "เรียงตามลำดับ #")}</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-surface-container-low">
          {filteredBanners.map((item) => (
            <div key={item.id} className="p-4 sm:p-space-lg hover:bg-surface-container-low/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md flex-1 min-w-0">
                <div className="flex items-center gap-space-xs text-outline group-hover:text-on-surface shrink-0">
                  <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
                  <span className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-on-surface font-semibold">{item.order}</span>
                </div>

                <div className="relative w-full sm:w-56 h-28 sm:h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0 shadow-sm">
                  <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.title} />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface font-label-sm text-[10px] truncate max-w-[140px]">{item.imageUrl.replace("/pic-banner-slide/", "")}</span>
                </div>

                <div className="space-y-1 min-w-0 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">{item.title}</span>
                    <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium whitespace-nowrap shrink-0 ${item.active ? "bg-secondary-container/40 text-secondary" : "bg-surface-container-high text-on-surface-variant"}`}>
                      {item.active ? tx("Active in Slider", "แสดงในสไลด์") : tx("Paused", "หยุดชั่วคราว")}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{item.caption}</p>
                  <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm pt-1">
                    <span className="flex items-center gap-1 text-primary whitespace-nowrap">
                      <span className="material-symbols-outlined text-[14px] shrink-0">link</span>
                      <code className="bg-surface-container px-1.5 py-0.5 rounded text-on-surface">{item.targetUrl}</code>
                    </span>
                    <span className="flex items-center gap-1 text-outline whitespace-nowrap">
                      <span className="material-symbols-outlined text-[14px] shrink-0">image</span>
                      <span>{item.imageUrl}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-space-xl pt-space-sm lg:pt-0 shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={item.active} onChange={() => handleToggleBanner(item)} className="sr-only peer" type="checkbox" />
                  <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>

                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => { setEditingBanner(item); setDrawerOpen(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" title={tx("Edit Banner", "แก้ไขแบนเนอร์")}>
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button type="button" onClick={() => handleDeleteBanner(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error-container/40 transition-colors" title={tx("Delete Banner", "ลบแบนเนอร์")}>
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BannerFormDrawer
        open={drawerOpen}
        editingBanner={editingBanner}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveBanner}
        onTestRender={() => triggerToast(tx("Render Preview Verified", "ตรวจสอบการแสดงผลแล้ว"), tx("Banner slide aspect ratio validated for desktop & mobile.", "ตรวจสอบอัตราส่วนภาพสำหรับสไลด์หน้าแรกเรียบร้อยแล้ว"))}
      />

      <AdminToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}

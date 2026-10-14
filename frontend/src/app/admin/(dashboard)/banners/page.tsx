"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AdminBannerItem, INITIAL_ADMIN_BANNERS } from "@/data/mockAdminData";
import BannerFormDrawer from "@/components/admin/banners/BannerFormDrawer";
import AdminToast from "@/components/admin/AdminToast";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminBannersPage() {
  const { tx } = useLanguage();
  const [banners, setBanners] = useState<AdminBannerItem[]>(INITIAL_ADMIN_BANNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabFilter, setTabFilter] = useState<"all" | "active" | "scheduled">("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBannerItem | null>(null);
  const [toast, setToast] = useState({ visible: false, title: "", message: "" });

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

  const handleSaveBanner = (data: { title: string; caption: string; targetUrl: string; order: number; scheduleLabel: string; active: boolean }) => {
    const isExt = data.targetUrl.startsWith("http");
    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? { ...b, ...data, isExternal: isExt, badgeText: isExt ? "External" : data.active ? "Active" : "Scheduled", badgeTone: isExt ? "external" : "active" }
            : b
        )
      );
      triggerToast(tx("Banner Updated", "อัปเดตแบนเนอร์แล้ว"), tx(`Saved changes to "${data.title}".`, `บันทึกการแก้ไข "${data.title}" แล้ว`));
    } else {
      const newBan: AdminBannerItem = {
        id: `ban-${Date.now()}`, order: data.order, title: data.title, caption: data.caption,
        badgeText: isExt ? "External" : "Active", badgeTone: isExt ? "external" : "active",
        targetUrl: data.targetUrl, isExternal: isExt, scheduleLabel: data.scheduleLabel,
        scheduleIcon: "calendar_today", clicks: "0", ctr: "0.0% CTR", active: data.active,
        imageUrl: INITIAL_ADMIN_BANNERS[0].imageUrl,
      };
      setBanners((prev) => [...prev, newBan]);
      triggerToast(tx("Banner Published", "เผยแพร่แบนเนอร์แล้ว"), tx(`Added "${data.title}" to storefront hero slider.`, `เพิ่ม "${data.title}" ลงในสไลด์หน้าแรกแล้ว`));
    }
    setDrawerOpen(false);
  };

  return (
    <div className="px-gutter-desktop py-space-xl max-w-[1600px] mx-auto w-full space-y-space-xl">
      {/* Top Action Bar & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary bg-primary-fixed px-space-sm py-0.5 rounded-full">
              {tx("Storefront CMS", "ระบบจัดการหน้าร้าน")}
            </span>
            <span className="text-outline text-body-sm">•</span>
            <span className="font-label-sm text-label-sm text-outline">
              {tx("Hero Slider Controller", "ควบคุมสไลด์แบนเนอร์หลัก")}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {tx("Homepage Promotional Banners", "จัดการแบนเนอร์โปรโมชั่นหน้าแรก")}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {tx(
              "Control active hero slider banners, campaign schedules, and storefront click targets across desktop and mobile entry points.",
              "จัดการแบนเนอร์สไลด์หน้าแรก ตารางเวลาแคมเปญ และลิงก์ปลายทางทั้งบนคอมพิวเตอร์และมือถือ"
            )}
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <Link href="/" className="h-9 px-space-md rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-body-sm text-body-sm flex items-center gap-space-xs shadow-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>{tx("Live Storefront Preview", "ดูตัวอย่างหน้าร้านจริง")}</span>
          </Link>
          <button type="button" onClick={() => { setEditingBanner(null); setDrawerOpen(true); }} className="h-9 px-space-lg rounded-lg bg-inverse-surface text-inverse-on-surface hover:opacity-90 font-body-sm text-body-sm flex items-center gap-space-xs shadow-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            <span className="font-medium">{tx("+ Add New Banner", "+ เพิ่มแบนเนอร์ใหม่")}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">{tx("Total Active Banners", "แบนเนอร์ที่แสดงผลอยู่")}</span>
            <span className="w-8 h-8 rounded-lg bg-secondary-container/40 text-on-secondary-fixed flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">view_carousel</span></span>
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <span className="font-headline-lg text-headline-lg text-on-surface">{banners.filter((b) => b.active).length} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">{tx("/ 6 Slots", "/ 6 ตำแหน่ง")}</span></span>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/30 px-space-xs py-0.5 rounded-full flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">check_circle</span> {tx("100% Health", "ปกติ 100%")}</span>
          </div>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">{tx("Total Click-throughs", "ยอดคลิกแบนเนอร์รวม")}</span>
            <span className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">ads_click</span></span>
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <span className="font-headline-lg text-headline-lg text-on-surface font-label-md">28,490</span>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary"><span className="material-symbols-outlined text-[16px]">trending_up</span><span>+18.4%</span></div>
          </div>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">{tx("Average Storefront CTR", "อัตราการคลิกเฉลี่ย (CTR)")}</span>
            <span className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">query_stats</span></span>
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <span className="font-headline-lg text-headline-lg text-on-surface font-label-md">9.2%</span>
            <span className="font-body-sm text-body-sm text-outline">{tx("Benchmark: 4.5%", "เกณฑ์มาตรฐาน: 4.5%")}</span>
          </div>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">{tx("Top Conversion Campaign", "แคมเปญยอดนิยมสูงสุด")}</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">military_tech</span></span>
          </div>
          <div className="mt-space-md">
            <div className="font-headline-sm text-headline-sm text-on-surface truncate">PayDay 15% Bonus</div>
            <div className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[14px]">local_fire_department</span><span>14,200 {tx("clicks", "คลิก")} (11.8% CTR)</span></div>
          </div>
        </div>
      </div>

      {/* Banner Manager Grid & Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="p-space-md bg-surface-container-lowest flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm flex-1 min-w-[280px] max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">search</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-inner" placeholder={tx("Search banner title, campaign tag, target link...", "ค้นหาชื่อแบนเนอร์, แคมเปญ หรือลิงก์ปลายทาง...")} type="text" />
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="flex items-center rounded-lg bg-surface-container-low p-0.5">
              <button type="button" onClick={() => setTabFilter("all")} className={`px-space-md py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 ${tabFilter === "all" ? "bg-surface-container-lowest shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>
                <span className="material-symbols-outlined text-[16px]">view_list</span><span>{tx("All", "ทั้งหมด")} ({banners.length})</span>
              </button>
              <button type="button" onClick={() => setTabFilter("active")} className={`px-space-md py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 ${tabFilter === "active" ? "bg-surface-container-lowest shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>
                <span>{tx("Active", "เปิดใช้งาน")} ({banners.filter((b) => b.active).length})</span>
              </button>
              <button type="button" onClick={() => setTabFilter("scheduled")} className={`px-space-md py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 ${tabFilter === "scheduled" ? "bg-surface-container-lowest shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>
                <span>{tx("Scheduled", "พัก/ตั้งเวลา")} ({banners.filter((b) => !b.active).length})</span>
              </button>
            </div>

            <button type="button" onClick={() => setSortAsc((prev) => !prev)} className="h-9 px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm flex items-center gap-space-xs transition-colors">
              <span className="material-symbols-outlined text-[18px]">swap_vert</span><span>{tx("Sort: Order #", "เรียงตามลำดับ #")}</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-surface-container-low">
          {filteredBanners.map((item) => (
            <div key={item.id} className="p-space-lg hover:bg-surface-container-low/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg group">
              <div className="flex items-start sm:items-center gap-space-md flex-1 min-w-0">
                <div className="flex items-center gap-space-xs text-outline group-hover:text-on-surface cursor-grab">
                  <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
                  <span className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-on-surface font-semibold">{item.order}</span>
                </div>

                <div className="relative w-44 sm:w-56 h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0 shadow-sm">
                  <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.title} />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface font-label-sm text-[10px]">1920x600</span>
                  {item.heroBadge && <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-[10px] font-medium">{item.heroBadge}</span>}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">{item.title}</span>
                    <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium ${item.badgeTone === "external" ? "bg-surface-container-high text-on-surface-variant" : "bg-secondary-container/40 text-secondary"}`}>
                      {item.active ? item.badgeText : tx("Paused", "หยุดชั่วคราว")}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{item.caption}</p>
                  <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm pt-1">
                    <span className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[14px]">{item.isExternal ? "open_in_new" : "link"}</span>
                      <code className="bg-surface-container px-1.5 py-0.5 rounded text-on-surface">{item.targetUrl}</code>
                    </span>
                    <span className="flex items-center gap-1 text-outline">
                      <span className="material-symbols-outlined text-[14px]">{item.scheduleIcon}</span>
                      <span>{item.scheduleLabel}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-space-xl pt-space-sm lg:pt-0">
                <div className="text-right">
                  <div className="font-label-md text-label-md text-on-surface font-semibold">{item.clicks} <span className="text-on-surface-variant font-normal">{tx("clicks", "คลิก")}</span></div>
                  <div className="font-label-sm text-label-sm text-secondary flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[13px]">show_chart</span><span>{item.ctr}</span></div>
                </div>

                <div className="flex items-center gap-space-xs">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked={item.active}
                      onChange={() => {
                        setBanners((prev) => prev.map((b) => (b.id === item.id ? { ...b, active: !b.active } : b)));
                        triggerToast(tx("Banner Status Updated", "อัปเดตสถานะแบนเนอร์แล้ว"), tx(`Toggled visibility for "${item.title}".`, `สลับการแสดงผลของ "${item.title}" แล้ว`));
                      }}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => { setEditingBanner(item); setDrawerOpen(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" title={tx("Edit Banner", "แก้ไขแบนเนอร์")}>
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button type="button" onClick={() => { setBanners((prev) => prev.filter((b) => b.id !== item.id)); triggerToast(tx("Banner Deleted", "ลบแบนเนอร์แล้ว"), tx(`Removed "${item.title}" from carousel.`, `ลบ "${item.title}" ออกจากสไลด์แล้ว`)); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error-container/40 transition-colors" title={tx("Delete Banner", "ลบแบนเนอร์")}>
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-space-lg py-space-md bg-surface-container-low/60 flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">info</span>{tx("Drag row icons or change numeric priority to adjust hero carousel sequencing.", "ลากไอคอนหรือเปลี่ยนตัวเลขลำดับเพื่อจัดเรียงสไลด์แบนเนอร์หน้าแรก")}</span>
          <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
            <span>{tx("Carousel Speed:", "ความเร็วสไลด์:")} <strong className="text-on-surface font-medium">5.0s</strong></span><span>•</span><span>{tx("Max Concurrent:", "สูงสุดพร้อมกัน:")} <strong className="text-on-surface font-medium">6</strong></span>
          </div>
        </div>
      </div>

      <BannerFormDrawer
        open={drawerOpen}
        editingBanner={editingBanner}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveBanner}
        onTestRender={() => triggerToast(tx("Render Preview Verified", "ตรวจสอบการแสดงผลแล้ว"), tx("1920x600 aspect ratio validated for desktop & mobile viewports.", "อัตราส่วน 1920x600 ถูกต้องสำหรับทั้งเดสก์ท็อปและมือถือ"))}
      />

      <AdminToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}

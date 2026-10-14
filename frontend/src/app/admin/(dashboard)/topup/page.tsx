"use client";

import React, { useState } from "react";
import { AdminTopUpPackage, INITIAL_TOPUP_PACKAGES } from "@/data/mockAdminData";
import PackagesTable from "@/components/admin/packages/PackagesTable";
import PackageFormDrawer from "@/components/admin/packages/PackageFormDrawer";
import GatewayLatencyModal from "@/components/admin/packages/GatewayLatencyModal";
import AdminToast from "@/components/admin/AdminToast";
import { useLanguage } from "@/context/LanguageContext";

const PROVIDERS = [
  {
    id: "rov" as const, name: "Arena of Valor", sub: "(RoV)",
    statusEn: "Automated IQ-Bank API Connected", statusTh: "เชื่อมต่อ API อัตโนมัติ IQ-Bank", dotColor: "bg-secondary",
    inputModeEn: "Player UID", inputModeTh: "UID ผู้เล่น", activeBadgeEn: "14 Packages Active", activeBadgeTh: "เปิดใช้งาน 14 แพ็กเกจ",
    slaBadge: "0.8s SLA", slaClass: "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant",
    throughput: "฿142,890.00", successRateEn: "99.8% Success", successRateTh: "สำเร็จ 99.8%", txns: "1,402 Txns",
    queueEn: "Default Queue: Direct IQ-Direct", queueTh: "คิวหลัก: IQ-Direct โดยตรง",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAh9coHoZg4P5b5OeEIRFJCBq1DBC3HLVDHJQYjy9iHimvgWTaKBirLnGmp6fNpll1sE34X_K1BjRMrycJZHS3w-Rtd5C-1v_OnaybShb0-7HWYIiOxgEVHhiLGbhpgNxsrnzKAf0r8xf6QsiAlPzLSana2e2dlSZB8UGW68UgNwcN3hmySZmZF0DS5DDOK_cY4r6fD8IXZXGSFnVts6HY68o04xf2TZev6ciH_0SBeusxjW5kLLSYU",
  },
  {
    id: "freefire" as const, name: "Free Fire", sub: "(Garena)",
    statusEn: "Instant Server Inject", statusTh: "เติมเข้าเซิร์ฟเวอร์ทันที", dotColor: "bg-secondary",
    inputModeEn: "Player UID", inputModeTh: "UID ผู้เล่น", activeBadgeEn: "18 Packages Active", activeBadgeTh: "เปิดใช้งาน 18 แพ็กเกจ",
    slaBadge: "Flash Inject", slaClass: "bg-secondary-container/50 text-on-secondary-fixed",
    throughput: "฿98,420.00", successRateEn: "99.1% Success", successRateTh: "สำเร็จ 99.1%", txns: "2,310 Txns",
    queueEn: "Default Queue: Direct WebSocket", queueTh: "คิวหลัก: WebSocket โดยตรง",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQoZTZrRbhil6XYYWzAIuH57fobVsRhR-dYlaMEXU0QkZsqT8Fd9QHQPssaOdhHwzENrCCoBKY5DPKqF_lMS7t6h5E_OTLIpRDvBo7GgJB28dUvgzTivhts7o38rbjNySIAeSpHOCCxleW2F5MgUv7mX-D_pVVrIOpXibbguwj-T2ULGtadV0jAkRo1CwcEeEdwjA03JxKJvWroc2yRGAq75Tj4hRh2s8rYfsvhJALMHOlSgk7xe3A",
  },
  {
    id: "roblox" as const, name: "Roblox", sub: "(Selected)",
    statusEn: "Bot Queue Managed", statusTh: "จัดการด้วยคิวบอทอัตโนมัติ", dotColor: "bg-tertiary",
    inputModeEn: "User & Pass", inputModeTh: "ไอดี & รหัสผ่าน", activeBadgeEn: "10 Packages Active", activeBadgeTh: "เปิดใช้งาน 10 แพ็กเกจ",
    slaBadge: "Worker Pool: 8 Bots", slaClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    throughput: "฿214,150.00", successRateEn: "97.6% Success", successRateTh: "สำเร็จ 97.6%", txns: "890 Txns",
    queueEn: "Viewing Packages", queueTh: "กำลังดูแพ็กเกจ",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkqdxzxK_BV54TD1yH5sKBV3zJG_rqGd5cgyq6rEX0fZW8xHHeCqq37Ee0IQPfEK5ns1PPD_2Z0vmEng5OpuES90qTRo3wx9u0rGpwiiqq3THfs4mLtQ7oQpBYHp07s2emsxJ8ED_eBgADHkVbleg_OXZqK2HxU2Wigw7D71dvynKl-8Hh5aW7bcycb8QYF0UgQ4O8X6EnV2y4D6h3tgfGMzM8N4bJwZRQDDkvffRagsCAAXztSX7K",
  },
];

export default function AdminTopUpPage() {
  const { tx } = useLanguage();
  const [selectedGame, setSelectedGame] = useState<"roblox" | "rov" | "freefire">("roblox");
  const [providerEnabled, setProviderEnabled] = useState({ rov: true, freefire: true, roblox: true });
  const [packages, setPackages] = useState<AdminTopUpPackage[]>(INITIAL_TOPUP_PACKAGES);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<AdminTopUpPackage | null>(null);
  const [latencyModalOpen, setLatencyModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: "", message: "" });

  const triggerToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleSavePackage = (data: {
    game: "Roblox" | "RoV" | "FreeFire";
    name: string;
    denomination: string;
    cost: number;
    price: number;
    tag: string;
  }) => {
    if (editingPkg) {
      setPackages((prev) => prev.map((p) => (p.sku === editingPkg.sku ? { ...p, ...data } : p)));
      triggerToast(tx("SKU Updated", "อัปเดตแพ็กเกจแล้ว"), tx(`Updated ${editingPkg.sku} pricing and margin.`, `อัปเดตราคาและกำไรของ ${editingPkg.sku} เรียบร้อย`));
    } else {
      const newSku = `AUTO-GEN-${Math.floor(Math.random() * 9000 + 1000)}`;
      const newPkg: AdminTopUpPackage = {
        sku: newSku,
        name: data.name,
        subtitle: `SKU: ${newSku} • Ready`,
        icon: "diamond",
        iconStyle: "surface",
        tag: data.tag,
        tagStyle: data.tag === "Standard" ? "standard" : "secondary",
        cost: data.cost,
        price: data.price,
        denomination: data.denomination,
        game: data.game,
        active: true,
      };
      setPackages((prev) => [newPkg, ...prev]);
      triggerToast(tx("SKU Published", "เพิ่มแพ็กเกจสำเร็จ"), tx(`${data.name} (${newSku}) added to live storefront.`, `เพิ่ม ${data.name} (${newSku}) ลงหน้าร้านแล้ว`));
    }
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col w-full p-margin-desktop gap-space-2xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span>{tx("Catalog Operations", "จัดการระบบสินค้า")}</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-medium">{tx("Automated Pipeline", "ท่อส่งข้อมูลอัตโนมัติ")}</span>
          </div>
          <div className="flex items-center gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {tx("Top-Up Games & Packages", "เกมเติมเงิน & แพ็กเกจ")}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-fixed font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              {tx("Gateway Online", "เกตเวย์ออนไลน์")}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {tx(
              "Manage automated credit dispatchers, vendor wholesale exchange margins, and game provider API webhooks in real-time.",
              "จัดการระบบเติมเครดิตอัตโนมัติ ต้นทุนและส่วนต่างกำไร รวมถึง API Webhook ของผู้ให้บริการเกมแบบเรียลไทม์"
            )}
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <button type="button" onClick={() => setLatencyModalOpen(true)} className="flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm shadow-sm hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-[18px] text-tertiary">hub</span>
            <span>{tx("Gateway Metrics", "ความหน่วงเกตเวย์")}</span>
          </button>
          <button type="button" onClick={() => { setEditingPkg(null); setDrawerOpen(true); }} className="flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-body-sm text-body-sm shadow-sm hover:bg-primary-container transition-all">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{tx("+ Add Top-Up Package", "+ เพิ่มแพ็กเกจเติมเกม")}</span>
          </button>
        </div>
      </div>

      {/* Supported Providers (3 Active) */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">sports_esports</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {tx("Supported Providers (3 Active)", "ผู้ให้บริการเกมที่รองรับ (ออนไลน์ 3 ค่าย)")}
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            {tx("Queue Routing & Protocols", "เส้นทางคิวและโปรโตคอล")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {PROVIDERS.map((prov) => {
            const isSelected = selectedGame === prov.id;
            const isEnabled = providerEnabled[prov.id];
            return (
              <div
                key={prov.id}
                onClick={() => setSelectedGame(prov.id)}
                className={`group relative flex flex-col justify-between p-space-xl rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
                  isSelected ? "border-primary" : "border-transparent"
                }`}
              >
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-space-md">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container relative shrink-0 shadow-sm">
                        <img className="w-full h-full object-cover" src={prov.imageUrl} alt={prov.name} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">{prov.name}</h3>
                          <span className={`font-label-sm text-label-sm ${isSelected ? "text-primary font-medium" : "text-outline"}`}>
                            {isSelected ? tx("(Selected)", "(กำลังเลือก)") : prov.sub}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${prov.dotColor}`}></span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {tx(prov.statusEn, prov.statusTh)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                      <input
                        checked={isEnabled}
                        onChange={(e) => {
                          setProviderEnabled((prev) => ({ ...prev, [prov.id]: e.target.checked }));
                          triggerToast(
                            tx("Provider Status Updated", "อัปเดตสถานะค่ายเกมแล้ว"),
                            tx(`${prov.name} set to ${e.target.checked ? "Active" : "Maintenance Mode"}.`, `ตั้งค่า ${prov.name} เป็น ${e.target.checked ? "เปิดใช้งาน" : "ปิดปรับปรุง"}`)
                          );
                        }}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-surface-container-high after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="px-space-sm py-space-xs rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      {tx("Input Mode", "ข้อมูลที่ใช้")}: <strong className="text-on-surface">{tx(prov.inputModeEn, prov.inputModeTh)}</strong>
                    </span>
                    <span className="px-space-sm py-space-xs rounded-lg bg-primary-fixed/60 text-on-primary-fixed-variant font-label-sm text-label-sm">
                      {tx(prov.activeBadgeEn, prov.activeBadgeTh)}
                    </span>
                    <span className={`px-space-sm py-space-xs rounded-lg font-label-sm text-label-sm ${prov.slaClass}`}>{prov.slaBadge}</span>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-outline uppercase">{tx("24h Throughput", "ยอดเติม 24 ชม.")}</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">{prov.throughput}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="font-label-sm text-label-sm text-secondary font-medium">{tx(prov.successRateEn, prov.successRateTh)}</span>
                      <span className="font-label-sm text-label-sm text-outline">{prov.txns}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-space-lg pt-space-md flex items-center justify-between">
                  {isSelected ? (
                    <span className="font-body-sm text-body-sm text-primary font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span> {tx("Viewing Packages", "กำลังดูแพ็กเกจ")}
                    </span>
                  ) : (
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{tx(prov.queueEn, prov.queueTh)}</span>
                  )}
                  <button
                    type="button"
                    className={
                      isSelected
                        ? "px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm transition-colors flex items-center gap-1"
                        : "px-space-md py-1.5 rounded-lg bg-surface-container-high text-on-surface font-body-sm text-body-sm hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1"
                    }
                  >
                    <span>{isSelected ? tx("Configured", "ตั้งค่าอยู่") : tx("Manage Packages", "จัดการแพ็กเกจ")}</span>
                    <span className="material-symbols-outlined text-[16px]">{isSelected ? "check" : "arrow_forward"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <PackagesTable
        selectedGame={selectedGame}
        packages={packages}
        onOpenNew={() => { setEditingPkg(null); setDrawerOpen(true); }}
        onEdit={(pkg) => { setEditingPkg(pkg); setDrawerOpen(true); }}
        onDelete={(sku) => {
          setPackages((prev) => prev.filter((p) => p.sku !== sku));
          triggerToast(tx("Package Deleted", "ลบแพ็กเกจแล้ว"), tx(`Removed SKU ${sku} from catalog.`, `ลบแพ็กเกจ ${sku} ออกจากรายการแล้ว`));
        }}
        onToggleActive={(sku) => {
          setPackages((prev) => prev.map((p) => (p.sku === sku ? { ...p, active: !p.active } : p)));
          triggerToast(tx("SKU Status Toggled", "เปลี่ยนสถานะแพ็กเกจแล้ว"), tx(`Updated availability for ${sku}.`, `อัปเดตสถานะการเปิดขายของ ${sku} แล้ว`));
        }}
      />

      <PackageFormDrawer open={drawerOpen} editingPackage={editingPkg} onClose={() => setDrawerOpen(false)} onSave={handleSavePackage} />
      <GatewayLatencyModal open={latencyModalOpen} onClose={() => setLatencyModalOpen(false)} />
      <AdminToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}

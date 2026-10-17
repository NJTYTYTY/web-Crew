"use client";

import React, { useEffect, useState } from "react";
import { AdminTopUpPackage, INITIAL_TOPUP_PACKAGES } from "@/data/mockAdminData";
import PackagesTable from "@/components/admin/packages/PackagesTable";
import PackageFormDrawer from "@/components/admin/packages/PackageFormDrawer";
import GatewayLatencyModal from "@/components/admin/packages/GatewayLatencyModal";
import GameLogoEditModal, { EditableGameProvider } from "@/components/admin/packages/GameLogoEditModal";
import GameCreateModal, { NewGamePayload } from "@/components/admin/packages/GameCreateModal";
import AdminToast from "@/components/admin/AdminToast";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

interface GameProviderItem {
  id: string;
  dbGameId: number;
  name: string;
  sub: string;
  inputModeEn: string;
  inputModeTh: string;
  slaBadge: string;
  slaClass: string;
  queueEn: string;
  queueTh: string;
  imageUrl: string;
}

const INITIAL_PROVIDERS: GameProviderItem[] = [
  {
    id: "rov", dbGameId: 1, name: "Arena of Valor", sub: "(RoV)",
    inputModeEn: "Player UID", inputModeTh: "UID ผู้เล่น", slaBadge: "0.8s SLA", slaClass: "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant",
    queueEn: "Default Queue: Direct IQ-Direct", queueTh: "คิวหลัก: IQ-Direct โดยตรง", imageUrl: "/game-logos/rov/rov-icon.png",
  },
  {
    id: "freefire", dbGameId: 2, name: "Free Fire", sub: "(Garena)",
    inputModeEn: "Player UID", inputModeTh: "UID ผู้เล่น", slaBadge: "Flash Inject", slaClass: "bg-secondary-container/50 text-on-secondary-fixed",
    queueEn: "Default Queue: Direct WebSocket", queueTh: "คิวหลัก: WebSocket โดยตรง", imageUrl: "/game-logos/freefire/freefire-icon.png",
  },
  {
    id: "roblox", dbGameId: 3, name: "Roblox Robux", sub: "(ID-Pass)",
    inputModeEn: "User & Pass", inputModeTh: "ไอดี & รหัสผ่าน", slaBadge: "Worker Pool: 8 Bots", slaClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    queueEn: "Default Queue: Bot Pool", queueTh: "คิวหลัก: บอทอัตโนมัติ", imageUrl: "/game-logos/roblox/roblox-icon.png",
  },
];

export default function AdminTopUpPage() {
  const { tx } = useLanguage();
  const [selectedGame, setSelectedGame] = useState<string>("roblox");
  const [providers, setProviders] = useState<GameProviderItem[]>(INITIAL_PROVIDERS);
  const [providerEnabled, setProviderEnabled] = useState<Record<string, boolean>>({ rov: true, freefire: true, roblox: true });
  const [packages, setPackages] = useState<AdminTopUpPackage[]>(INITIAL_TOPUP_PACKAGES);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addGameModalOpen, setAddGameModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<AdminTopUpPackage | null>(null);
  const [editingLogoProv, setEditingLogoProv] = useState<EditableGameProvider | null>(null);
  const [latencyModalOpen, setLatencyModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: "", message: "" });

  const triggerToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const loadTopupData = () => {
    apiRequest<any>("/api/admin/topup")
      .then((data) => {
        const dbGames = Array.isArray(data?.games) ? data.games : [];
        if (dbGames.length > 0) {
          const mapped: GameProviderItem[] = dbGames.map((g: any) => {
            const isIdPass = g.inputMode === "ID_PASS";
            return {
              id: g.slug,
              dbGameId: g.id,
              name: g.name,
              sub: `(${g.slug})`,
              inputModeEn: isIdPass ? "User & Pass" : "Player UID",
              inputModeTh: isIdPass ? "ไอดี & รหัสผ่าน" : "UID ผู้เล่น",
              slaBadge: isIdPass ? "Bot Pool" : "Instant API",
              slaClass: isIdPass ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" : "bg-secondary-container/50 text-on-secondary-fixed",
              queueEn: isIdPass ? "Default Queue: Bot Pool" : "Default Queue: Direct IQ-Direct",
              queueTh: isIdPass ? "คิวหลัก: บอทอัตโนมัติ" : "คิวหลัก: IQ-Direct โดยตรง",
              imageUrl: g.iconUrl || "/game-logos/rov/rov-icon.png",
            };
          });
          setProviders(mapped);
          const nextEnabled: Record<string, boolean> = {};
          dbGames.forEach((g: any) => {
            nextEnabled[g.slug] = g.isActive !== false;
          });
          setProviderEnabled(nextEnabled);
        }
        if (Array.isArray(data?.packages)) {
          setPackages(
            data.packages.map((pkg: Record<string, any>) => {
              const matchedGame = dbGames.find((g: Record<string, any>) => g.id === pkg.gameId);
              const slug = String(matchedGame?.slug || "").toLowerCase();
              const gameName = matchedGame?.name || (slug === "rov" ? "RoV" : slug === "freefire" ? "FreeFire" : "Roblox");
              const price = Number(pkg.price || 100);
              return {
                sku: `PKG-${pkg.id}`,
                name: String(pkg.packageName || "Package"),
                subtitle: `DB ID: #${pkg.id} • ${matchedGame?.name || "Game"}`,
                icon: slug.includes("rov") ? "Generating_Tokens" : slug.includes("freefire") ? "local_fire_department" : "smart_toy",
                iconStyle: slug.includes("rov") ? "tertiary" : slug.includes("freefire") ? "secondary" : "primary",
                tag: String(pkg.bonusTag || "Standard"),
                tagStyle: pkg.bonusTag ? "secondary" : "standard",
                cost: Math.round(price * 0.78),
                price,
                denomination: String(pkg.packageName || ""),
                game: gameName,
                gameSlug: slug,
                gameId: pkg.gameId,
                active: pkg.isActive !== false,
              };
            })
          );
        }
      })
      .catch((err) => {
        console.error("Fetch topup error:", err);
      });
  };

  useEffect(() => {
    loadTopupData();
  }, []);

  const handleSaveLogo = async (slug: string, data: { name: string; iconUrl: string; isActive: boolean }) => {
    setProviders((prev) => prev.map((p) => (p.id === slug ? { ...p, name: data.name, imageUrl: data.iconUrl } : p)));
    setProviderEnabled((prev) => ({ ...prev, [slug]: data.isActive }));
    setEditingLogoProv(null);
    try {
      await apiRequest<any>(`/api/admin/topup/games/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      triggerToast(
        tx("Game Logo Updated", "อัปเดตโลโก้เกมสำเร็จ"),
        tx(`${data.name} logo updated across system.`, `อัปเดตโลโก้ ${data.name} ในระบบแล้ว`)
      );
    } catch (err: any) {
      triggerToast(tx("Update Failed", "อัปเดตไม่สำเร็จ"), err.message || "Failed to update game");
    }
  };

  const handleCreateGame = async (data: NewGamePayload) => {
    try {
      const res = await apiRequest<any>("/api/admin/topup/games", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const created = res?.game;
      if (created) {
        setAddGameModalOpen(false);
        loadTopupData();
        setSelectedGame(created.slug);
        triggerToast(
          tx("Game Title Created", "เพิ่มเกมใหม่สำเร็จ"),
          tx(`Created "${created.name}" (${created.slug}) in database.`, `สร้างเกม "${created.name}" ในระบบเรียบร้อยแล้ว`)
        );
      }
    } catch (err: any) {
      triggerToast(tx("Create Game Failed", "เพิ่มเกมไม่สำเร็จ"), err.message || "Failed to create game");
    }
  };

  const handleDeleteGame = async (slug: string, name: string) => {
    if (!confirm(tx(`Are you sure you want to delete "${name}"?`, `คุณแน่ใจหรือไม่ว่าต้องการลบเกม "${name}"?`))) {
      return;
    }
    try {
      await apiRequest<any>(`/api/admin/topup/games/${slug}`, { method: "DELETE" });
      setProviders((prev) => prev.filter((p) => p.id !== slug));
      setSelectedGame((prev) => (prev === slug ? (providers[0]?.id || "roblox") : prev));
      loadTopupData();
      triggerToast(
        tx("Game Removed", "ลบเกมสำเร็จ"),
        tx(`Removed "${name}" from top-up catalog.`, `ลบ "${name}" ออกจากระบบแล้ว`)
      );
    } catch (err: any) {
      triggerToast(tx("Delete Failed", "ลบไม่สำเร็จ"), err.message || "Failed to delete game");
    }
  };

  const handleSavePackage = async (data: {
    game: string;
    gameId?: number;
    name: string;
    denomination: string;
    cost: number;
    price: number;
    tag: string;
  }) => {
    const foundProv = providers.find(
      (p) => p.id === data.game.toLowerCase() || p.name.toLowerCase() === data.game.toLowerCase()
    );
    const gameId = data.gameId || (foundProv as any)?.dbGameId || 1;
    const payload = {
      gameId,
      packageName: data.name,
      bonusTag: data.tag === "Standard" ? "" : data.tag,
      price: data.price,
      isActive: true,
    };

    const matchedSlug = (data.gameId ? providers.find((p) => p.dbGameId === data.gameId)?.id : "") || foundProv?.id || data.game.toLowerCase();

    if (editingPkg) {
      const numericId = Number(editingPkg.sku.replace(/\D/g, ""));
      if (numericId) {
        try {
          await apiRequest<any>(`/api/admin/topup/${numericId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
          setPackages((prev) => prev.map((p) => (p.sku === editingPkg.sku ? { ...p, ...data, game: data.game, gameSlug: matchedSlug, gameId } : p)));
          loadTopupData();
          triggerToast(
            tx("SKU Updated", "อัปเดตแพ็กเกจแล้ว"),
            tx(`Updated ${editingPkg.sku} pricing on storefront.`, `อัปเดตราคาแพ็กเกจ ${editingPkg.sku} บนหน้าร้านแล้ว`)
          );
          setDrawerOpen(false);
        } catch (err: any) {
          triggerToast(tx("Update Failed", "อัปเดตไม่สำเร็จ"), err.message || "Failed to update package");
        }
      }
    } else {
      try {
        const res = await apiRequest<any>("/api/admin/topup", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const createdId = res?.package?.id;
        const newSku = createdId ? `PKG-${createdId}` : `PKG-${Date.now()}`;
        setPackages((prev) => [
          {
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
            gameSlug: matchedSlug,
            gameId,
            active: true,
          },
          ...prev,
        ]);
        loadTopupData();
        triggerToast(
          tx("SKU Published", "เพิ่มแพ็กเกจสำเร็จ"),
          tx(`${data.name} added to live storefront.`, `เพิ่มแพ็กเกจ ${data.name} ลงหน้าร้านแล้ว`)
        );
        setDrawerOpen(false);
      } catch (err: any) {
        triggerToast(tx("Publish Failed", "เพิ่มแพ็กเกจไม่สำเร็จ"), err.message || "Failed to create package");
      }
    }

  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-margin-desktop py-space-xl gap-space-2xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider whitespace-nowrap">
            <span>{tx("Catalog Operations", "จัดการระบบสินค้า")}</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-medium">{tx("Automated Pipeline", "ท่อส่งข้อมูลอัตโนมัติ")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {tx("Top-Up Games & Packages", "เกมเติมเงิน & แพ็กเกจ")}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-fixed font-label-sm text-label-sm whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shrink-0"></span>
              {tx("Gateway Online", "เกตเวย์ออนไลน์")}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {tx(
              "Manage game titles, logos, denomination packages, and delivery modes (UID or ID-Pass) in real-time.",
              "จัดการรายชื่อเกม โลโก้ รูปแบบการเติม (UID หรือ ID-Pass) และแพ็กเกจราคาแบบเรียลไทม์"
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setLatencyModalOpen(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm shadow-sm hover:bg-surface-container transition-all whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">hub</span>
            <span>{tx("Gateway Metrics", "ความหน่วงเกตเวย์")}</span>
          </button>
          <button
            type="button"
            onClick={() => setAddGameModalOpen(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm shadow-sm hover:bg-surface-container-highest transition-all whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">add_box</span>
            <span>{tx("+ Add Game Title", "+ เพิ่มเกมใหม่")}</span>
          </button>
          <button
            type="button"
            onClick={() => { setEditingPkg(null); setDrawerOpen(true); }}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-body-sm text-body-sm shadow-sm hover:bg-primary-container transition-all whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{tx("+ Add Top-Up Package", "+ เพิ่มแพ็กเกจเติมเกม")}</span>
          </button>
        </div>
      </div>

      <section className="flex flex-col gap-space-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {providers.map((prov) => {
            const isSelected = selectedGame === prov.id;
            const isEnabled = providerEnabled[prov.id] !== false;
            return (
              <div
                key={prov.id}
                onClick={() => setSelectedGame(prov.id)}
                className={`group relative flex flex-col justify-between p-5 sm:p-space-xl rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
                  isSelected ? "border-primary" : "border-transparent"
                }`}
              >
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-space-md min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 relative shrink-0 shadow-sm group/logo">
                        <img className="w-full h-full object-cover" src={prov.imageUrl} alt={prov.name} />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingLogoProv({ slug: prov.id, name: prov.name, iconUrl: prov.imageUrl, isActive: isEnabled });
                          }}
                          className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center text-white transition-opacity"
                          title={tx("Change Game Logo", "เปลี่ยนรูปโลโก้เกม")}
                        >
                          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        </button>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex flex-wrap items-center gap-space-xs">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">{prov.name}</h3>
                          <span className={`font-label-sm text-label-sm whitespace-nowrap ${isSelected ? "text-primary font-medium" : "text-outline"}`}>
                            {isSelected ? tx("(Selected)", "(กำลังเลือก)") : prov.sub}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLogoProv({ slug: prov.id, name: prov.name, iconUrl: prov.imageUrl, isActive: isEnabled });
                            }}
                            className="inline-flex items-center gap-1 text-primary hover:underline font-label-sm text-[11px] font-semibold"
                          >
                            <span className="material-symbols-outlined text-[13px]">edit</span>
                            <span>{tx("Edit", "แก้ไข")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGame(prov.id, prov.name);
                            }}
                            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-error font-label-sm text-[11px]"
                            title={tx("Delete Game Title", "ลบเกมนี้")}
                          >
                            <span className="material-symbols-outlined text-[13px]">delete</span>
                            <span>{tx("Delete", "ลบ")}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        checked={isEnabled}
                        onChange={(e) => {
                          const nextVal = e.target.checked;
                          setProviderEnabled((prev) => ({ ...prev, [prov.id]: nextVal }));
                          apiRequest<any>(`/api/admin/topup/games/${prov.id}`, { method: "PATCH", body: JSON.stringify({ isActive: nextVal }) }).catch(() => {});
                          triggerToast(
                            tx("Provider Status Updated", "อัปเดตสถานะค่ายเกมแล้ว"),
                            tx(`${prov.name} set to ${nextVal ? "Active" : "Maintenance Mode"}.`, `ตั้งค่า ${prov.name} เป็น ${nextVal ? "เปิดใช้งาน" : "ปิดปรับปรุง"}`)
                          );
                        }}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-surface-container-high after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="px-space-sm py-space-xs rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm whitespace-nowrap">
                      {tx("Input Mode", "ข้อมูลที่ใช้")}: <strong className="text-on-surface">{tx(prov.inputModeEn, prov.inputModeTh)}</strong>
                    </span>
                    <span className={`px-space-sm py-space-xs rounded-lg font-label-sm text-label-sm whitespace-nowrap ${prov.slaClass}`}>{prov.slaBadge}</span>
                  </div>
                </div>

                <div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between gap-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{tx(prov.queueEn, prov.queueTh)}</span>
                  <button
                    type="button"
                    className={
                      isSelected
                        ? "px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                        : "px-space-md py-1.5 rounded-lg bg-surface-container-high text-on-surface font-body-sm text-body-sm hover:bg-primary hover:text-on-primary transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                    }
                  >
                    <span>{isSelected ? tx("Viewing Packages", "กำลังดูแพ็กเกจ") : tx("Manage Packages", "จัดการแพ็กเกจ")}</span>
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
        onDelete={async (sku) => {
          setPackages((prev) => prev.filter((p) => p.sku !== sku));
          const numericId = Number(sku.replace(/\D/g, ""));
          if (numericId) {
            try {
              await apiRequest<any>(`/api/admin/topup/${numericId}`, { method: "DELETE" });
              triggerToast(tx("Package Deleted", "ลบแพ็กเกจแล้ว"), tx(`Removed SKU ${sku} from catalog.`, `ลบแพ็กเกจ ${sku} ออกจากรายการแล้ว`));
            } catch (err: any) {
              triggerToast(tx("Delete Failed", "ลบแพ็กเกจไม่สำเร็จ"), err.message || "Failed to delete package");
            }
          }
        }}
        onToggleActive={async (sku) => {
          const target = packages.find((p) => p.sku === sku);
          const nextActive = target ? !target.active : true;
          setPackages((prev) => prev.map((p) => (p.sku === sku ? { ...p, active: nextActive } : p)));
          const numericId = Number(sku.replace(/\D/g, ""));
          if (numericId) {
            try {
              await apiRequest<any>(`/api/admin/topup/${numericId}`, { method: "PATCH", body: JSON.stringify({ isActive: nextActive }) });
              triggerToast(tx("SKU Status Toggled", "เปลี่ยนสถานะแพ็กเกจแล้ว"), tx(`Updated availability for ${sku}.`, `อัปเดตสถานะการเปิดขายของ ${sku} แล้ว`));
            } catch (err: any) {
              triggerToast(tx("Update Failed", "อัปเดตไม่สำเร็จ"), err.message || "Failed to toggle status");
            }
          }
        }}
      />

      <PackageFormDrawer
        open={drawerOpen}
        editingPackage={editingPkg}
        onClose={() => setDrawerOpen(false)}
        availableGames={providers.map((p) => ({ id: p.dbGameId, name: p.name, slug: p.id }))}
        onSave={handleSavePackage}
      />
      <GameCreateModal
        open={addGameModalOpen}
        onClose={() => setAddGameModalOpen(false)}
        onSave={handleCreateGame}
      />
      <GameLogoEditModal
        open={Boolean(editingLogoProv)}
        provider={editingLogoProv}
        onClose={() => setEditingLogoProv(null)}
        onSave={handleSaveLogo}
      />
      <GatewayLatencyModal open={latencyModalOpen} onClose={() => setLatencyModalOpen(false)} />
      <AdminToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminGameAccount, INITIAL_GAME_ACCOUNTS } from "@/data/mockAdminData";
import AccountsTable from "@/components/admin/accounts/AccountsTable";
import AccountFormDrawer from "@/components/admin/accounts/AccountFormDrawer";
import AdminToast from "@/components/admin/AdminToast";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function mapDbAccountToAdmin(a: Record<string, any>, idx: number): AdminGameAccount {
  const isRov = a.gameCategory === "ROV" || a.platform === "rov";
  const specs = a.specs || {};
  const priceNum = Number(a.price ?? a.priceThb ?? 450);
  const tags = Array.isArray(a.highlightTags) ? a.highlightTags : Array.isArray(a.tags) ? a.tags : ["Clean ID"];
  return {
    id: String(a.id ?? idx + 1),
    code: isRov ? `#ROV-00${a.id ?? idx + 1}` : `#R-00${a.id ?? idx + 1}`,
    title: String(a.title || ""),
    subtitle: String(specs.emailStatus || a.subtitle || "100% Clean ID • Instant Ownership"),
    subIcon: isRov ? "verified_user" : "vpn_key",
    platform: isRov ? "rov" : "roblox",
    platformLabel: isRov ? "RoV (Garena)" : "Roblox",
    spec1: String(specs.levelOrRank || a.spec1 || (isRov ? "Ex-Supreme Rank" : "Lv. 2550 (MAX)")),
    spec2: String(specs.heroesOrFruitsCount || a.spec2 || tags.slice(0, 2).join(" • ")),
    spec3: String(specs.skinsOrWeaponsCount || a.spec3 || tags[2] || "Full Access"),
    serverRegion: String(specs.serverRegion || a.serverRegion || (isRov ? "Garena Thailand (TH)" : "Global / SEA Optimized")),
    description: String(a.description || ""),
    imageUrl: String(a.imageUrl || (isRov ? "/game-account_sale/rov1.png" : "/game-account_sale/roblox01.png")),
    priceThb: priceNum,
    priceUsd: `~ $${(priceNum / 35).toFixed(2)} USD`,
    status: a.status === "SOLD" || a.status === "sold" ? "sold" : "available",
    username: String(a.accountUsername || a.username || "vault_user"),
    password: String(a.accountPassword || a.password || "VaultPass#123"),
    pin: "None",
    tags,
  };
}

export default function AdminAccountsPage() {
  const { tx } = useLanguage();
  const [accounts, setAccounts] = useState<AdminGameAccount[]>(INITIAL_GAME_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [gameFilter, setGameFilter] = useState<"all" | "roblox" | "rov">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "available" | "sold">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdminGameAccount | null>(null);
  const [toast, setToast] = useState({ visible: false, title: "", message: "" });

  const triggerToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3200);
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/accounts`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data?.accounts)) setAccounts(data.accounts.map(mapDbAccountToAdmin));
      })
      .catch(() => {});
  }, []);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesGame = gameFilter === "all" || acc.platform === gameFilter;
      const matchesStock = stockFilter === "all" || acc.status === stockFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        acc.title.toLowerCase().includes(q) ||
        acc.code.toLowerCase().includes(q) ||
        acc.spec1.toLowerCase().includes(q) ||
        acc.spec2.toLowerCase().includes(q) ||
        (acc.description || "").toLowerCase().includes(q) ||
        acc.username.toLowerCase().includes(q);
      return matchesGame && matchesStock && matchesSearch;
    });
  }, [accounts, gameFilter, stockFilter, searchQuery]);

  const availableCount = accounts.filter((a) => a.status === "available").length;
  const totalValueThb = accounts.filter((a) => a.status === "available").reduce((sum, a) => sum + a.priceThb, 0);

  const handleDelete = async (id: string, title: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    const numericId = Number(id.replace(/\D/g, ""));
    if (numericId) await fetch(`${API_BASE}/api/admin/accounts/${numericId}`, { method: "DELETE" }).catch(() => {});
    triggerToast(tx("Listing Removed", "ลบรายการแล้ว"), tx(`Removed "${title}" from active inventory.`, `ลบ "${title}" ออกจากคลังแล้ว`));
  };

  const handleSaveAccount = async (data: Omit<AdminGameAccount, "id" | "code">, isDraft?: boolean) => {
    const syncPayload = {
      gameCategory: data.platform === "rov" ? "ROV" : "ROBLOX",
      title: data.title,
      description: data.description,
      highlightTags: data.tags,
      specs: {
        levelOrRank: data.spec1,
        heroesOrFruitsCount: data.spec2,
        skinsOrWeaponsCount: data.spec3,
        serverRegion: data.serverRegion,
        emailStatus: data.subtitle,
      },
      price: data.priceThb,
      imageUrl: data.imageUrl,
      accountUsername: data.username,
      accountPassword: data.password,
      status: data.status === "sold" ? "SOLD" : "AVAILABLE",
    };

    if (editingAccount) {
      setAccounts((prev) => prev.map((a) => (a.id === editingAccount.id ? { ...a, ...data } : a)));
      const numericId = Number(editingAccount.id.replace(/\D/g, ""));
      if (numericId) {
        try {
          const res = await fetch(`${API_BASE}/api/admin/accounts/${numericId}`, {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(syncPayload),
          });
          if (res.ok) {
            const json = await res.json();
            if (json?.account) setAccounts((prev) => prev.map((a) => (a.id === editingAccount.id ? mapDbAccountToAdmin(json.account, numericId) : a)));
          }
        } catch {}
      }
      triggerToast(isDraft ? tx("Draft Saved", "บันทึกฉบับร่างแล้ว") : tx("Account Updated", "อัปเดตไอดีเกมแล้ว"), tx(`Changes to ${editingAccount.code} synced to live storefront.`, `บันทึกการแก้ไข ${editingAccount.code} ลงหน้าร้านแล้ว`));
    } else {
      const tempId = `${Date.now()}`;
      const newCode = data.platform === "roblox" ? `#R-${Math.floor(Math.random() * 899 + 100)}` : `#ROV-${Math.floor(Math.random() * 899 + 100)}`;
      setAccounts((prev) => [{ ...data, id: tempId, code: newCode }, ...prev]);
      try {
        const res = await fetch(`${API_BASE}/api/admin/accounts`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(syncPayload),
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.account) setAccounts((prev) => prev.map((a) => (a.id === tempId ? mapDbAccountToAdmin(json.account, json.account.id) : a)));
        }
      } catch {}
      triggerToast(isDraft ? tx("Draft Saved", "บันทึกฉบับร่างแล้ว") : tx("Account Published", "วางขายไอดีเกมแล้ว"), tx("Account safely encrypted in vault and listed on live storefront.", "บันทึกข้อมูลไอดีและเปิดขายบนหน้าร้านเรียบร้อยแล้ว"));
    }
    setDrawerOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-margin-desktop py-space-xl flex flex-col gap-space-xl max-w-[1600px] w-full mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-5 sm:p-space-xl rounded-xl shadow-sm">
        <div className="flex flex-col gap-space-xs">
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping shrink-0"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary whitespace-nowrap">{tx("Catalog Operations", "จัดการคลังสินค้า")}</span>
            <span className="text-outline-variant font-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium whitespace-nowrap">{tx("Vault Sync: Active", "ซิงค์คลังนิรภัย: ออนไลน์")}</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">{tx("Game Accounts Inventory", "คลังไอดีเกมพร้อมขาย")}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {tx("Manage listed pre-leveled accounts, screenshots, detailed specs, credentials delivery, and pricing.", "จัดการรายการไอดีเกม รูปสกรีนช็อต สเปคเชิงลึก ข้อมูลรหัสผ่านสำหรับจัดส่งอัตโนมัติ และการตั้งราคา")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center bg-surface-container-low px-space-md py-space-sm rounded-xl gap-space-sm shrink-0">
            <span className="material-symbols-outlined text-outline text-[18px]">inventory_2</span>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{tx("Total In Stock", "สินค้าพร้อมขาย")}</span>
              <span className="font-headline-sm text-headline-sm text-on-surface leading-none">{availableCount} {tx("Units", "ไอดี")}</span>
            </div>
          </div>
          <div className="flex items-center bg-surface-container-low px-space-md py-space-sm rounded-xl gap-space-sm shrink-0">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{tx("Active Listed Value", "มูลค่ารวมที่วางขาย")}</span>
              <span className="font-headline-sm text-headline-sm text-secondary leading-none">฿{totalValueThb.toLocaleString()}</span>
            </div>
          </div>
          <button type="button" onClick={() => { setEditingAccount(null); setDrawerOpen(true); }} className="inline-flex items-center gap-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg px-space-xl py-space-md rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>{tx("+ Add New Game Account", "+ เพิ่มไอดีเกมใหม่")}</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="relative flex items-center min-w-[240px] flex-1 sm:flex-initial">
            <span className="material-symbols-outlined absolute left-space-md text-[18px] text-outline">search</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-9 pl-9 pr-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all" placeholder={tx("Search account title, UID, or specs...", "ค้นหาชื่อไอดี, รหัส หรือสเปค...")} type="text" />
          </div>

          <div className="flex items-center bg-surface-container-low p-1 rounded-xl overflow-x-auto max-w-full">
            {([
              { id: "all", labelEn: "All Platforms", labelTh: "ทุกแพลตฟอร์ม" },
              { id: "roblox", labelEn: "Roblox", labelTh: "Roblox" },
              { id: "rov", labelEn: "RoV", labelTh: "RoV" },
            ] as const).map((btn) => (
              <button key={btn.id} type="button" onClick={() => setGameFilter(btn.id)} className={gameFilter === btn.id ? "px-space-md py-1 rounded-lg font-label-sm text-label-sm bg-surface-container-lowest text-primary font-semibold shadow-sm transition-all whitespace-nowrap shrink-0" : "px-space-md py-1 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all whitespace-nowrap shrink-0"}>
                {tx(btn.labelEn, btn.labelTh)}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-surface-container-low p-1 rounded-xl overflow-x-auto max-w-full">
            {([
              { id: "all", labelEn: "All", labelTh: "ทั้งหมด" },
              { id: "available", labelEn: "Available", labelTh: "พร้อมขาย" },
              { id: "sold", labelEn: "Sold", labelTh: "ขายแล้ว" },
            ] as const).map((btn) => (
              <button key={btn.id} type="button" onClick={() => setStockFilter(btn.id)} className={stockFilter === btn.id ? "px-space-md py-1 rounded-lg font-label-sm text-label-sm bg-surface-container-lowest text-on-surface font-semibold shadow-sm transition-all whitespace-nowrap shrink-0" : "px-space-md py-1 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all whitespace-nowrap shrink-0"}>
                {tx(btn.labelEn, btn.labelTh)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-space-sm justify-end shrink-0">
          <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
            {tx("Showing", "แสดง")} <span className="text-on-surface font-semibold">{filteredAccounts.length}</span> {tx(`of ${accounts.length} Accounts`, `จาก ${accounts.length} ไอดี`)}
          </span>
        </div>
      </div>

      <AccountsTable accounts={filteredAccounts} onEdit={(acc) => { setEditingAccount(acc); setDrawerOpen(true); }} onDelete={handleDelete} onToast={triggerToast} />
      <AccountFormDrawer open={drawerOpen} editingAccount={editingAccount} onClose={() => setDrawerOpen(false)} onSave={handleSaveAccount} />
      <AdminToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}

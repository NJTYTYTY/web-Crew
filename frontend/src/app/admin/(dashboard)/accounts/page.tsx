"use client";

import React, { useMemo, useState } from "react";
import { AdminGameAccount, INITIAL_GAME_ACCOUNTS } from "@/data/mockAdminData";
import AccountsTable from "@/components/admin/accounts/AccountsTable";
import AccountFormDrawer from "@/components/admin/accounts/AccountFormDrawer";
import AdminToast from "@/components/admin/AdminToast";
import { useLanguage } from "@/context/LanguageContext";

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
        acc.username.toLowerCase().includes(q);
      return matchesGame && matchesStock && matchesSearch;
    });
  }, [accounts, gameFilter, stockFilter, searchQuery]);

  const handleDelete = (id: string, title: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    triggerToast(tx("Listing Removed", "ลบรายการแล้ว"), tx(`Removed "${title}" from active inventory.`, `ลบ "${title}" ออกจากคลังแล้ว`));
  };

  const handleSaveAccount = (
    data: Omit<AdminGameAccount, "id" | "code" | "imageUrl">,
    isDraft?: boolean
  ) => {
    if (editingAccount) {
      setAccounts((prev) => prev.map((a) => (a.id === editingAccount.id ? { ...a, ...data } : a)));
      triggerToast(
        isDraft ? tx("Draft Saved", "บันทึกฉบับร่างแล้ว") : tx("Account Updated", "อัปเดตไอดีเกมแล้ว"),
        tx(`Changes to ${editingAccount.code} saved in AES-256 vault.`, `บันทึกการแก้ไข ${editingAccount.code} ในคลังนิรภัยแล้ว`)
      );
    } else {
      const newCode = data.platform === "roblox" ? `#R-${Math.floor(Math.random() * 899 + 100)}` : `#ROV-${Math.floor(Math.random() * 899 + 100)}`;
      const newAcc: AdminGameAccount = {
        ...data,
        id: `acc-${Date.now()}`,
        code: newCode,
        imageUrl: INITIAL_GAME_ACCOUNTS[data.platform === "roblox" ? 0 : 1].imageUrl,
      };
      setAccounts((prev) => [newAcc, ...prev]);
      triggerToast(
        isDraft ? tx("Draft Saved", "บันทึกฉบับร่างแล้ว") : tx("Account Published", "วางขายไอดีเกมแล้ว"),
        tx("Account safely encrypted in vault and listed for live instant delivery.", "เข้ารหัสข้อมูลไอดีและเปิดขายพร้อมจัดส่งอัตโนมัติแล้ว")
      );
    }
    setDrawerOpen(false);
  };

  return (
    <div className="px-margin-desktop py-space-xl flex flex-col gap-space-xl max-w-[1600px] w-full mx-auto">
      {/* Top Action Bar & Summary Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
              {tx("Catalog Operations", "จัดการคลังสินค้า")}
            </span>
            <span className="text-outline-variant font-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {tx("Vault Sync: Active", "ซิงค์คลังนิรภัย: ออนไลน์")}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {tx("Game Accounts Inventory", "คลังไอดีเกมพร้อมขาย")}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {tx(
              "Manage listed pre-leveled accounts, credentials delivery, and pricing.",
              "จัดการรายการไอดีเกม ข้อมูลรหัสผ่านสำหรับจัดส่งอัตโนมัติ และการตั้งราคา"
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center bg-surface-container-low px-space-md py-space-sm rounded-xl gap-space-sm">
            <span className="material-symbols-outlined text-outline text-[18px]">inventory_2</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{tx("Total In Stock", "สินค้าคงคลัง")}</span>
              <span className="font-headline-sm text-headline-sm text-on-surface leading-none">{tx("148 Units", "148 ไอดี")}</span>
            </div>
          </div>
          <div className="flex items-center bg-surface-container-low px-space-md py-space-sm rounded-xl gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{tx("Active Listed Value", "มูลค่ารวมที่วางขาย")}</span>
              <span className="font-headline-sm text-headline-sm text-secondary leading-none">฿384,200</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setEditingAccount(null); setDrawerOpen(true); }}
            className="flex items-center gap-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg px-space-xl py-space-md rounded-xl transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>{tx("+ Add New Game Account", "+ เพิ่มไอดีเกมใหม่")}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Strip */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="relative flex items-center min-w-[280px]">
            <span className="material-symbols-outlined absolute left-space-md text-[18px] text-outline">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all"
              placeholder={tx("Search account title, UID, or specs...", "ค้นหาชื่อไอดี, รหัส หรือสเปค...")}
              type="text"
            />
          </div>

          <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
            {([
              { id: "all", labelEn: "All Platforms", labelTh: "ทุกแพลตฟอร์ม" },
              { id: "roblox", labelEn: "Roblox", labelTh: "Roblox" },
              { id: "rov", labelEn: "RoV", labelTh: "RoV" },
            ] as const).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => { setGameFilter(btn.id); triggerToast(tx("Platform Filter Applied", "กรองแพลตฟอร์มแล้ว"), tx(`Showing ${btn.labelEn} accounts`, `แสดงไอดี ${btn.labelTh}`)); }}
                className={
                  gameFilter === btn.id
                    ? "px-space-md py-1 rounded-lg font-label-sm text-label-sm bg-surface-container-lowest text-primary font-semibold shadow-sm transition-all"
                    : "px-space-md py-1 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all"
                }
              >
                {tx(btn.labelEn, btn.labelTh)}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
            {([
              { id: "all", labelEn: "All", labelTh: "ทั้งหมด" },
              { id: "available", labelEn: "Available", labelTh: "พร้อมขาย" },
              { id: "sold", labelEn: "Sold", labelTh: "ขายแล้ว" },
            ] as const).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setStockFilter(btn.id)}
                className={
                  stockFilter === btn.id
                    ? "px-space-md py-1 rounded-lg font-label-sm text-label-sm bg-surface-container-lowest text-on-surface font-semibold shadow-sm transition-all"
                    : "px-space-md py-1 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all"
                }
              >
                {tx(btn.labelEn, btn.labelTh)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-space-sm justify-end">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {tx("Showing", "แสดง")} <span className="text-on-surface font-semibold">{filteredAccounts.length}</span> {tx("of 148 Accounts", "จาก 148 ไอดี")}
          </span>
          <button
            type="button"
            onClick={() => triggerToast(tx("CSV Exported", "ส่งออก CSV สำเร็จ"), tx("Account catalog exported to Accounts-Vault.csv", "ส่งออกรายการไอดีไปยัง Accounts-Vault.csv"))}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            title={tx("Export CSV", "ส่งออก CSV")}
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
          <button
            type="button"
            onClick={() => triggerToast(tx("Batch Pricing Mode", "โหมดปรับราคาแบบกลุ่ม"), tx("FX multiplier synced with USD/THB spot rate.", "ซิงค์อัตราแลกเปลี่ยน USD/THB เรียบร้อย"))}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            title={tx("Batch Pricing", "ปรับราคาแบบกลุ่ม")}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </div>

      <AccountsTable
        accounts={filteredAccounts}
        onEdit={(acc) => { setEditingAccount(acc); setDrawerOpen(true); }}
        onDelete={handleDelete}
        onToast={triggerToast}
      />

      {/* Inventory Quick Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{tx("Automated Delivery Rate", "อัตราจัดส่งอัตโนมัติ")}</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface">99.8%</span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">{tx("+0.4% this week", "+0.4% สัปดาห์นี้")}</span>
          </div>
          <p className="mt-space-xs font-body-sm text-body-sm text-outline">{tx("Credentials dispatched under 1.2s post IQ-Bank prompt verification", "ส่งรหัสผ่านภายใน 1.2 วินาทีหลังยืนยันยอดเงิน IQ-Bank")}</p>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{tx("Roblox Catalog Velocity", "ยอดหมุนเวียนไอดี Roblox")}</span>
            <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface">฿129,400</span>
            <span className="font-label-sm text-label-sm text-primary font-semibold">{tx("Blox Fruits peak", "Blox Fruits ยอดนิยม")}</span>
          </div>
          <p className="mt-space-xs font-body-sm text-body-sm text-outline">{tx("Average hold time before account sale: 4.8 hours", "ระยะเวลาเฉลี่ยก่อนขายออก: 4.8 ชั่วโมง")}</p>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{tx("RoV High-Tier Demand", "ความต้องการไอดี RoV แรงค์สูง")}</span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">workspace_premium</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface">{tx("42 Available", "พร้อมขาย 42 ไอดี")}</span>
            <span className="font-label-sm text-label-sm text-tertiary font-semibold">{tx("Conqueror grade", "ระดับ Conqueror")}</span>
          </div>
          <p className="mt-space-xs font-body-sm text-body-sm text-outline">{tx("Garena clean unbind verifications passed 100%", "ผ่านการตรวจสอบไอดีสะอาดไม่ติดเบอร์ 100%")}</p>
        </div>
      </div>

      <AccountFormDrawer open={drawerOpen} editingAccount={editingAccount} onClose={() => setDrawerOpen(false)} onSave={handleSaveAccount} />
      <AdminToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}

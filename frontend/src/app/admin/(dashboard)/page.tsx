"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INITIAL_OVERVIEW_TRANSACTIONS, OverviewTransaction } from "@/data/mockAdminData";
import OverviewChartsSection from "@/components/admin/overview/OverviewChartsSection";
import RecentTransactionsTable from "@/components/admin/overview/RecentTransactionsTable";
import TransactionInspectorDrawer from "@/components/admin/overview/TransactionInspectorDrawer";
import AdminToast from "@/components/admin/AdminToast";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminOverviewPage() {
  const router = useRouter();
  const { tx } = useLanguage();
  const [selectedTxn, setSelectedTxn] = useState<OverviewTransaction | null>(null);
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "done">("idle");
  const [toast, setToast] = useState({ visible: false, title: "", message: "" });

  const triggerToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleIqBankSync = () => {
    if (syncState !== "idle") return;
    setSyncState("syncing");
    setTimeout(() => {
      setSyncState("done");
      triggerToast(
        tx("IQ-Bank Sync Complete", "ซิงค์ข้อมูล IQ-Bank สำเร็จ"),
        tx("All settlement ledgers and PromptPay webhooks verified.", "ตรวจสอบรายการโอนและ PromptPay Webhook ทั้งหมดเรียบร้อยแล้ว")
      );
      setTimeout(() => setSyncState("idle"), 2000);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-gutter-desktop py-space-xl gap-space-xl">
      {/* Top Welcome Banner & System Health */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-5 sm:p-space-xl shadow-sm">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-lg relative z-10">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary bg-primary-fixed px-space-sm py-0.5 rounded-full whitespace-nowrap shrink-0">
                {tx("Operator Console v3.4", "คอนโซลผู้ดูแลระบบ v3.4")}
              </span>
              <span className="text-outline-variant hidden sm:inline">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 whitespace-nowrap shrink-0">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary shrink-0"></span>{" "}
                {tx("Cluster: ap-southeast-1b", "คลัสเตอร์: ap-southeast-1b")}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {tx("ApexPay Operations Command", "ศูนย์บัญชาการระบบ ApexPay")}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {tx(
                "Live surveillance of instant gaming top-up queues, account inventory velocity, and automated settlements.",
                "ติดตามคิวเติมเกมแบบเรียลไทม์ ความเร็วในการขายไอดีเกม และระบบชำระเงินอัตโนมัติ"
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-md">
            <div className="flex items-center gap-space-md bg-surface-container-low px-space-lg py-space-sm rounded-xl shrink-0">
              <div className="w-9 h-9 rounded-xl bg-secondary-container/60 flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
                    {tx("IQ-Bank Webhook", "เว็บฮุค IQ-Bank")}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shrink-0"></span>
                </div>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    {tx("Operational", "ทำงานปกติ")}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">99.98% SLA</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-md bg-surface-container-low px-space-lg py-space-sm rounded-xl shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
                  {tx("Auto-Fulfill Engine", "ระบบเติมเงินอัตโนมัติ")}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  {tx("98.4% Hands-Off", "อัตโนมัติ 98.4%")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                triggerToast(
                  tx("Telemetry Refreshed", "รีเฟรชข้อมูลแล้ว"),
                  tx("Real-time metrics synchronized with ap-southeast-1b.", "ซิงค์ข้อมูลเรียลไทม์กับ ap-southeast-1b สำเร็จ")
                )
              }
              className="h-10 px-space-md bg-on-surface text-surface rounded-xl font-label-md text-label-md inline-flex items-center gap-space-xs hover:bg-on-surface-variant transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] shrink-0">refresh</span>
              <span>{tx("Refresh Feeds", "รีเฟรชข้อมูล")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-gutter-desktop">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">
              {tx("Gross Platform Revenue", "รายได้รวมแพลตฟอร์ม")}
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[18px]">payments</span></span>
          </div>
          <div className="mt-space-md flex flex-col">
            <div className="flex items-baseline gap-space-xs"><span className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight whitespace-nowrap">฿1,428,950</span><span className="font-label-sm text-label-sm text-on-surface-variant">THB</span></div>
            <div className="mt-space-xs flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm whitespace-nowrap shrink-0"><span className="material-symbols-outlined text-[14px]">trending_up</span><span>+18.4%</span></div>
              <span className="font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{tx("vs. prev 7 days", "เทียบกับ 7 วันก่อน")}</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm border-t border-surface-container-low">
            <svg className="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 24">
              <path className="text-primary" d="M0 20 L15 17 L30 19 L45 12 L60 14 L75 8 L90 10 L100 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path className="text-primary/10" d="M0 20 L15 17 L30 19 L45 12 L60 14 L75 8 L90 10 L100 2 V 24 H 0 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">
              {tx("Game Accounts Sold", "ไอดีเกมที่ขายแล้ว")}
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary shrink-0"><span className="material-symbols-outlined text-[18px]">sports_esports</span></span>
          </div>
          <div className="mt-space-md flex flex-col">
            <div className="flex items-baseline gap-space-xs"><span className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">342</span><span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{tx("verified listings", "รายการที่ยืนยันแล้ว")}</span></div>
            <div className="mt-space-xs flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm whitespace-nowrap shrink-0"><span className="material-symbols-outlined text-[14px]">arrow_upward</span><span>+12.5%</span></div>
              <span className="font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{tx("MTD Escrow Release", "ยอดโอนสำเร็จเดือนนี้")}</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm whitespace-nowrap"><span>RoV: 184</span><span>Valorant: 96</span><span>Genshin: 62</span></div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">
              {tx("Active Queue Length", "คิวที่กำลังดำเนินการ")}
            </span>
            <span className="w-8 h-8 rounded-lg bg-error-container/50 flex items-center justify-center text-error shrink-0"><span className="material-symbols-outlined text-[18px]">hourglass_top</span></span>
          </div>
          <div className="mt-space-md flex flex-col">
            <div className="flex items-baseline gap-space-xs"><span className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">14</span><span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{tx("Orders in Buffer", "ออเดอร์ในคิว")}</span></div>
            <div className="mt-space-xs flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm whitespace-nowrap shrink-0"><span className="material-symbols-outlined text-[14px]">priority_high</span><span>{tx("3 Need Manual OTP", "3 รายการรอ OTP")}</span></div>
              <span className="font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{tx("11 Automated", "อัตโนมัติ 11 รายการ")}</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-center gap-2">
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex"><div className="bg-primary h-full" style={{ width: "78%" }}></div><div className="bg-error h-full" style={{ width: "22%" }}></div></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">
              {tx("Campaign Slot Engagements", "แคมเปญแบนเนอร์ที่เปิดใช้งาน")}
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary shrink-0"><span className="material-symbols-outlined text-[18px]">view_carousel</span></span>
          </div>
          <div className="mt-space-md flex flex-col">
            <div className="flex items-baseline gap-space-xs"><span className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight whitespace-nowrap">{tx("5 Live", "5 แสดงผล")}</span><span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{tx("/ 8 Maximum", "/ สูงสุด 8")}</span></div>
            <div className="mt-space-xs flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm whitespace-nowrap shrink-0"><span className="material-symbols-outlined text-[14px]">event</span><span>{tx("2 Scheduled", "ตั้งเวลา 2 รายการ")}</span></div>
              <span className="font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">CTR: 8.74%</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-center justify-between gap-2 text-on-surface-variant font-label-sm text-label-sm">
            <span className="text-secondary font-medium truncate">{tx('Hero: "PayDay 15% Bonus"', 'ฮีโร่: "PayDay โบนัส 15%"')}</span>
            <Link className="text-primary hover:underline whitespace-nowrap shrink-0" href="/admin/banners">{tx("Manage", "จัดการ")}</Link>
          </div>
        </div>
      </div>

      <OverviewChartsSection />

      <RecentTransactionsTable
        transactions={INITIAL_OVERVIEW_TRANSACTIONS}
        onInspect={(txn) => setSelectedTxn(txn)}
        onExportCsv={() =>
          triggerToast(
            tx("CSV Export Ready", "ส่งออกไฟล์ CSV สำเร็จ"),
            tx("Exported 5 recent transaction records to ApexPay-Ledger.csv", "ส่งออกรายการธุรกรรมล่าสุด 5 รายการไปยัง ApexPay-Ledger.csv")
          )
        }
      />

      {/* Sticky Quick Actions Toolbar */}
      <div className="sticky bottom-4 z-30 flex justify-center w-full">
        <div className="bg-surface-container-lowest/95 backdrop-blur-md p-space-xs px-space-md rounded-2xl shadow-xl flex flex-wrap items-center justify-center gap-space-xs border border-surface-container-high">
          <button type="button" onClick={() => router.push("/admin/accounts")} className="h-9 px-space-md bg-on-surface text-surface rounded-xl font-label-sm text-label-sm inline-flex items-center gap-1.5 hover:bg-on-surface-variant transition-colors whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-[16px]">add_box</span><span>{tx("+ Add Account", "+ เพิ่มไอดีเกม")}</span>
          </button>
          <button type="button" onClick={() => router.push("/admin/topup")} className="h-9 px-space-md bg-surface-container text-on-surface rounded-xl font-label-sm text-label-sm inline-flex items-center gap-1.5 hover:bg-surface-container-high transition-colors whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-[16px]">inventory</span><span>{tx("+ Add Package", "+ เพิ่มแพ็กเกจ")}</span>
          </button>
          <div className="h-4 w-px bg-surface-container-high mx-space-xs hidden sm:block"></div>
          <button type="button" onClick={handleIqBankSync} className="h-9 px-space-md bg-secondary text-on-secondary rounded-xl font-label-sm text-label-sm inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0">
            <span className={`material-symbols-outlined text-[16px] ${syncState === "syncing" ? "animate-spin" : ""}`}>
              {syncState === "done" ? "done" : syncState === "syncing" ? "refresh" : "sync"}
            </span>
            <span>
              {syncState === "syncing"
                ? tx("Syncing Gateway...", "กำลังซิงค์เกตเวย์...")
                : syncState === "done"
                ? tx("Synced with IQ-Bank!", "ซิงค์กับ IQ-Bank แล้ว!")
                : tx("Trigger IQ-Bank Sync", "ซิงค์ข้อมูล IQ-Bank")}
            </span>
          </button>
          <Link className="h-9 px-space-md bg-surface-container-low text-primary rounded-xl font-label-sm text-label-sm inline-flex items-center gap-1.5 hover:bg-surface-container transition-colors whitespace-nowrap shrink-0" href="/">
            <span className="material-symbols-outlined text-[16px]">open_in_new</span><span>{tx("View Live Storefront", "ดูหน้าร้านค้าจริง")}</span>
          </Link>
        </div>
      </div>

      <TransactionInspectorDrawer transaction={selectedTxn} onClose={() => setSelectedTxn(null)} onActionToast={triggerToast} />
      <AdminToast visible={toast.visible} title={toast.title} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}

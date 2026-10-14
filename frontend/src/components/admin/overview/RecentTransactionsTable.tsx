"use client";

import React, { useState } from "react";
import { OverviewTransaction } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface RecentTransactionsTableProps {
  transactions: OverviewTransaction[];
  onInspect: (txn: OverviewTransaction) => void;
  onExportCsv: () => void;
}

export default function RecentTransactionsTable({
  transactions,
  onInspect,
  onExportCsv,
}: RecentTransactionsTableProps) {
  const { tx } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered =
    statusFilter === "ALL"
      ? transactions
      : transactions.filter((t) => t.status === statusFilter);

  const cycleStatusFilter = () => {
    const order = ["ALL", "SUCCESS", "WAITING OTP", "FAILED (TIMEOUT)"];
    const nextIdx = (order.indexOf(statusFilter) + 1) % order.length;
    setStatusFilter(order[nextIdx]);
  };

  const renderBadgeClass = (badge: OverviewTransaction["gameBadge"]) => {
    if (badge === "V") {
      return "w-6 h-6 rounded-md bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-sm text-label-sm font-bold shrink-0";
    }
    if (badge === "A") {
      return "w-6 h-6 rounded-md bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-label-sm text-label-sm font-bold shrink-0";
    }
    return "w-6 h-6 rounded-md bg-primary-fixed text-primary flex items-center justify-center font-label-sm text-label-sm font-bold shrink-0";
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-surface-container">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {tx("Real-Time Transactions Stream", "รายการธุรกรรมแบบเรียลไทม์")}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {tx(
              "Live audit ledger of purchases, automated deliveries, and manual interventions",
              "บัญชีตรวจสอบการสั่งซื้อ การจัดส่งอัตโนมัติ และรายการที่ต้องตรวจสอบด้วยตนเอง"
            )}
          </p>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            type="button"
            onClick={cycleStatusFilter}
            className="h-9 px-space-md bg-surface-container-low text-on-surface rounded-xl font-label-sm text-label-sm inline-flex items-center gap-1 hover:bg-surface-container transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">
              filter_list
            </span>
            <span>
              {statusFilter === "ALL"
                ? tx("Filter Status", "กรองสถานะ")
                : `${tx("Status", "สถานะ")}: ${statusFilter}`}
            </span>
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="h-9 px-space-md bg-surface-container-low text-on-surface rounded-xl font-label-sm text-label-sm inline-flex items-center gap-1 hover:bg-surface-container transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">
              download
            </span>
            <span>{tx("Export CSV", "ส่งออก CSV")}</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <th className="py-space-md px-space-lg whitespace-nowrap">{tx("Order ID", "รหัสคำสั่งซื้อ")}</th>
              <th className="py-space-md px-space-md whitespace-nowrap">{tx("Customer / UID", "ลูกค้า / UID")}</th>
              <th className="py-space-md px-space-md whitespace-nowrap">{tx("Game & SKU", "เกม & แพ็กเกจ")}</th>
              <th className="py-space-md px-space-md text-right whitespace-nowrap">{tx("Amount", "ยอดเงิน")}</th>
              <th className="py-space-md px-space-md whitespace-nowrap">{tx("IQ-Bank Ref", "อ้างอิง IQ-Bank")}</th>
              <th className="py-space-md px-space-md whitespace-nowrap">{tx("Status", "สถานะ")}</th>
              <th className="py-space-md px-space-md text-right whitespace-nowrap">{tx("Timestamp", "เวลา")}</th>
              <th className="py-space-md px-space-lg text-right whitespace-nowrap">{tx("Action", "จัดการ")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
            {filtered.map((txn) => (
              <tr
                key={txn.id}
                className={`hover:bg-surface-container-low/50 transition-colors ${
                  txn.status === "WAITING OTP" ? "bg-surface-container-low/20" : ""
                }`}
              >
                <td className="py-space-md px-space-lg font-label-md text-label-md text-primary font-medium whitespace-nowrap">
                  {txn.id}
                </td>
                <td className="py-space-md px-space-md whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      {txn.customerName}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {txn.customerSub}
                    </span>
                  </div>
                </td>
                <td className="py-space-md px-space-md whitespace-nowrap">
                  <div className="flex items-center gap-space-xs">
                    <span className={renderBadgeClass(txn.gameBadge)}>
                      {txn.gameBadge}
                    </span>
                    <span className="text-on-surface whitespace-nowrap">{txn.gameSku}</span>
                  </div>
                </td>
                <td className="py-space-md px-space-md text-right font-label-md text-label-md text-on-surface font-semibold whitespace-nowrap">
                  {txn.amount}
                </td>
                <td className="py-space-md px-space-md font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
                  {txn.iqBankRef}
                </td>
                <td className="py-space-md px-space-md whitespace-nowrap">
                  {txn.status === "SUCCESS" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-medium whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>{" "}
                      {tx("SUCCESS", "สำเร็จ")}
                    </span>
                  )}
                  {txn.status === "WAITING OTP" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-label-sm text-label-sm font-medium animate-pulse whitespace-nowrap">
                      <span className="material-symbols-outlined text-[12px] shrink-0">
                        security
                      </span>{" "}
                      {tx("WAITING OTP", "รอรหัส OTP")}
                    </span>
                  )}
                  {txn.status === "FAILED (TIMEOUT)" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-medium whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0"></span>{" "}
                      {tx("FAILED (TIMEOUT)", "ล้มเหลว (หมดเวลา)")}
                    </span>
                  )}
                </td>
                <td className="py-space-md px-space-md text-right font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
                  {txn.timestamp}
                </td>
                <td className="py-space-md px-space-lg text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onInspect(txn)}
                    className={
                      txn.actionLabel === "Resolve"
                        ? "h-8 px-space-sm bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-sm text-label-sm transition-colors shadow-xs whitespace-nowrap shrink-0"
                        : "h-8 px-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-colors whitespace-nowrap shrink-0"
                    }
                  >
                    {txn.actionLabel === "Resolve"
                      ? tx("Resolve", "แก้ไข")
                      : txn.actionLabel === "Retry"
                      ? tx("Retry", "ลองใหม่")
                      : tx("Inspect", "ตรวจสอบ")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      <div className="p-space-md bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-surface-container font-label-sm text-label-sm">
        <span className="text-on-surface-variant whitespace-nowrap">
          {tx(
            `Showing ${filtered.length} of 3,842 queued orders`,
            `แสดง ${filtered.length} จาก 3,842 รายการในคิว`
          )}
        </span>
        <div className="flex items-center gap-space-xs shrink-0">
          <button
            type="button"
            disabled
            className="px-space-sm py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {tx("Previous", "ก่อนหน้า")}
          </button>
          <span className="px-space-sm py-1 rounded bg-primary text-on-primary">1</span>
          <button type="button" className="px-space-sm py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors">2</button>
          <button type="button" className="px-space-sm py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors">3</button>
          <span className="px-1 text-outline">...</span>
          <button
            type="button"
            className="px-space-sm py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap"
          >
            {tx("Next", "ถัดไป")}
          </button>
        </div>
      </div>
    </div>
  );
}

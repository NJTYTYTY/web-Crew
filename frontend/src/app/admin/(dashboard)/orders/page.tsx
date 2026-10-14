"use client";

import React, { useMemo, useState } from "react";
import { AdminOrderItem, INITIAL_ADMIN_ORDERS } from "@/data/mockAdminData";
import OrderInspectModal from "@/components/admin/orders/OrderInspectModal";
import AdminToast from "@/components/admin/AdminToast";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminOrdersPage() {
  const { tx } = useLanguage();
  const [orders, setOrders] = useState<AdminOrderItem[]>(INITIAL_ADMIN_ORDERS);
  const [searchVal, setSearchVal] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2800);
  };

  const filteredOrders = useMemo(() => {
    const q = searchVal.toLowerCase().trim();
    return orders.filter((row) => {
      const matchesSearch = !q || row.searchMeta.toLowerCase().includes(q) || row.id.toLowerCase().includes(q);
      const matchesType = typeFilter === "ALL" || row.type === typeFilter;
      const matchesPayment = paymentFilter === "ALL" || row.payment === paymentFilter;
      const matchesFulfill = fulfillmentFilter === "ALL" || row.fulfillment === fulfillmentFilter;
      return matchesSearch && matchesType && matchesPayment && matchesFulfill;
    });
  }, [orders, searchVal, typeFilter, paymentFilter, fulfillmentFilter]);

  const handleCopy = (text: string, customMsg?: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(text);
    showToast(customMsg || `${tx("Copied", "คัดลอกแล้ว")}: ${text}`);
  };

  const handlePreset = (preset: "PROCESSING" | "FAILED" | "ROV" | "ROBLOX") => {
    if (preset === "PROCESSING") { setFulfillmentFilter("Processing"); setPaymentFilter("ALL"); setTypeFilter("ALL"); setSearchVal(""); }
    else if (preset === "FAILED") { setPaymentFilter("FAILED"); setFulfillmentFilter("ALL"); setTypeFilter("ALL"); setSearchVal(""); }
    else if (preset === "ROV") setSearchVal("RoV");
    else if (preset === "ROBLOX") setSearchVal("Roblox");
  };

  const handleOrderAction = (orderId: string, action: "COMPLETE" | "REDELIVER" | "REFUND") => {
    if (action === "COMPLETE") {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, fulfillment: "Completed", payment: "PAID" } : o)));
      showToast(tx("Order status marked as COMPLETED. Fulfillment notified.", "อัปเดตสถานะเป็นเสร็จสมบูรณ์และแจ้งเตือนระบบแล้ว"));
      setSelectedOrder(null);
    } else if (action === "REDELIVER") {
      showToast(tx("Triggered re-delivery webhook to gaming server worker.", "ส่งคำสั่งจัดส่งซ้ำไปยังเซิร์ฟเวอร์บอทเติมเกมแล้ว"));
    } else if (action === "REFUND") {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, payment: "FAILED", fulfillment: "Pending" } : o)));
      showToast(tx("Order marked as FAILED. Refund initiated to source bank.", "ระบุสถานะล้มเหลวและเริ่มกระบวนการคืนเงินแล้ว"));
      setSelectedOrder(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-gutter-desktop py-space-xl max-w-[1600px] mx-auto w-full space-y-space-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-primary font-label-sm uppercase tracking-wider mb-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping shrink-0"></span>
            <span>{tx("Gateway Stream: IQ-Bank Engine v4.2", "สตรีมเกตเวย์: IQ-Bank Engine v4.2")}</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {tx("Orders, Top-Up Queue & Logs", "รายการสั่งซื้อ คิวเติมเกม & ล็อกระบบ")}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {tx(
              "Real-time settlement verification, payload inspector, and automated dispatch pipeline.",
              "ตรวจสอบยอดชำระเงินแบบเรียลไทม์ ตรวจสอบ Payload และจัดการคิวส่งมอบอัตโนมัติ"
            )}
          </p>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <button type="button" onClick={() => { setIsRefreshing(true); setTimeout(() => { setIsRefreshing(false); showToast(tx("Orders stream synchronized with IQ-Bank gateway", "ซิงค์ข้อมูลคำสั่งซื้อกับเกตเวย์ IQ-Bank แล้ว")); }, 700); }} className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md transition-colors shadow-sm whitespace-nowrap shrink-0">
            <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? "animate-spin" : ""}`}>sync</span>
            <span>{tx("Force Sync", "บังคับซิงค์")}</span>
          </button>
          <button type="button" onClick={() => showToast(tx("Exporting 142 records to IQ-Bank-Audit-Logs.csv", "กำลังส่งออก 142 รายการไปยัง IQ-Bank-Audit-Logs.csv"))} className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-primary text-on-primary hover:bg-primary-container text-label-md font-label-md transition-all shadow-sm whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>{tx("Export Logs", "ส่งออกล็อก")}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-2"><span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">{tx("Today's Orders", "คำสั่งซื้อวันนี้")}</span><span className="material-symbols-outlined text-primary text-[20px] shrink-0">shopping_bag</span></div>
          <div className="mt-space-md flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-space-xs"><span className="font-headline-lg text-headline-lg text-on-surface">142</span><span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{tx("txns", "รายการ")}</span></div>
            <span className="inline-flex items-center gap-0.5 px-space-xs py-0.5 rounded bg-secondary-container/40 text-on-secondary-fixed font-label-sm text-label-sm whitespace-nowrap shrink-0"><span className="material-symbols-outlined text-[14px]">trending_up</span>+18.4%</span>
          </div>
          <div className="mt-space-sm w-full bg-surface-container-low h-1 rounded-full overflow-hidden"><div className="bg-primary h-full w-[78%]"></div></div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-2"><span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">{tx("Queue Processing", "กำลังดำเนินการในคิว")}</span><span className="material-symbols-outlined text-secondary text-[20px] animate-spin shrink-0" style={{ animationDuration: "4s" }}>hourglass_top</span></div>
          <div className="mt-space-md flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-space-xs"><span className="font-headline-lg text-headline-lg text-on-surface">12</span><span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{tx("in queue", "ในคิว")}</span></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{tx("Avg 1.8s bot latency", "ความหน่วงบอทเฉลี่ย 1.8s")}</span>
          </div>
          <div className="mt-space-sm w-full bg-surface-container-low h-1 rounded-full overflow-hidden"><div className="bg-secondary h-full w-[45%]"></div></div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-2"><span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">{tx("Failed Webhooks", "เว็บฮุคที่ล้มเหลว")}</span><span className="material-symbols-outlined text-error text-[20px] shrink-0">warning</span></div>
          <div className="mt-space-md flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-space-xs"><span className="font-headline-lg text-headline-lg text-error">4</span><span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{tx("retrying", "กำลังลองใหม่")}</span></div>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm whitespace-nowrap shrink-0">{tx("Action Req.", "ต้องตรวจสอบ")}</span>
          </div>
          <div className="mt-space-sm w-full bg-surface-container-low h-1 rounded-full overflow-hidden"><div className="bg-error h-full w-[14%]"></div></div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-2"><span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">{tx("Gross Settlement", "ยอดชำระรวมวันนี้")}</span><span className="material-symbols-outlined text-tertiary text-[20px] shrink-0">payments</span></div>
          <div className="mt-space-md flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-space-xs"><span className="font-headline-lg text-headline-lg text-on-surface whitespace-nowrap">฿89,400</span><span className="font-label-sm text-label-sm text-on-surface-variant">THB</span></div>
            <span className="inline-flex items-center gap-0.5 font-label-sm text-label-sm text-secondary whitespace-nowrap shrink-0"><span className="material-symbols-outlined text-[14px]">verified</span>IQ Direct</span>
          </div>
          <div className="mt-space-sm w-full bg-surface-container-low h-1 rounded-full overflow-hidden"><div className="bg-tertiary h-full w-[92%]"></div></div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span>
            <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} className="w-full h-9 pl-9 pr-space-md bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-inner" placeholder={tx("Filter Order ID, IQ Ref, User or Target UID...", "กรองรหัสคำสั่งซื้อ, อ้างอิง IQ-Bank, ชื่อลูกค้า หรือ UID...")} type="text" />
          </div>
          <div className="md:col-span-2">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full h-9 px-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="ALL">{tx("All Order Types", "ทุกประเภทคำสั่งซื้อ")}</option><option value="TOPUP">{tx("Game Top-Up", "เติมเกม")}</option><option value="ACCOUNT">{tx("Account Purchase", "ซื้อไอดีเกม")}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="w-full h-9 px-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="ALL">{tx("Payment: All", "การชำระเงิน: ทั้งหมด")}</option><option value="PAID">{tx("Paid (Settled)", "ชำระแล้ว")}</option><option value="WAITING">{tx("Waiting (Pending)", "รอชำระเงิน")}</option><option value="FAILED">{tx("Failed", "ล้มเหลว")}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select value={fulfillmentFilter} onChange={(e) => setFulfillmentFilter(e.target.value)} className="w-full h-9 px-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="ALL">{tx("Fulfill: All", "การจัดส่ง: ทั้งหมด")}</option><option value="Completed">{tx("Completed", "เสร็จสมบูรณ์")}</option><option value="Processing">{tx("Processing", "กำลังดำเนินการ")}</option><option value="Pending">{tx("Pending / Stalled", "รอดำเนินการ")}</option>
            </select>
          </div>
          <div className="md:col-span-1 flex justify-end">
            <button type="button" onClick={() => { setSearchVal(""); setTypeFilter("ALL"); setPaymentFilter("ALL"); setFulfillmentFilter("ALL"); showToast(tx("Filters reset to default view", "ล้างตัวกรองทั้งหมดแล้ว")); }} className="h-9 px-space-sm w-full rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm font-label-sm inline-flex items-center justify-center gap-1 transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">restart_alt</span><span className="md:hidden lg:inline">{tx("Clear", "ล้าง")}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-xs pt-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mr-1 whitespace-nowrap">{tx("Hot Views:", "มุมมองด่วน:")}</span>
          <button type="button" onClick={() => handlePreset("PROCESSING")} className="px-space-sm py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors whitespace-nowrap shrink-0">{tx("🔥 Unfulfilled (12)", "🔥 รอจัดส่ง (12)")}</button>
          <button type="button" onClick={() => handlePreset("FAILED")} className="px-space-sm py-0.5 rounded bg-error-container/50 hover:bg-error-container text-on-error-container font-label-sm text-label-sm transition-colors whitespace-nowrap shrink-0">{tx("⚠️ Failed Webhooks (4)", "⚠️ เว็บฮุคล้มเหลว (4)")}</button>
          <button type="button" onClick={() => handlePreset("ROV")} className="px-space-sm py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors whitespace-nowrap shrink-0">{tx("🎮 RoV Queue", "🎮 คิว RoV")}</button>
          <button type="button" onClick={() => handlePreset("ROBLOX")} className="px-space-sm py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors whitespace-nowrap shrink-0">{tx("🧱 Roblox Queue", "🧱 คิว Roblox")}</button>
        </div>
      </div>

      {/* Orders Queue Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-10 bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="px-space-md whitespace-nowrap">{tx("Order ID", "รหัสคำสั่งซื้อ")}</th><th className="px-space-md whitespace-nowrap">{tx("Customer", "ลูกค้า")}</th><th className="px-space-md whitespace-nowrap">{tx("Type", "ประเภท")}</th><th className="px-space-md whitespace-nowrap">{tx("Target Delivery Info", "ข้อมูลปลายทางที่จัดส่ง")}</th><th className="px-space-md text-right whitespace-nowrap">{tx("Amount (THB)", "ยอดเงิน (บาท)")}</th><th className="px-space-md whitespace-nowrap">{tx("IQ-Bank Ref", "อ้างอิง IQ-Bank")}</th><th className="px-space-md text-center whitespace-nowrap">{tx("Payment", "การชำระเงิน")}</th><th className="px-space-md text-center whitespace-nowrap">{tx("Fulfillment", "สถานะจัดส่ง")}</th><th className="px-space-md text-right whitespace-nowrap">{tx("Actions", "จัดการ")}</th>
              </tr>
            </thead>
            <tbody className="text-on-surface font-body-sm text-body-sm">
              {filteredOrders.map((row) => (
                <tr key={row.id} className="h-14 bg-surface-container-lowest hover:bg-surface-container-low/60 transition-colors">
                  <td className="px-space-md font-label-md text-label-md font-semibold text-primary whitespace-nowrap">#{row.id}</td>
                  <td className="px-space-md whitespace-nowrap">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
                        {row.avatarUrl ? (
                          <img className="w-full h-full object-cover" src={row.avatarUrl} alt={row.customerName} />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center font-label-sm ${row.avatarTone === "tertiary" ? "bg-tertiary-fixed text-on-tertiary-fixed" : row.avatarTone === "secondary" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container text-outline"}`}>{row.avatarInitials}</div>
                        )}
                      </div>
                      <div className="flex flex-col"><span className="font-body-sm text-body-sm font-medium text-on-surface">{row.customerName}</span><span className="font-label-sm text-label-sm text-on-surface-variant">{row.customerTier}</span></div>
                    </div>
                  </td>
                  <td className="px-space-md whitespace-nowrap">
                    <span className={`inline-flex items-center px-space-sm py-0.5 rounded-full font-label-sm text-label-sm whitespace-nowrap ${row.type === "TOPUP" ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-secondary-container/60 text-on-secondary-container"}`}>{row.type === "TOPUP" ? tx("Game Top-Up", "เติมเกม") : tx("Account Purchase", "ซื้อไอดีเกม")}</span>
                  </td>
                  <td className="px-space-md whitespace-nowrap"><div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface font-medium">{row.targetTitle}</span><span className="font-body-sm text-body-sm text-on-surface-variant">{row.targetSubtitle}</span></div></td>
                  <td className="px-space-md text-right font-label-md text-label-md font-semibold text-on-surface whitespace-nowrap">฿{row.amount.toFixed(2)}</td>
                  <td className="px-space-md whitespace-nowrap">
                    <div className="flex items-center gap-1 group">
                      <span className={`font-label-sm text-label-sm font-mono ${row.payment === "FAILED" ? "text-error" : "text-on-surface-variant"}`}>#{row.iqRef}</span>
                      <button type="button" onClick={() => handleCopy(row.iqRef)} className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title={tx("Copy IQ Ref", "คัดลอกรหัส IQ Ref")}><span className="material-symbols-outlined text-[14px]">content_copy</span></button>
                    </div>
                  </td>
                  <td className="px-space-md text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-space-sm py-0.5 rounded-full font-label-sm text-label-sm whitespace-nowrap ${row.payment === "PAID" ? "bg-secondary-container text-on-secondary-fixed" : row.payment === "FAILED" ? "bg-error-container text-on-error-container" : "bg-surface-container-highest text-on-surface"}`}>
                      {row.payment === "PAID" ? tx("PAID", "ชำระแล้ว") : row.payment === "FAILED" ? tx("FAILED", "ล้มเหลว") : tx("WAITING", "รอชำระ")}
                    </span>
                  </td>
                  <td className="px-space-md text-center whitespace-nowrap">
                    {row.fulfillment === "Processing" && <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>{tx("Processing", "กำลังเติม")}</span>}
                    {row.fulfillment === "Pending" && <span className="inline-flex items-center px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm whitespace-nowrap">{tx("Pending", "รอดำเนินการ")}</span>}
                    {row.fulfillment === "Completed" && <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-fixed font-label-sm text-label-sm whitespace-nowrap"><span className="material-symbols-outlined text-[14px]">check</span>{tx("Completed", "สำเร็จ")}</span>}
                  </td>
                  <td className="px-space-md text-right whitespace-nowrap">
                    <button type="button" onClick={() => setSelectedOrder(row)} className="px-space-sm py-1 rounded-lg bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary font-label-sm text-label-sm transition-all shadow-sm whitespace-nowrap">{tx("Inspect Details", "ดูรายละเอียด")}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
          <div className="flex items-center gap-space-sm whitespace-nowrap">
            <span>{tx("Showing", "แสดง")} <strong className="text-on-surface">{filteredOrders.length}</strong> {tx("of 142 records", "จาก 142 รายการ")}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">{tx("IQ-Bank Gateway Latency:", "ความหน่วงเกตเวย์ IQ-Bank:")} <strong className="text-secondary">42ms</strong></span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button type="button" disabled className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40 whitespace-nowrap">{tx("Previous", "ก่อนหน้า")}</button>
            <button type="button" className="px-space-sm py-1 rounded bg-primary text-on-primary">1</button>
            <button type="button" className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface">2</button>
            <button type="button" className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface">3</button>
            <button type="button" className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface whitespace-nowrap">{tx("Next", "ถัดไป")}</button>
          </div>
        </div>
      </div>

      {/* Live Gateway Audit Log Terminal Preview */}
      <div className="bg-inverse-surface text-inverse-on-surface rounded-xl p-space-lg shadow-sm overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-error"></span><span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed"></span><span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed"></span></div>
            <span className="font-label-sm text-label-sm font-mono text-outline-variant">iq_bank_webhook_stream.log (Socket 8089)</span>
          </div>
          <div className="flex items-center gap-space-sm font-label-sm text-label-sm whitespace-nowrap"><span className="text-secondary-fixed font-mono">STATUS: 200 OK</span><span className="text-outline">Heartbeat 14:32:12</span></div>
        </div>
        <div className="font-label-sm text-label-sm font-mono space-y-1 pt-space-xs text-slate-300">
          <div className="flex gap-2"><span className="text-outline">14:32:10.104</span><span className="text-secondary-fixed">[INGEST]</span><span>POST /api/v1/iq-bank/ipn - Ref: IQ-TXN-902184 - Match Order #ORD-88291 (฿850.00 THB) - VERIFIED HMAC_SHA256</span></div>
          <div className="flex gap-2"><span className="text-outline">14:32:04.891</span><span className="text-primary-fixed-dim">[BOT_DISPATCH]</span><span>Dispatching RoV API worker #04 -&gt; UID 2981048194 -&gt; diamonds: 520 (Attempt 1)</span></div>
          <div className="flex gap-2"><span className="text-outline">14:31:52.220</span><span className="text-error">[ALERT]</span><span>Timeout on SCB_PROMPTPAY callback for #ORD-88288. Worker marked queue retry state (Retry #2 in 60s)</span></div>
        </div>
      </div>

      <OrderInspectModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onCopy={handleCopy} onAction={handleOrderAction} />
      <AdminToast visible={toast.visible} message={toast.message} />
    </div>
  );
}

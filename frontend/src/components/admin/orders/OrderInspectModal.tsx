"use client";

import React, { useState } from "react";
import { AdminOrderItem } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface OrderInspectModalProps {
  order: AdminOrderItem | null;
  onClose: () => void;
  onCopy: (text: string, label?: string) => void;
  onAction: (orderId: string, action: "COMPLETE" | "REDELIVER" | "REFUND") => void;
}

export default function OrderInspectModal({ order, onClose, onCopy, onAction }: OrderInspectModalProps) {
  const { tx } = useLanguage();
  const [passVisible, setPassVisible] = useState(false);

  if (!order) return null;

  const rawPayload = JSON.stringify(
    {
      gateway: "IQ-BANK-TH",
      orderId: order.id,
      transactionRef: order.iqRef,
      bank: order.paymentChannel,
      customer: order.customerName,
      target: order.targetUid,
      amount: order.amount,
      currency: "THB",
      status: order.payment === "PAID" ? "SUCCESS" : order.payment,
      fulfillmentStatus: order.fulfillment.toUpperCase(),
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md sm:p-space-lg">
      <div className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden z-10">
        <div className="px-space-xl py-space-lg bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <div>
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  {tx(`Order #${order.id} Details`, `รายละเอียดคำสั่งซื้อ #${order.id}`)}
                </h2>
                <span
                  className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm ${
                    order.payment === "PAID"
                      ? "bg-secondary-container text-on-secondary-fixed"
                      : order.payment === "FAILED"
                      ? "bg-error-container text-on-error-container"
                      : "bg-surface-container-highest text-on-surface"
                  }`}
                >
                  {order.payment}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {tx("IQ-Bank Audit Trail & Target Delivery Credentials", "บันทึกตรวจสอบ IQ-Bank และข้อมูลบัญชีปลายทางสำหรับจัดส่ง")}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-xl overflow-y-auto space-y-space-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md p-space-md rounded-xl bg-surface-container-low">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{tx("Customer", "ลูกค้า")}</span>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface mt-0.5">{order.customerName}</p>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{tx("Order Item", "รายการที่สั่งซื้อ")}</span>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface mt-0.5">{order.targetSubtitle}</p>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{tx("Settled Price", "ยอดชำระสุทธิ")}</span>
              <p className="font-body-sm text-body-sm font-semibold text-secondary mt-0.5">฿{order.amount.toFixed(2)} THB</p>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{tx("Payment Channel", "ช่องทางชำระเงิน")}</span>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface mt-0.5">{order.paymentChannel}</p>
            </div>
          </div>

          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">person_pin</span>
                {tx("Target Delivery Destination", "ข้อมูลปลายทางสำหรับจัดส่ง")}
              </span>
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span> {tx("Validated Format", "รูปแบบถูกต้อง")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-medium">{tx("Player UID Mode", "โหมดเติมด้วย UID ผู้เล่น")}</span>
                    <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed">{tx("Direct API", "ยิงตรง API")}</span>
                  </div>
                  <div className="mt-space-sm flex items-center justify-between bg-surface-container-lowest p-space-sm rounded-lg shadow-sm">
                    <span className="font-label-md text-label-md font-mono text-on-surface select-all">{order.targetUid}</span>
                    <button
                      type="button"
                      onClick={() => onCopy(order.targetUid, `${tx("Copied UID", "คัดลอก UID")}: ${order.targetUid}`)}
                      className="flex items-center gap-1 px-space-sm py-1 rounded bg-surface-container-low hover:bg-surface-container-high text-on-surface text-label-sm font-label-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      <span>{tx("Copy UID", "คัดลอก UID")}</span>
                    </button>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm">{order.targetRegion}</p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-medium">{tx("Account Credential Mode", "โหมดไอดีและรหัสผ่าน")}</span>
                    <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant">{tx("Manual / Bot", "แอดมิน / บอท")}</span>
                  </div>
                  <div className="mt-space-sm space-y-space-xs">
                    <div className="flex items-center justify-between bg-surface-container-lowest p-space-sm rounded-lg shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{tx("Username:", "ชื่อผู้ใช้:")}</span>
                        <span className="font-label-md text-label-md font-mono text-on-surface">{order.robloxUser}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCopy(order.robloxUser, `${tx("Copied username", "คัดลอกชื่อผู้ใช้")}: ${order.robloxUser}`)}
                        className="flex items-center gap-1 px-space-sm py-1 rounded bg-surface-container-low hover:bg-surface-container-high text-on-surface text-label-sm font-label-sm transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                        <span>{tx("Copy", "คัดลอก")}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-surface-container-lowest p-space-sm rounded-lg shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{tx("Password Token:", "รหัสผ่าน:")}</span>
                        <span className="font-label-md text-label-md font-mono text-on-surface">
                          {passVisible ? order.robloxPass : "•••••••••••••"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => setPassVisible((prev) => !prev)} className="p-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface">
                          <span className="material-symbols-outlined text-[16px]">{passVisible ? "visibility_off" : "visibility"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onCopy(order.robloxPass, tx("Password token copied to clipboard", "คัดลอกรหัสผ่านลงคลิปบอร์ดแล้ว"))}
                          className="flex items-center gap-1 px-space-sm py-1 rounded bg-surface-container-low hover:bg-surface-container-high text-on-surface text-label-sm font-label-sm transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          <span>{tx("Copy", "คัดลอก")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm">
                  {tx("Roblox 2-Factor Backup Code verified by customer.", "ลูกค้ายืนยันรหัสสำรอง 2FA ของ Roblox เรียบร้อยแล้ว")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-[20px]">code</span>
                {tx("IQ-Bank Webhook Payload (Raw Audit Trail)", "ข้อมูลดิบ IQ-Bank Webhook Payload")}
              </span>
              <button type="button" onClick={() => onCopy(rawPayload, tx("Raw Webhook JSON copied to clipboard", "คัดลอก JSON ดิบลงคลิปบอร์ดแล้ว"))} className="flex items-center gap-1 text-label-sm font-label-sm text-primary hover:underline">
                <span className="material-symbols-outlined text-[14px]">copy_all</span>
                <span>{tx("Copy Raw JSON", "คัดลอก JSON")}</span>
              </button>
            </div>
            <div className="relative bg-inverse-surface rounded-xl p-space-md text-inverse-on-surface font-mono font-label-sm text-label-sm overflow-x-auto shadow-inner">
              <pre>{rawPayload}</pre>
            </div>
          </div>
        </div>

        <div className="px-space-xl py-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <button
            type="button"
            onClick={() => onAction(order.id, "REFUND")}
            className="w-full sm:w-auto px-space-md py-2 rounded-xl bg-error-container text-on-error-container hover:bg-error hover:text-on-error font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">undo</span>
            <span>{tx("Mark as Failed / Issue Refund", "ระบุว่าล้มเหลว / คืนเงิน")}</span>
          </button>
          <div className="w-full sm:w-auto flex items-center gap-space-sm justify-end">
            <button
              type="button"
              onClick={() => onAction(order.id, "REDELIVER")}
              className="w-full sm:w-auto px-space-md py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">autorenew</span>
              <span>{tx("Trigger Re-delivery Webhook", "ส่งคำสั่งจัดส่งซ้ำ")}</span>
            </button>
            <button
              type="button"
              onClick={() => onAction(order.id, "COMPLETE")}
              className="w-full sm:w-auto px-space-md py-2 rounded-xl bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-md text-label-md flex items-center justify-center gap-space-xs transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>{tx("Mark as Completed", "ยืนยันว่าเสร็จสมบูรณ์")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

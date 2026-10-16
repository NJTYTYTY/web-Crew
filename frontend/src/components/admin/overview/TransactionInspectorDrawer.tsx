"use client";

import React from "react";
import { OverviewTransaction } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

interface TransactionInspectorDrawerProps {
  transaction: OverviewTransaction | null;
  onClose: () => void;
  onActionToast: (title: string, message: string) => void;
}

export default function TransactionInspectorDrawer({
  transaction,
  onClose,
  onActionToast,
}: TransactionInspectorDrawerProps) {
  const { tx } = useLanguage();
  if (!transaction) return null;

  const payloadJson = JSON.stringify(
    {
      order_id: transaction.id.replace("#", ""),
      game: transaction.gameName,
      sku: transaction.skuCode,
      target_uid: transaction.targetUid,
      pin_vault: "VAULT_BOX_SEA_04",
      delivery_ms: 42100,
    },
    null,
    2
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl p-space-xl flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-space-lg">
          <div className="flex items-center justify-between border-b border-surface-container pb-space-md">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                {tx("Transaction Inspection", "ตรวจสอบรายละเอียดธุรกรรม")}
              </span>
              <span className="font-label-md text-label-md text-primary">
                {transaction.id}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                {tx("IQ-Bank Gateway Trace", "ร่องรอยเกตเวย์ IQ-Bank")}
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Ref: {transaction.iqBankRef.replace("#", "")}-BANK-TH
              </span>
              <span className="font-body-sm text-body-sm text-secondary">
                {tx(
                  `PromptPay QR Payload Verified • Auto-Settled (${transaction.amount})`,
                  `ยืนยัน PromptPay QR สำเร็จ • ชำระอัตโนมัติ (${transaction.amount})`
                )}
              </span>
            </div>

            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                {tx("Bot Dispatch Payload", "ข้อมูลคำสั่งบอท")}
              </span>
              <pre className="bg-on-surface text-surface p-space-md rounded-xl font-label-sm text-label-sm overflow-x-auto">
                <code>{payloadJson}</code>
              </pre>
            </div>

            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                {tx("Internal Actions", "คำสั่งจัดการภายใน")}
              </span>
              <div className="flex flex-col gap-space-xs">
                <button
                  type="button"
                  onClick={() =>
                    onActionToast(
                      tx("SMS Dispatched", "ส่ง SMS แล้ว"),
                      tx(
                        `Confirmation SMS resent to ${transaction.customerName} (${transaction.id}).`,
                        `ส่ง SMS ยืนยันซ้ำไปยัง ${transaction.customerName} (${transaction.id}) แล้ว`
                      )
                    )
                  }
                  className="w-full py-2 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm text-left px-3 flex items-center justify-between"
                >
                  <span>{tx("Resend Customer Confirmation SMS", "ส่ง SMS ยืนยันให้ลูกค้าอีกครั้ง")}</span>
                  <span className="material-symbols-outlined text-[16px]">sms</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onActionToast(
                      tx("Receipt Generated", "สร้างใบเสร็จแล้ว"),
                      tx(
                        `PDF receipt for ${transaction.id} queued for download.`,
                        `สร้างใบเสร็จ PDF สำหรับ ${transaction.id} พร้อมดาวน์โหลดแล้ว`
                      )
                    )
                  }
                  className="w-full py-2 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm text-left px-3 flex items-center justify-between"
                >
                  <span>{tx("Regenerate Game Top-Up Receipt PDF", "ออกใบเสร็จเติมเกม PDF ใหม่")}</span>
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const cleanOrderId = transaction.id.replace("#", "");
                    try {
                      await apiRequest(`/api/admin/orders/${encodeURIComponent(cleanOrderId)}`, {
                        method: "PATCH",
                        body: JSON.stringify({ status: "PAID", fulfillmentStatus: "COMPLETED" }),
                      });
                      onActionToast(
                        tx("Order Resolved in DB", "อัปเดตสถานะในฐานข้อมูลเรียบร้อย"),
                        tx(
                          `Order ${transaction.id} marked as PAID & COMPLETED in PostgreSQL.`,
                          `อัปเดตคำสั่งซื้อ ${transaction.id} เป็นชำระเงินและจัดส่งสำเร็จในฐานข้อมูลแล้ว`
                        )
                      );
                      onClose();
                    } catch (err: any) {
                      onActionToast(
                        tx("Resolve Failed", "อัปเดตไม่สำเร็จ"),
                        err.message || tx("Failed to resolve order", "ไม่สามารถอัปเดตคำสั่งซื้อได้")
                      );
                    }
                  }}
                  className="w-full py-2 bg-error-container text-on-error-container hover:opacity-90 rounded-lg font-label-sm text-label-sm text-left px-3 flex items-center justify-between"
                >
                  <span>{tx("Force Manual Resolve / Complete in DB", "บังคับยืนยันสำเร็จลงฐานข้อมูล")}</span>
                  <span className="material-symbols-outlined text-[16px]">replay</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-space-md border-t border-surface-container">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-on-surface text-surface rounded-xl font-label-md text-label-md"
          >
            {tx("Close Audit Window", "ปิดหน้าต่างตรวจสอบ")}
          </button>
        </div>
      </div>
    </div>
  );
}

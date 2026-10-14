"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface GatewayLatencyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GatewayLatencyModal({
  open,
  onClose,
}: GatewayLatencyModalProps) {
  const { tx } = useLanguage();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter">
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-xl shadow-xl p-space-xl flex flex-col gap-space-lg z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/50 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">
                terminal
              </span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {tx("Provider Gateway Live Latency", "ความหน่วงเกตเวย์ผู้ให้บริการแบบสด")}
              </h3>
              <span className="font-label-sm text-label-sm text-outline">
                {tx("Real-time health telemetry across providers", "สถานะความเสถียรของการเชื่อมต่อแต่ละค่ายเกมแบบเรียลไทม์")}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-body-md text-body-md text-on-surface font-medium">
                {tx("Arena of Valor (IQ-Bank Core)", "Arena of Valor (ระบบหลัก IQ-Bank)")}
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="font-label-sm text-label-sm text-outline">
                Ping: 34ms
              </span>
              <span className="px-space-sm py-0.5 rounded-md bg-secondary-container/40 text-on-secondary-fixed font-label-sm text-label-sm font-medium">
                {tx("99.99% UP", "ออนไลน์ 99.99%")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-body-md text-body-md text-on-surface font-medium">
                {tx("Free Fire (Server Inject Node #4)", "Free Fire (โหนดเติมตรง #4)")}
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="font-label-sm text-label-sm text-outline">
                Ping: 52ms
              </span>
              <span className="px-space-sm py-0.5 rounded-md bg-secondary-container/40 text-on-secondary-fixed font-label-sm text-label-sm font-medium">
                {tx("100.0% UP", "ออนไลน์ 100.0%")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
              <span className="font-body-md text-body-md text-on-surface font-medium">
                {tx("Roblox Worker Pool (8 Active Daemons)", "พูลบอท Roblox (ทำงานอยู่ 8 ตัว)")}
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="font-label-sm text-label-sm text-outline">
                Avg Q: 1.2s
              </span>
              <span className="px-space-sm py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-medium">
                {tx("ACTIVE", "ทำงานปกติ")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-space-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-space-lg py-space-sm rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high transition-colors"
          >
            {tx("Close Window", "ปิดหน้าต่าง")}
          </button>
        </div>
      </div>
    </div>
  );
}

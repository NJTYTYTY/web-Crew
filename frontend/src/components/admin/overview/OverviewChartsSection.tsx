"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const CHART_DAYS = [
  { dayEn: "Mon", dayTh: "จ.", ffClass: "h-10", rovClass: "h-16", rbxClass: "h-20", labelStyle: "text-on-surface-variant" },
  { dayEn: "Tue", dayTh: "อ.", ffClass: "h-12", rovClass: "h-20", rbxClass: "h-24", labelStyle: "text-on-surface-variant" },
  { dayEn: "Wed", dayTh: "พ.", ffClass: "h-14", rovClass: "h-[72px]", rbxClass: "h-28", labelStyle: "text-on-surface-variant" },
  { dayEn: "Thu", dayTh: "พฤ.", ffClass: "h-16", rovClass: "h-24", rbxClass: "h-32", labelStyle: "text-on-surface-variant" },
  { dayEn: "Fri", dayTh: "ศ.", ffClass: "h-20", rovClass: "h-28", rbxClass: "h-40", labelStyle: "text-primary font-medium" },
  { dayEn: "Sat", dayTh: "ส.", ffClass: "h-24", rovClass: "h-36", rbxClass: "h-44", labelStyle: "text-on-surface-variant font-medium" },
  { dayEn: "Sun (Today)", dayTh: "อา. (วันนี้)", ffClass: "h-28", rovClass: "h-32", rbxClass: "h-48", labelStyle: "text-secondary font-medium" },
];

export default function OverviewChartsSection() {
  const { tx } = useLanguage();
  const [period, setPeriod] = useState<"7D" | "30D" | "YTD">("7D");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-gutter-desktop">
      {/* 7-Day Chart & Game Volume Breakdown */}
      <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-5 sm:p-space-xl shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg border-b border-surface-container">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {tx("Top-Up Velocity & Liquidity Volume", "ความเร็วการเติมเงินและปริมาณธุรกรรม")}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {tx(
                "7-day aggregated transaction volume segregated by core game publisher titles",
                "ปริมาณธุรกรรมสะสมย้อนหลัง 7 วัน แยกตามค่ายเกมหลัก"
              )}
            </p>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-xl self-start sm:self-auto shrink-0">
            {(
              [
                { id: "7D", labelEn: "7 Days", labelTh: "7 วัน" },
                { id: "30D", labelEn: "30 Days", labelTh: "30 วัน" },
                { id: "YTD", labelEn: "YTD", labelTh: "รายปี" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPeriod(tab.id)}
                className={
                  period === tab.id
                    ? "px-space-md py-1 rounded-lg bg-surface-container-lowest font-label-sm text-label-sm text-on-surface shadow-xs whitespace-nowrap shrink-0"
                    : "px-space-md py-1 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap shrink-0"
                }
              >
                {tx(tab.labelEn, tab.labelTh)}
              </button>
            ))}
          </div>
        </div>

        {/* High-tech Stacked Bar Chart */}
        <div className="py-space-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 text-on-surface-variant font-label-sm text-label-sm mb-2">
            <span className="whitespace-nowrap">{tx("THB (Thousands)", "บาท (พันบาท)")}</span>
            <div className="flex flex-wrap items-center gap-3 sm:gap-space-lg">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-3 h-3 rounded-sm bg-primary shrink-0"></span> Roblox Robux
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-3 h-3 rounded-sm bg-secondary shrink-0"></span> RoV Vouchers
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-3 h-3 rounded-sm bg-tertiary shrink-0"></span> Free Fire Diamonds
              </span>
            </div>
          </div>

          <div className="h-56 w-full flex items-end gap-2 sm:gap-space-md justify-between pt-4">
            {CHART_DAYS.map((item) => (
              <div
                key={item.dayEn}
                className="flex-1 flex flex-col items-center gap-space-xs h-full justify-end group min-w-0"
              >
                <div className="w-full max-w-[42px] flex flex-col gap-1 items-stretch">
                  <div
                    className={`bg-tertiary rounded-t-sm ${item.ffClass} group-hover:opacity-85 transition-opacity`}
                    title="Free Fire Diamonds"
                  ></div>
                  <div
                    className={`bg-secondary ${item.rovClass} group-hover:opacity-85 transition-opacity`}
                    title="RoV Vouchers"
                  ></div>
                  <div
                    className={`bg-primary rounded-b-sm ${item.rbxClass} group-hover:opacity-85 transition-opacity`}
                    title="Roblox Robux"
                  ></div>
                </div>
                <span className={`font-label-sm text-label-sm whitespace-nowrap ${item.labelStyle}`}>
                  {tx(item.dayEn, item.dayTh)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-md border-t border-surface-container bg-surface-container-low/50 p-space-md rounded-xl">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              {tx("Roblox Volume Share", "สัดส่วนยอดขาย Roblox")}
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-semibold whitespace-nowrap">
              51.2% (฿731k)
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              {tx("RoV Arena Share", "สัดส่วนยอดขาย RoV")}
            </span>
            <span className="font-headline-sm text-headline-sm text-secondary font-semibold whitespace-nowrap">
              31.8% (฿454k)
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              {tx("Free Fire Share", "สัดส่วนยอดขาย Free Fire")}
            </span>
            <span className="font-headline-sm text-headline-sm text-tertiary font-semibold whitespace-nowrap">
              17.0% (฿243k)
            </span>
          </div>
        </div>
      </div>

      {/* Fulfillment Speed Radial Gauge */}
      <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-5 sm:p-space-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-on-surface">
              {tx("Queue Latency", "ความหน่วงของคิว")}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {tx("Automated IQ-Bank API Speed", "ความเร็ว API อัตโนมัติของ IQ-Bank")}
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping shrink-0"></span>
        </div>

        <div className="relative flex flex-col items-center justify-center my-space-lg">
          <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              className="text-surface-container-high"
              cx="60"
              cy="60"
              fill="transparent"
              r="48"
              stroke="currentColor"
              strokeWidth="10"
            ></circle>
            <circle
              className="text-secondary"
              cx="60"
              cy="60"
              fill="transparent"
              r="48"
              stroke="currentColor"
              strokeDasharray="301.59"
              strokeDashoffset="65"
              strokeLinecap="round"
              strokeWidth="10"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-headline-xl text-headline-xl font-bold text-on-surface">
              42s
            </span>
            <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold tracking-wide whitespace-nowrap">
              {tx("Target: < 60s", "เป้าหมาย: < 60 วินาที")}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 whitespace-nowrap">
              {tx("Avg Execution Time", "เวลาดำเนินการเฉลี่ย")}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-xl">
          <div className="flex items-center justify-between text-body-sm font-body-sm gap-2">
            <span className="text-on-surface-variant whitespace-nowrap">{tx("IQ Webhook ACK", "การตอบรับ IQ Webhook")}</span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold whitespace-nowrap">0.8s</span>
          </div>
          <div className="flex items-center justify-between text-body-sm font-body-sm gap-2">
            <span className="text-on-surface-variant whitespace-nowrap">{tx("Game Bot Dispatch", "ส่งคำสั่งบอทเติมเกม")}</span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold whitespace-nowrap">3.4s</span>
          </div>
          <div className="flex items-center justify-between text-body-sm font-body-sm gap-2">
            <span className="text-on-surface-variant whitespace-nowrap">{tx("Pin Injection & Receipt", "เติมพินและออกใบเสร็จ")}</span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold whitespace-nowrap">37.8s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

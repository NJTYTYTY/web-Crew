"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ChartBarData {
  dayEn: string;
  dayTh: string;
  ffClass: string;
  rovClass: string;
  rbxClass: string;
  labelStyle: string;
  tooltipText: string;
}

interface PeriodConfig {
  subtitleEn: string;
  subtitleTh: string;
  bars: ChartBarData[];
  rbxShare: string;
  rovShare: string;
  ffShare: string;
}

const PERIOD_DATA: Record<"7D" | "30D" | "YTD", PeriodConfig> = {
  "7D": {
    subtitleEn: "7-day aggregated transaction volume segregated by core game publisher titles",
    subtitleTh: "ปริมาณธุรกรรมสะสมย้อนหลัง 7 วัน แยกตามค่ายเกมหลัก",
    rbxShare: "51.2% (฿731k)",
    rovShare: "31.8% (฿454k)",
    ffShare: "17.0% (฿243k)",
    bars: [
      {
        dayEn: "Mon",
        dayTh: "จ.",
        ffClass: "h-[8px]",
        rovClass: "h-[16px]",
        rbxClass: "h-[28px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "จันทร์: ฿52k (Roblox ฿28k / RoV ฿16k / Free Fire ฿8k)",
      },
      {
        dayEn: "Tue",
        dayTh: "อ.",
        ffClass: "h-[10px]",
        rovClass: "h-[20px]",
        rbxClass: "h-[34px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "อังคาร: ฿64k (Roblox ฿34k / RoV ฿20k / Free Fire ฿10k)",
      },
      {
        dayEn: "Wed",
        dayTh: "พ.",
        ffClass: "h-[12px]",
        rovClass: "h-[24px]",
        rbxClass: "h-[42px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "พุธ: ฿78k (Roblox ฿42k / RoV ฿24k / Free Fire ฿12k)",
      },
      {
        dayEn: "Thu",
        dayTh: "พฤ.",
        ffClass: "h-[14px]",
        rovClass: "h-[28px]",
        rbxClass: "h-[50px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "พฤหัสบดี: ฿92k (Roblox ฿50k / RoV ฿28k / Free Fire ฿14k)",
      },
      {
        dayEn: "Fri",
        dayTh: "ศ.",
        ffClass: "h-[16px]",
        rovClass: "h-[34px]",
        rbxClass: "h-[60px]",
        labelStyle: "text-primary font-medium",
        tooltipText: "ศุกร์: ฿110k (Roblox ฿60k / RoV ฿34k / Free Fire ฿16k)",
      },
      {
        dayEn: "Sat",
        dayTh: "ส.",
        ffClass: "h-[18px]",
        rovClass: "h-[40px]",
        rbxClass: "h-[70px]",
        labelStyle: "text-on-surface-variant font-medium",
        tooltipText: "เสาร์: ฿128k (Roblox ฿70k / RoV ฿40k / Free Fire ฿18k)",
      },
      {
        dayEn: "Sun (Today)",
        dayTh: "อา. (วันนี้)",
        ffClass: "h-[22px]",
        rovClass: "h-[46px]",
        rbxClass: "h-[80px]",
        labelStyle: "text-secondary font-medium",
        tooltipText: "อาทิตย์ (วันนี้): ฿148k (Roblox ฿80k / RoV ฿46k / Free Fire ฿22k)",
      },
    ],
  },
  "30D": {
    subtitleEn: "30-day weekly aggregated transaction volume segregated by core game publisher titles",
    subtitleTh: "ปริมาณธุรกรรมสะสมรายสัปดาห์ย้อนหลัง 30 วัน แยกตามค่ายเกมหลัก",
    rbxShare: "52.4% (฿3,120k)",
    rovShare: "30.6% (฿1,825k)",
    ffShare: "17.0% (฿1,012k)",
    bars: [
      {
        dayEn: "W1",
        dayTh: "สัปดาห์ 1",
        ffClass: "h-[14px]",
        rovClass: "h-[26px]",
        rbxClass: "h-[46px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "สัปดาห์ 1: ฿860k (Roblox ฿460k / RoV ฿260k / Free Fire ฿140k)",
      },
      {
        dayEn: "W2",
        dayTh: "สัปดาห์ 2",
        ffClass: "h-[16px]",
        rovClass: "h-[30px]",
        rbxClass: "h-[54px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "สัปดาห์ 2: ฿1,000k (Roblox ฿540k / RoV ฿300k / Free Fire ฿160k)",
      },
      {
        dayEn: "W3",
        dayTh: "สัปดาห์ 3",
        ffClass: "h-[18px]",
        rovClass: "h-[36px]",
        rbxClass: "h-[62px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "สัปดาห์ 3: ฿1,160k (Roblox ฿620k / RoV ฿360k / Free Fire ฿180k)",
      },
      {
        dayEn: "W4",
        dayTh: "สัปดาห์ 4",
        ffClass: "h-[20px]",
        rovClass: "h-[40px]",
        rbxClass: "h-[72px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "สัปดาห์ 4: ฿1,320k (Roblox ฿720k / RoV ฿400k / Free Fire ฿200k)",
      },
      {
        dayEn: "W5 (Now)",
        dayTh: "สัปดาห์นี้",
        ffClass: "h-[22px]",
        rovClass: "h-[44px]",
        rbxClass: "h-[78px]",
        labelStyle: "text-secondary font-medium",
        tooltipText: "สัปดาห์นี้: ฿1,440k (Roblox ฿780k / RoV ฿440k / Free Fire ฿220k)",
      },
    ],
  },
  "YTD": {
    subtitleEn: "Year-to-date bi-monthly aggregated transaction volume segregated by core game publisher titles",
    subtitleTh: "ปริมาณธุรกรรมสะสมรายงวดย้อนหลังตั้งแต่ต้นปี แยกตามค่ายเกมหลัก",
    rbxShare: "53.1% (฿24,850k)",
    rovShare: "29.9% (฿14,010k)",
    ffShare: "17.0% (฿7,960k)",
    bars: [
      {
        dayEn: "Jan",
        dayTh: "ม.ค.",
        ffClass: "h-[10px]",
        rovClass: "h-[18px]",
        rbxClass: "h-[32px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "ม.ค.: ฿6.0M (Roblox ฿3.2M / RoV ฿1.8M / Free Fire ฿1.0M)",
      },
      {
        dayEn: "Mar",
        dayTh: "มี.ค.",
        ffClass: "h-[12px]",
        rovClass: "h-[22px]",
        rbxClass: "h-[40px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "มี.ค.: ฿7.4M (Roblox ฿4.0M / RoV ฿2.2M / Free Fire ฿1.2M)",
      },
      {
        dayEn: "May",
        dayTh: "พ.ค.",
        ffClass: "h-[14px]",
        rovClass: "h-[28px]",
        rbxClass: "h-[50px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "พ.ค.: ฿9.2M (Roblox ฿5.0M / RoV ฿2.8M / Free Fire ฿1.4M)",
      },
      {
        dayEn: "Jul",
        dayTh: "ก.ค.",
        ffClass: "h-[16px]",
        rovClass: "h-[34px]",
        rbxClass: "h-[60px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "ก.ค.: ฿11.0M (Roblox ฿6.0M / RoV ฿3.4M / Free Fire ฿1.6M)",
      },
      {
        dayEn: "Sep",
        dayTh: "ก.ย.",
        ffClass: "h-[18px]",
        rovClass: "h-[38px]",
        rbxClass: "h-[68px]",
        labelStyle: "text-on-surface-variant",
        tooltipText: "ก.ย.: ฿12.4M (Roblox ฿6.8M / RoV ฿3.8M / Free Fire ฿1.8M)",
      },
      {
        dayEn: "Nov (Now)",
        dayTh: "พ.ย. (ปัจจุบัน)",
        ffClass: "h-[22px]",
        rovClass: "h-[44px]",
        rbxClass: "h-[78px]",
        labelStyle: "text-secondary font-medium",
        tooltipText: "พ.ย. (ปัจจุบัน): ฿14.4M (Roblox ฿7.8M / RoV ฿4.4M / Free Fire ฿2.2M)",
      },
    ],
  },
};

export default function OverviewChartsSection() {
  const { tx } = useLanguage();
  const [period, setPeriod] = useState<"7D" | "30D" | "YTD">("7D");

  const currentConfig = PERIOD_DATA[period];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-gutter-desktop">
      {/* Dynamic Stacked Bar Chart & Game Volume Breakdown */}
      <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-5 sm:p-space-xl shadow-sm flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg border-b border-surface-container">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {tx("Top-Up Velocity & Liquidity Volume", "ความเร็วการเติมเงินและปริมาณธุรกรรม")}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {tx(currentConfig.subtitleEn, currentConfig.subtitleTh)}
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
                    ? "px-space-md py-1 rounded-lg bg-surface-container-lowest font-label-sm text-label-sm text-on-surface shadow-xs whitespace-nowrap shrink-0 transition-all"
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
            <span className="whitespace-nowrap">{tx("THB (Volume Index)", "ดัชนียอดขาย (บาท)")}</span>
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
            {currentConfig.bars.map((item) => (
              <div
                key={item.dayEn}
                title={item.tooltipText}
                className="flex-1 flex flex-col items-center gap-space-xs h-full justify-end group min-w-0 cursor-pointer"
              >
                <div className="w-full max-w-[36px] sm:max-w-[42px] flex flex-col gap-1 items-stretch">
                  <div
                    className={`bg-tertiary rounded-t-sm ${item.ffClass} group-hover:opacity-85 transition-all shadow-xs`}
                    title={`Free Fire Diamonds (${item.dayEn})`}
                  ></div>
                  <div
                    className={`bg-secondary ${item.rovClass} group-hover:opacity-85 transition-all shadow-xs`}
                    title={`RoV Vouchers (${item.dayEn})`}
                  ></div>
                  <div
                    className={`bg-primary rounded-b-sm ${item.rbxClass} group-hover:opacity-85 transition-all shadow-xs`}
                    title={`Roblox Robux (${item.dayEn})`}
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
              {currentConfig.rbxShare}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              {tx("RoV Arena Share", "สัดส่วนยอดขาย RoV")}
            </span>
            <span className="font-headline-sm text-headline-sm text-secondary font-semibold whitespace-nowrap">
              {currentConfig.rovShare}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              {tx("Free Fire Share", "สัดส่วนยอดขาย Free Fire")}
            </span>
            <span className="font-headline-sm text-headline-sm text-tertiary font-semibold whitespace-nowrap">
              {currentConfig.ffShare}
            </span>
          </div>
        </div>
      </div>

      {/* Fulfillment Speed Radial Gauge */}
      <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-5 sm:p-space-xl shadow-sm flex flex-col justify-between overflow-hidden">
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

'use client';

import React, { useState } from 'react';
import {
  ArrowRight, CheckCircle, FileCheck, Radio, ScanLine, UploadCloud, XCircle,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function SimulatorView() {
  const {
    activeOrder, simLogs, simulateQRUpload, triggerWebhookSuccess, triggerWebhookFailed, switchView,
  } = useStore();
  const { tx } = useLanguage();

  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const handleLoadQr = () => {
    simulateQRUpload();
    setBannerNotice(
      tx(
        `PromptPay QR for transaction ${activeOrder.txRef} loaded successfully!`,
        `โหลดข้อมูล QR พร้อมเพย์สำหรับรายการ ${activeOrder.txRef} สำเร็จแล้ว!`
      )
    );
    setTimeout(() => setBannerNotice(null), 3000);
  };

  const handleTriggerFail = async () => {
    await triggerWebhookFailed();
    setBannerNotice(
      tx(
        'Simulated Failed Transaction: The order QR code timed out or was rejected by IQ-Bank.',
        'จำลองรายการล้มเหลว: QR Code หมดอายุหรือถูกปฏิเสธโดยระบบธนาคาร IQ-Bank'
      )
    );
    setTimeout(() => setBannerNotice(null), 3500);
  };

  return (
    <div id="view-simulator" className="page-view">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gradient-to-b from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-700/50">
          {/* Bank Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-emerald-800/80 gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/30 shrink-0">
                IQ
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                    {tx('IQ-Bank Web Payment Simulator', 'ระบบจำลองการโอนเงินธนาคาร IQ-Bank')}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono whitespace-nowrap shrink-0">
                    SANDBOX v2.4
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  {tx(
                    'Interactive webhook simulation engine for testing PromptPay QR settlement',
                    'ระบบจำลองการสแกน QR พร้อมเพย์และส่ง Webhook อัตโนมัติพร้อมลายเซ็น HMAC-SHA256'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-mono bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800 text-emerald-400 whitespace-nowrap">
                POST /api/webhooks/iqbank
              </span>
            </div>
          </div>

          {bannerNotice && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-xs font-semibold text-emerald-200">
              {bannerNotice}
            </div>
          )}

          {/* Simulator Body */}
          <div className="py-6 space-y-6">
            {/* Step 1: Upload / Drop QR */}
            <div className="bg-slate-800/70 rounded-2xl p-5 sm:p-6 border border-emerald-800/40">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <ScanLine className="w-4 h-4 shrink-0" />
                  <span>{tx('1. QR Code Capture & Ingestion', '1. อัปโหลดหรือดึงข้อมูล QR Code พร้อมเพย์')}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {tx('Simulate scanning customer PromptPay QR', 'จำลองการสแกน QR จากแอปธนาคาร')}
                </span>
              </div>

              <div
                onClick={handleLoadQr}
                className="border-2 border-dashed border-emerald-700/50 hover:border-emerald-500 rounded-xl p-6 text-center bg-slate-900/60 transition group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-200">
                  {tx(
                    'Drag & Drop PromptPay QR screenshot here, or click to load active transaction',
                    'ลากและวางภาพสกรีนช็อต QR พร้อมเพย์ที่นี่ หรือคลิกเพื่อดึงรายการที่กำลังรอชำระ'
                  )}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {tx('Supports EMVCo PromptPay standard payload', 'รองรับมาตรฐาน EMVCo PromptPay ประเทศไทย')}
                </p>
                <button
                  type="button"
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
                >
                  {tx('Load Active Pending QR Code', 'ดึงข้อมูล QR รายการล่าสุด')}
                </button>
              </div>
            </div>

            {/* Step 2: Parsed Transaction Data */}
            <div className="bg-slate-800/70 rounded-2xl p-5 sm:p-6 border border-emerald-800/40">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 mb-4">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>{tx('2. Parsed Merchant Transaction Metadata', '2. ข้อมูลธุรกรรมร้านค้าที่ถอดรหัสจาก QR')}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block font-semibold">{tx('MERCHANT NAME', 'ชื่อร้านค้า')}</span>
                  <span className="font-bold text-white text-sm mt-0.5 block truncate">NEXUS PLAY STORE</span>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block font-semibold">{tx('TRANSACTION REF', 'รหัสอ้างอิงธุรกรรม')}</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm mt-0.5 block truncate" id="sim-ref">
                    {activeOrder.txRef}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block font-semibold">{tx('TARGET ACCOUNT', 'บัญชีปลายทาง')}</span>
                  <span className="font-bold text-white text-sm mt-0.5 block font-mono truncate">098-4-88192-1 (IQ-B)</span>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block font-semibold">{tx('TOTAL CHARGE', 'ยอดโอนสุทธิ')}</span>
                  <span className="font-black text-emerald-300 text-base mt-0.5 block whitespace-nowrap" id="sim-amount">
                    ฿{activeOrder.price}.00 THB
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Webhook Actions */}
            <div className="bg-slate-800/70 rounded-2xl p-5 sm:p-6 border border-emerald-800/40 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Radio className="w-4 h-4 shrink-0" />
                  <span>{tx('3. Dispatch Webhook Event Simulation', '3. จำลองการยิง Webhook แจ้งผลไปยังระบบหลังบ้าน')}</span>
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  {tx(
                    'Select an outcome below. The simulator will immediately notify the storefront frontend and transition the modal.',
                    'เลือกผลลัพธ์ด้านล่าง ระบบจำลองจะส่ง Webhook พร้อมลายเซ็นดิจิทัลไปยัง Backend และอัปเดตหน้าต่างรับสินค้าทันที'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={triggerWebhookSuccess}
                  className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/50 transition flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{tx('Confirm Payment (Trigger Webhook)', 'ยืนยันโอนเงินสำเร็จ (ยิง Webhook)')}</span>
                </button>

                <button
                  onClick={handleTriggerFail}
                  className="p-4 rounded-xl bg-slate-900 hover:bg-red-950/50 text-red-400 border border-red-500/30 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>{tx('Simulate Failed / Expired Payment', 'จำลองโอนล้มเหลว / QR หมดอายุ')}</span>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">
                  {tx('REAL-TIME WEBHOOK LOGS:', 'บันทึกการส่ง WEBHOOK แบบเรียลไทม์:')}
                </span>
                <div
                  className="bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-emerald-400 space-y-1 h-24 overflow-y-auto"
                  id="sim-console"
                >
                  {simLogs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.includes('ERROR')
                          ? 'text-red-400'
                          : line.includes('PAYLOAD')
                          ? 'text-white'
                          : line.includes('SUCCESS')
                          ? 'text-emerald-300'
                          : 'text-emerald-400'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>{tx('Powered by IQ-Bank Thai QR Payment Infrastructure', 'ขับเคลื่อนด้วยโครงสร้างพื้นฐานการชำระเงิน IQ-Bank Thai QR')}</span>
            <button
              onClick={() => switchView('home')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 whitespace-nowrap shrink-0"
            >
              <span>{tx('Return to Storefront', 'กลับสู่หน้าร้านค้า')}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

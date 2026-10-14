'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowRight, Check, CheckCircle2, Clock, Download, ExternalLink, Layers, ShieldCheck, X,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { ModalStateName } from '@/types/store';

export function PaymentCheckoutModal() {
  const {
    isModalOpen, modalState, setModalState, closeModal, activeOrder, openSimulatorDirectly, switchView,
  } = useStore();
  const { tx } = useLanguage();

  const [secondsLeft, setSecondsLeft] = useState(585);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalOpen) { setSecondsLeft(585); return; }
    const timer = setInterval(() => setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const formattedTime = `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 1500);
  };

  const tabClass = (st: ModalStateName) =>
    `px-2 py-0.5 rounded font-bold transition ${modalState === st ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'}`;

  return (
    <div id="payment-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Prototype State Bar */}
        <div className="bg-slate-900 text-slate-300 px-4 py-2 flex items-center justify-between text-[11px] border-b border-slate-800">
          <span className="font-bold flex items-center space-x-1.5 text-white">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{tx('TEST PREVIEW MODAL STATES:', 'สลับสถานะป๊อปอัปเพื่อทดสอบ:')}</span>
          </span>
          <div className="flex items-center space-x-1">
            <button onClick={() => setModalState('waiting')} id="modal-tab-waiting" className={tabClass('waiting')}>
              {tx('1. QR Waiting', '1. รอสแกน QR')}
            </button>
            <button onClick={() => setModalState('success')} id="modal-tab-success" className={tabClass('success')}>
              {tx('2. Verified', '2. โอนสำเร็จ')}
            </button>
            <button onClick={() => setModalState('fulfillment')} id="modal-tab-fulfillment" className={tabClass('fulfillment')}>
              {tx('3. Delivery', '3. รับสินค้า')}
            </button>
          </div>
        </div>

        <button onClick={closeModal} className="absolute top-10 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition z-10">
          <X className="w-5 h-5" />
        </button>

        {/* ================= MODAL STATE 1: WAITING FOR PAYMENT (QR CODE) ================= */}
        {modalState === 'waiting' && (
          <div id="modal-state-waiting" className="p-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-ring" />
                <span>{tx('IQ-Bank Official Payment — Dynamic QR PromptPay', 'ระบบชำระเงินทางการ IQ-Bank — พร้อมเพย์ Dynamic QR')}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900" id="modal-item-title">{activeOrder.title}</h3>
              <div className="flex items-center justify-center space-x-3 text-xs text-slate-500 mt-1 font-mono">
                <span>{tx('Ref:', 'อ้างอิง:')} <b className="text-slate-700" id="modal-tx-ref">{activeOrder.txRef}</b></span>
                <span>•</span>
                <span>{tx('Amount:', 'ยอดชำระ:')} <b className="text-indigo-600 text-sm font-black" id="modal-tx-price">฿{activeOrder.price}.00</b></span>
              </div>
            </div>

            <div className="py-5 flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl border-2 border-indigo-600/30 shadow-lg flex flex-col items-center relative group">
                <div className="w-full bg-[#003d6b] text-white py-1 px-3 rounded-t-lg text-center text-[10px] font-bold tracking-wider mb-2 flex items-center justify-center space-x-1">
                  <span>PROMPTPAY THAI QR PAYMENT</span>
                </div>

                <div className="w-52 h-52 bg-white flex items-center justify-center relative p-2 border border-slate-200 rounded-lg">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="3" fill="#0f172a" />
                    <rect x="4" y="4" width="22" height="22" rx="2" fill="#ffffff" />
                    <rect x="8" y="8" width="14" height="14" rx="1" fill="#4f46e5" />
                    <rect x="70" y="0" width="30" height="30" rx="3" fill="#0f172a" />
                    <rect x="74" y="4" width="22" height="22" rx="2" fill="#ffffff" />
                    <rect x="78" y="8" width="14" height="14" rx="1" fill="#4f46e5" />
                    <rect x="0" y="70" width="30" height="30" rx="3" fill="#0f172a" />
                    <rect x="4" y="74" width="22" height="22" rx="2" fill="#ffffff" />
                    <rect x="8" y="78" width="14" height="14" rx="1" fill="#4f46e5" />
                    <rect x="36" y="8" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="8" width="8" height="8" fill="#0f172a" />
                    <rect x="36" y="20" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="20" width="8" height="8" fill="#0f172a" />
                    <rect x="8" y="36" width="8" height="8" fill="#0f172a" />
                    <rect x="8" y="48" width="8" height="8" fill="#0f172a" />
                    <rect x="20" y="36" width="8" height="8" fill="#0f172a" />
                    <rect x="20" y="48" width="8" height="8" fill="#0f172a" />
                    <rect x="36" y="36" width="28" height="28" rx="2" fill="#10b981" />
                    <rect x="44" y="44" width="12" height="12" fill="#ffffff" />
                    <rect x="70" y="36" width="8" height="8" fill="#0f172a" />
                    <rect x="84" y="36" width="8" height="8" fill="#0f172a" />
                    <rect x="70" y="48" width="8" height="8" fill="#0f172a" />
                    <rect x="84" y="48" width="8" height="8" fill="#0f172a" />
                    <rect x="36" y="70" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="70" width="8" height="8" fill="#0f172a" />
                    <rect x="36" y="84" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="84" width="8" height="8" fill="#0f172a" />
                    <rect x="70" y="70" width="8" height="8" fill="#0f172a" />
                    <rect x="84" y="70" width="8" height="8" fill="#0f172a" />
                    <rect x="76" y="84" width="16" height="8" fill="#0f172a" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center font-black text-xs text-indigo-600">IQ</div>
                  </div>
                </div>

                <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span id="qr-countdown" className="font-bold text-slate-800">{formattedTime}</span>
                  </span>
                  <button type="button" onClick={() => copyToClipboard(activeOrder.txRef, 'qr')} className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 text-[11px]">
                    <Download className="w-3 h-3" />
                    <span>{copiedLabel === 'qr' ? tx('QR Captured!', 'บันทึก QR แล้ว!') : tx('Download / Capture QR', 'ดาวน์โหลด / แคปภาพ QR')}</span>
                  </button>
                </div>
              </div>

              <div className="w-full mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">{tx('Waiting for payment...', 'กำลังรอการชำระเงิน...')}</div>
                  <div className="text-[11px] text-slate-500">{tx('Auto-detecting transaction from IQ-Bank Webhook', 'ระบบกำลังตรวจจับยอดโอนอัตโนมัติจาก IQ-Bank Webhook')}</div>
                </div>
              </div>

              <div className="w-full mt-4 pt-3 border-t border-slate-100">
                <button onClick={openSimulatorDirectly} className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5">
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  <span>{tx('Open IQ-Bank Demo Payment Simulator ↗', 'เปิดระบบจำลองการโอนเงิน IQ-Bank ↗')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL STATE 2: PAYMENT VERIFIED ================= */}
        {modalState === 'success' && (
          <div id="modal-state-success" className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20 animate-bounce">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{tx('Payment Verified Automatically!', 'ตรวจสอบยอดชำระเงินสำเร็จอัตโนมัติ!')}</h3>
            <p className="text-xs text-slate-500 mt-1">{tx('Confirmed via IQ-Bank Dynamic PromptPay webhook', 'ยืนยันยอดโอนผ่านระบบ IQ-Bank Dynamic PromptPay Webhook เรียบร้อยแล้ว')}</p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 my-5 text-left text-xs space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">{tx('Transaction Ref:', 'รหัสอ้างอิงธุรกรรม:')}</span><span className="font-mono font-bold text-slate-800" id="success-tx-ref">{activeOrder.txRef}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{tx('Settled Amount:', 'ยอดชำระสุทธิ:')}</span><span className="font-bold text-emerald-600" id="success-tx-amount">฿{activeOrder.price}.00 THB</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{tx('Payment Channel:', 'ช่องทางชำระเงิน:')}</span><span className="font-semibold text-slate-700">PromptPay QR (IQ-Bank Gateway)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{tx('Timestamp:', 'เวลาทำรายการ:')}</span><span className="font-mono text-slate-600" id="success-timestamp">{tx('Just now', 'เมื่อสักครู่')}</span></div>
            </div>

            <button onClick={() => setModalState('fulfillment')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-1.5">
              <span>{tx('Proceed to Instant Fulfillment', 'ดำเนินการรับสินค้า / ไอดีเกมทันที')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= MODAL STATE 3: INSTANT FULFILLMENT / DELIVERY ================= */}
        {modalState === 'fulfillment' && (
          <div id="modal-state-fulfillment" className="p-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                {tx('Order Complete', 'คำสั่งซื้อสำเร็จ')}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{tx('Instant Order Delivery', 'ส่งมอบสินค้าอัตโนมัติเรียบร้อย')}</h3>
              <p className="text-xs text-slate-500">{tx('Your purchase has been fulfilled automatically by our bot.', 'บอทของเราได้จัดส่งข้อมูลคำสั่งซื้อให้คุณโดยอัตโนมัติแล้ว')}</p>
            </div>

            {activeOrder.type === 'account' ? (
              <div id="fulfillment-type-account" className="py-4 space-y-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{tx('Account unlinked & password verified. Please change password immediately!', 'ไอดีสะอาดไม่ติดเมล กรุณาเปลี่ยนรหัสผ่านทันทีหลังเข้าสู่ระบบ!')}</span>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">{tx('Account Username:', 'ชื่อผู้ใช้ไอดีเกม:')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-amber-300" id="revealed-user">{activeOrder.username || 'blox_kitsune_99'}</span>
                      <button onClick={() => copyToClipboard(activeOrder.username || 'blox_kitsune_99', 'user')} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                        {copiedLabel === 'user' ? tx('Copied!', 'คัดลอกแล้ว!') : tx('Copy', 'คัดลอก')}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{tx('Account Password:', 'รหัสผ่านไอดีเกม:')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-emerald-400" id="revealed-pass">{activeOrder.password || 'NexPass#7741'}</span>
                      <button onClick={() => copyToClipboard(activeOrder.password || 'NexPass#7741', 'pass')} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                        {copiedLabel === 'pass' ? tx('Copied!', 'คัดลอกแล้ว!') : tx('Copy', 'คัดลอก')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div id="fulfillment-type-topup" className="py-4 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-900">{tx('Live Top-Up Delivery Progress:', 'สถานะการจัดส่งเติมเกมอัตโนมัติ:')}</div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-600 font-semibold"><CheckCircle2 className="w-4 h-4" /><span>{tx('1. Payment Confirmed by IQ-Bank', '1. ยืนยันยอดชำระเงินจาก IQ-Bank สำเร็จ')}</span></div>
                    <div className="flex items-center space-x-2 text-emerald-600 font-semibold"><CheckCircle2 className="w-4 h-4" /><span>{tx('2. Injected to UID / In-Game Server', '2. ส่งคำสั่งเติมเข้า UID / เซิร์ฟเวอร์เกมเรียบร้อย')}</span></div>
                    <div className="flex items-center space-x-2 text-emerald-600 font-semibold"><CheckCircle2 className="w-4 h-4" /><span>{tx('3. Balance Credited Successfully (100%)', '3. เติมคูปอง/เพชร/Robux เข้าบัญชีสำเร็จ (100%)')}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center space-x-3">
              <button onClick={() => { switchView('orders'); closeModal(); }} className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition text-center">
                {tx('View in My Orders', 'ดูในประวัติการสั่งซื้อ')}
              </button>
              <button onClick={closeModal} className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition text-center">
                {tx('Done / Close', 'เสร็จสิ้น / ปิดหน้าต่าง')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

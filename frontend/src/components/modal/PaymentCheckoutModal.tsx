'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  ArrowRight, Check, CheckCircle2, Clock, Download, ExternalLink, ShieldCheck, X,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function PaymentCheckoutModal() {
  const {
    isModalOpen, modalState, setModalState, closeModal, activeOrder, openSimulatorDirectly, switchView,
  } = useStore();
  const { tx } = useLanguage();

  const [secondsLeft, setSecondsLeft] = useState(585);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalOpen) { setSecondsLeft(585); return; }
    const timer = setInterval(() => setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;
    const payload =
      activeOrder.qrPayload ||
      `00020101021229370016A000000677010111011300668000000005802TH530376454${activeOrder.price
        .toFixed(2)
        .length.toString()
        .padStart(2, '0')}${activeOrder.price.toFixed(2)}621705${activeOrder.txRef.length
        .toString()
        .padStart(2, '0')}${activeOrder.txRef}6304IQBK`;

    QRCode.toDataURL(payload, {
      width: 256,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [isModalOpen, activeOrder.qrPayload, activeOrder.txRef, activeOrder.price]);

  if (!isModalOpen) return null;

  const formattedTime = `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `PromptPay-QR-${activeOrder.txRef}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopiedLabel('qr');
    setTimeout(() => setCopiedLabel(null), 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 1500);
  };

  return (
    <div id="payment-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= MODAL STATE 1: WAITING FOR PAYMENT (QR CODE) ================= */}
        {modalState === 'waiting' && (
          <div id="modal-state-waiting" className="p-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-ring shrink-0" />
                <span>{tx('Official Payment — Dynamic QR PromptPay', 'ระบบชำระเงินทางการ — พร้อมเพย์ Dynamic QR')}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 px-4" id="modal-item-title">{activeOrder.title}</h3>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1 font-mono">
                <span className="whitespace-nowrap">{tx('Ref:', 'อ้างอิง:')} <b className="text-slate-700" id="modal-tx-ref">{activeOrder.txRef}</b></span>
                <span>•</span>
                <span className="whitespace-nowrap">{tx('Amount:', 'ยอดชำระ:')} <b className="text-indigo-600 text-sm font-black" id="modal-tx-price">฿{activeOrder.price}.00</b></span>
              </div>
            </div>

            {secondsLeft === 0 ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center font-bold text-lg">
                  !
                </div>
                <h4 className="text-base font-bold text-slate-900">{tx('QR Code Expired', 'รหัส QR หมดอายุ')}</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {tx('The payment window has timed out. Please initiate a new order.', 'เวลาในการชำระเงินหมดลงแล้ว กรุณาสร้างคำสั่งซื้อใหม่')}
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                >
                  {tx('Close & Retry', 'ปิดและลองใหม่')}
                </button>
              </div>
            ) : (
              <div className="py-5 flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl border-2 border-indigo-600/30 shadow-lg flex flex-col items-center relative group">
                  <div className="w-full bg-[#003d6b] text-white py-1 px-3 rounded-t-lg text-center text-[10px] font-bold tracking-wider mb-2 flex items-center justify-center space-x-1 whitespace-nowrap">
                    <span>PROMPTPAY THAI QR PAYMENT</span>
                  </div>

                  <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white flex items-center justify-center relative p-2 border border-slate-200 rounded-lg">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="PromptPay QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-7 h-7 rounded bg-white shadow border border-slate-200 flex items-center justify-center font-black text-[10px] text-indigo-600">
                        IQ
                      </div>
                    </div>
                  </div>

                  <div className="w-full mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="flex items-center space-x-1 font-mono whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span id="qr-countdown" className="font-bold text-slate-800">{formattedTime}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 text-[11px] whitespace-nowrap shrink-0"
                    >
                      <Download className="w-3 h-3 shrink-0" />
                      <span>{copiedLabel === 'qr' ? tx('QR Saved!', 'บันทึก QR แล้ว!') : tx('Download / Save QR', 'ดาวน์โหลดภาพ QR')}</span>
                    </button>
                  </div>
                </div>

                <div className="w-full mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <div className="text-xs min-w-0">
                    <div className="font-bold text-slate-800">{tx('Waiting for payment...', 'กำลังรอการชำระเงิน...')}</div>
                    <div className="text-[11px] text-slate-500 truncate">{tx('Auto-detecting transaction from IQ-Bank Webhook', 'ระบบกำลังตรวจจับยอดโอนอัตโนมัติจาก IQ-Bank Webhook')}</div>
                  </div>
                </div>

                <div className="w-full mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={openSimulatorDirectly}
                    className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{tx('Open IQ-Bank Demo Payment Simulator ↗', 'เปิดระบบจำลองการโอนเงิน IQ-Bank ↗')}</span>
                  </button>
                </div>
              </div>
            )}
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
              <div className="flex justify-between gap-2"><span className="text-slate-500 whitespace-nowrap">{tx('Transaction Ref:', 'รหัสอ้างอิงธุรกรรม:')}</span><span className="font-mono font-bold text-slate-800" id="success-tx-ref">{activeOrder.txRef}</span></div>
              <div className="flex justify-between gap-2"><span className="text-slate-500 whitespace-nowrap">{tx('Settled Amount:', 'ยอดชำระสุทธิ:')}</span><span className="font-bold text-emerald-600 whitespace-nowrap" id="success-tx-amount">฿{activeOrder.price}.00 THB</span></div>
              <div className="flex justify-between gap-2"><span className="text-slate-500 whitespace-nowrap">{tx('Payment Channel:', 'ช่องทางชำระเงิน:')}</span><span className="font-semibold text-slate-700 text-right">PromptPay QR (IQ-Bank Gateway)</span></div>
              <div className="flex justify-between gap-2"><span className="text-slate-500 whitespace-nowrap">{tx('Timestamp:', 'เวลาทำรายการ:')}</span><span className="font-mono text-slate-600 whitespace-nowrap" id="success-timestamp">{tx('Just now', 'เมื่อสักครู่')}</span></div>
            </div>

            <button
              onClick={() => setModalState('fulfillment')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-1.5 whitespace-nowrap"
            >
              <span>{tx('Proceed to Instant Fulfillment', 'ดำเนินการรับสินค้า / ไอดีเกมทันที')}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}

        {/* ================= MODAL STATE 3: INSTANT FULFILLMENT / DELIVERY ================= */}
        {modalState === 'fulfillment' && (
          <div id="modal-state-fulfillment" className="p-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase whitespace-nowrap">
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
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <span className="text-slate-400 whitespace-nowrap">{tx('Account Username:', 'ชื่อผู้ใช้ไอดีเกม:')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-amber-300" id="revealed-user">
                        {activeOrder.username || tx('Retrieving...', 'กำลังโหลด...')}
                      </span>
                      {activeOrder.username && (
                        <button
                          onClick={() => copyToClipboard(activeOrder.username || '', 'user')}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-slate-300 whitespace-nowrap shrink-0"
                        >
                          {copiedLabel === 'user' ? tx('Copied!', 'คัดลอกแล้ว!') : tx('Copy', 'คัดลอก')}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 whitespace-nowrap">{tx('Account Password:', 'รหัสผ่านไอดีเกม:')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-emerald-400" id="revealed-pass">
                        {activeOrder.password || tx('Retrieving...', 'กำลังโหลด...')}
                      </span>
                      {activeOrder.password && (
                        <button
                          onClick={() => copyToClipboard(activeOrder.password || '', 'pass')}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-slate-300 whitespace-nowrap shrink-0"
                        >
                          {copiedLabel === 'pass' ? tx('Copied!', 'คัดลอกแล้ว!') : tx('Copy', 'คัดลอก')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div id="fulfillment-type-topup" className="py-4 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-900">{tx('Live Top-Up Delivery Progress:', 'สถานะการจัดส่งเติมเกมอัตโนมัติ:')}</div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-600 font-semibold"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>{tx('1. Payment Confirmed by IQ-Bank', '1. ยืนยันยอดชำระเงินจาก IQ-Bank สำเร็จ')}</span></div>
                    <div className="flex items-center space-x-2 text-emerald-600 font-semibold"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>{tx('2. Injected to UID / In-Game Server', '2. ส่งคำสั่งเติมเข้า UID / เซิร์ฟเวอร์เกมเรียบร้อย')}</span></div>
                    <div className="flex items-center space-x-2 text-emerald-600 font-semibold"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>{tx('3. Balance Credited Successfully (100%)', '3. เติมคูปอง/เพชร/Robux เข้าบัญชีสำเร็จ (100%)')}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center space-x-3">
              <button
                onClick={() => { switchView('orders'); closeModal(); }}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition text-center whitespace-nowrap"
              >
                {tx('View in My Orders', 'ดูในประวัติการสั่งซื้อ')}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition text-center whitespace-nowrap"
              >
                {tx('Done / Close', 'เสร็จสิ้น / ปิดหน้าต่าง')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

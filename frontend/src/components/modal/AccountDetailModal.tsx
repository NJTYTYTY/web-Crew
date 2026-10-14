'use client';

import React, { useState } from 'react';
import {
  Award, CheckCircle2, Globe2, Layers, Maximize2, ShieldCheck, ShoppingCart, Sparkles, Swords, X,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function AccountDetailModal() {
  const { selectedAccountForDetail, closeAccountDetail, buyAccount } = useStore();
  const { tx } = useLanguage();
  const [zoomImage, setZoomImage] = useState(false);

  if (!selectedAccountForDetail) return null;

  const acc = selectedAccountForDetail;
  const isInStock = acc.stock === 'in_stock';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4" onClick={closeAccountDetail}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full Account Screenshot Showcase */}
        <div className="relative bg-slate-950 overflow-hidden border-b border-slate-800">
          <img
            src={acc.image}
            alt={acc.title}
            onClick={() => setZoomImage((p) => !p)}
            className={`w-full cursor-zoom-in transition-all duration-300 mx-auto ${
              zoomImage ? 'max-h-none object-contain' : 'max-h-[380px] object-contain'
            }`}
          />

          <button
            type="button"
            onClick={closeAccountDetail}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/15 transition z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm whitespace-nowrap ${acc.game === 'Roblox' ? 'bg-indigo-600' : 'bg-red-600'}`}>
              {acc.game}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${isInStock ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
              {isInStock ? tx('In Stock • Ready to Deliver', 'พร้อมส่ง • รับรหัสทันที') : tx('Sold Out', 'ขายแล้ว')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setZoomImage((p) => !p)}
            className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold border border-white/15 inline-flex items-center gap-1.5 backdrop-blur-xs transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{zoomImage ? tx('Fit to Frame', 'ย่อขนาดภาพ') : tx('Expand Full Image', 'ขยายดูภาพเต็ม')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Title & Net Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tx('Verified Game Account Specification', 'รายละเอียดข้อมูลไอดีเกมคัดเกรด')}</span>
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">{acc.title}</h2>
            </div>
            <div className="bg-indigo-50/80 border border-indigo-100 px-4 py-2 rounded-xl shrink-0 self-start sm:self-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">{tx('Net Price', 'ราคาสุทธิ')}</span>
              <span className="text-xl font-black text-indigo-600 whitespace-nowrap">฿{acc.price.toLocaleString()}.00</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{tx('Account Overview', 'รายละเอียดไอดีเกม')}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {acc.description ||
                tx(
                  'Hand-verified gaming account with full credentials. Username and password are automatically revealed immediately after PromptPay QR verification.',
                  'ไอดีเกมตรวจสอบแล้ว ระบบแสดง Username และ Password ทันทีหลังสแกนชำระเงินผ่าน PromptPay QR'
                )}
            </p>
          </div>

          {/* 2x2 Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Award className="w-4 h-4" /></div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">{tx('Level / Rank Tier', 'เลเวล / ระดับแรงค์')}</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{acc.levelOrRank || (acc.game === 'Roblox' ? 'Max Level 2550' : 'Conqueror / Supreme Rank')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Layers className="w-4 h-4" /></div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {acc.game === 'Roblox' ? tx('Devil Fruits / Gamepasses', 'ผลปีศาจ / เกมพาส') : tx('Unlocked Heroes & Stats', 'ฮีโร่ที่ปลดล็อกแล้ว')}
                </span>
                <span className="font-bold text-slate-900 mt-0.5 block">{acc.heroesOrFruitsCount || acc.tags.slice(0, 2).join(' + ')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Swords className="w-4 h-4" /></div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {acc.game === 'Roblox' ? tx('Fighting Style & Weapons', 'หมัดและอาวุธแรร์') : tx('Rare Skins Collection', 'สกินแรร์ในไอดี')}
                </span>
                <span className="font-bold text-slate-900 mt-0.5 block">{acc.skinsOrWeaponsCount || acc.tags.join(', ')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0"><Globe2 className="w-4 h-4" /></div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">{tx('Security & Binding Status', 'สถานะการผูกบัญชี')}</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">{acc.emailStatus || tx('100% Verified Safe ID', 'ไอดีปลอดภัย ตรวจสอบแล้ว')}</span>
              </div>
            </div>
          </div>

          {/* Highlight Tags */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">{tx('Included Highlights', 'จุดเด่นในไอดีนี้')}</span>
            <div className="flex flex-wrap gap-2">
              {acc.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">✓ {t}</span>
              ))}
            </div>
          </div>

          {/* Warranty Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5 text-xs text-emerald-900">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{tx('NEXUS PLAY 100% Buyer Protection Guarantee', 'การรับประกันความปลอดภัยโดย NEXUS PLAY 100%')}</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-emerald-700 pt-0.5">
              <span className="flex items-center gap-1 whitespace-nowrap"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{tx('Instant ID & Password Delivery', 'รับไอดีและรหัสผ่านทันทีหลังโอน')}</span>
              <span className="flex items-center gap-1 whitespace-nowrap"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{tx('Verified Account Screenshot Match', 'ข้อมูลตรงตามภาพสเปค 100%')}</span>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onClick={closeAccountDetail} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition whitespace-nowrap">
              {tx('Close', 'ปิดหน้าต่าง')}
            </button>
            <button
              type="button"
              disabled={!isInStock}
              onClick={() => buyAccount(acc.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isInStock ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>{isInStock ? `${tx('Buy Account Now', 'สั่งซื้อไอดีนี้ทันที')} (฿${acc.price.toLocaleString()})` : tx('Out of Stock', 'สินค้าหมด')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

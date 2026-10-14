'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, Shield, ShieldCheck, ShoppingBag, Sparkles, Zap,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSlideItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
}

const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  { id: '1', title: 'Roblox Blox Fruits Special Deal — Instant Robux & Godhuman IDs', imageUrl: '/pic-banner-slide/roblox.webp', linkUrl: '/topup', sortOrder: 1 },
  { id: '2', title: 'RoV Champion League 2025 Top-Up Bonus (+25% Extra Coupons)', imageUrl: '/pic-banner-slide/rov.jpeg', linkUrl: '/accounts', sortOrder: 2 },
  { id: '3', title: 'Free Fire Instant UID Diamonds — 5-Second Auto Delivery', imageUrl: '/pic-banner-slide/freefire.jpeg', linkUrl: '/topup', sortOrder: 3 },
  { id: '4', title: 'Verified Roblox & RoV Accounts — 100% Clean Handover', imageUrl: '/pic-banner-slide/roblox.jpeg', linkUrl: '/accounts', sortOrder: 4 },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function HomeView() {
  const { switchView, accountProducts, buyAccount, openAccountDetail } = useStore();
  const { tx } = useLanguage();
  const [slides, setSlides] = useState<HeroSlideItem[]>(DEFAULT_HERO_SLIDES);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('nexusplay_banners_sync');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const activeLocal = parsed
            .filter((b) => b.active !== false && b.imageUrl)
            .sort((a, b) => (Number(a.order) || 1) - (Number(b.order) || 1))
            .map((b, i) => ({
              id: String(b.id || i), title: String(b.title || ''), imageUrl: String(b.imageUrl),
              linkUrl: String(b.targetUrl || '/topup'), sortOrder: Number(b.order) || i + 1,
            }));
          if (activeLocal.length > 0) setSlides(activeLocal);
        }
      }
    } catch { /* ignore */ }

    fetch(`${API_BASE}/api/banners`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const list = Array.isArray(data?.banners) ? data.banners : [];
        if (list.length > 0) {
          setSlides(list.map((b: Record<string, unknown>, idx: number) => ({
            id: String(b.id || idx),
            title: String(b.title || ''),
            imageUrl: String(b.imageUrl || DEFAULT_HERO_SLIDES[idx % DEFAULT_HERO_SLIDES.length].imageUrl),
            linkUrl: String(b.linkUrl || '/topup'),
            sortOrder: Number(b.sortOrder) || idx + 1,
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setActiveSlideIdx((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlideIdx] || DEFAULT_HERO_SLIDES[0];

  return (
    <div id="view-home" className="page-view">
      {/* Hero Promotional Carousel with Auto-Sliding pic-banner-slide Backgrounds */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800 text-white min-h-[410px] flex items-center">
          <div className="absolute inset-0 z-0">
            {slides.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.imageUrl}
                alt={slide.title}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
                  index === activeSlideIdx ? 'opacity-80 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 pb-14 sm:pb-14 items-center w-full">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 text-xs font-semibold max-w-full backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span className="truncate">{tx('Automated PromptPay Top-Up & Account Delivery', 'ระบบเติมเกมและส่งมอบไอดีอัตโนมัติผ่าน PromptPay')}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-sm">
                {tx('Supercharge Your Gaming in', 'ยกระดับความมันส์เกมของคุณใน')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 whitespace-nowrap">
                  {tx('Seconds.', 'ไม่กี่วินาที')}
                </span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed drop-shadow-xs">
                {tx(
                  'Instant Robux, RoV Coupons, and Free Fire Diamonds with automated 24/7 delivery. Buy verified ready-to-play Roblox & RoV accounts with IQ-Bank QR verification.',
                  'เติม Robux, คูปอง RoV และเพชร Free Fire เข้าทันทีตลอด 24 ชม. พร้อมเลือกซื้อไอดีเกม Roblox และ RoV คัดเกรด เช็คยอดอัตโนมัติผ่าน IQ-Bank QR'
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button onClick={() => switchView('topup')} className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 whitespace-nowrap shrink-0">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>{tx('Top-Up Games Now', 'เติมเกมด่วนตอนนี้')}</span>
                </button>
                <button onClick={() => switchView('accounts')} className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/25 transition flex items-center space-x-2 whitespace-nowrap shrink-0">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{tx('Browse Accounts', 'เลือกซื้อไอดีเกม')}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs font-medium text-slate-200 border-t border-white/15">
                <div className="flex items-center space-x-1.5 whitespace-nowrap">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{tx('PromptPay 0% Fee', 'พร้อมเพย์ ฟรีค่าธรรมเนียม 0%')}</span>
                </div>
                <div className="flex items-center space-x-1.5 whitespace-nowrap">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{tx('5-Sec Auto Delivery', 'ส่งมอบอัตโนมัติใน 5 วินาที')}</span>
                </div>
                <div className="flex items-center space-x-1.5 whitespace-nowrap">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{tx('100% Anti-Hack Guarantee', 'รับประกันไอดีสะอาด 100%')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 inset-x-6 z-20 flex items-center justify-between gap-4">
            <span className="text-[11px] font-medium text-slate-300/90 truncate hidden sm:inline">{currentSlide.title}</span>
            <div className="flex items-center gap-2 ml-auto">
              <button type="button" onClick={() => setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)} className="w-6 h-6 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-white/15 flex items-center justify-center transition" aria-label="Previous slide">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5">
                {slides.map((slide, idx) => (
                  <button key={slide.id} type="button" onClick={() => setActiveSlideIdx(idx)} aria-label={`Slide ${idx + 1}`} className={`h-2 rounded-full transition-all ${idx === activeSlideIdx ? 'w-6 bg-indigo-400' : 'w-2 bg-white/40 hover:bg-white/70'}`} />
                ))}
              </div>
              <button type="button" onClick={() => setActiveSlideIdx((prev) => (prev + 1) % slides.length)} className="w-6 h-6 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-white/15 flex items-center justify-center transition" aria-label="Next slide">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Service Jump Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div onClick={() => switchView('accounts')} className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex items-start space-x-4 sm:space-x-5">
            {/* 3 Stacked Playing-Card Top Account Previews */}
            <div className="relative w-20 h-16 flex items-center justify-center shrink-0 select-none pt-1">
              <div className="absolute w-12 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-900 -rotate-12 -translate-x-3.5 translate-y-1 group-hover:-rotate-16 group-hover:-translate-x-4.5 transition-all duration-300 ease-out hover:!-translate-y-2.5 hover:!rotate-0 hover:!scale-115 hover:!z-30 hover:ring-2 hover:ring-indigo-400 z-10">
                <img src={accountProducts[0]?.image || '/game-account_sale/roblox01.png'} alt="Top Account 1" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-12 h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-slate-900 rotate-0 -translate-y-0.5 group-hover:-translate-y-2.5 group-hover:scale-110 group-hover:ring-2 group-hover:ring-indigo-500 transition-all duration-300 ease-out hover:!-translate-y-3 hover:!scale-115 hover:!z-30 z-20">
                <img src={accountProducts[1]?.image || '/game-account_sale/rov1.png'} alt="Top Account 2" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-12 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-900 rotate-12 translate-x-3.5 translate-y-1 group-hover:rotate-16 group-hover:translate-x-4.5 transition-all duration-300 ease-out hover:!-translate-y-2.5 hover:!rotate-0 hover:!scale-115 hover:!z-30 hover:ring-2 hover:ring-sky-400 z-10">
                <img src={accountProducts[2]?.image || '/game-account_sale/roblox02.png'} alt="Top Account 3" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">{tx('Buy Ready-to-Play Game Accounts', 'เลือกซื้อไอดีเกมพร้อมเล่นทันที')}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 whitespace-nowrap shrink-0">{tx('Clean ID', 'ไอดีสะอาด')}</span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">{tx('Verified Roblox Blox Fruits Godhuman / Perm Fruits & High Rank RoV Accounts with 100+ skins. Auto credential reveal right after QR scan.', 'ไอดี Roblox Blox Fruits หมัด Godhuman / ผลถาวร และไอดี RoV แรงค์สูง สกินแรร์กว่า 100+ สกิน รับรหัสผ่านอัตโนมัติทันทีหลังสแกน QR')}</p>
              <div className="mt-3 flex items-center text-xs font-bold text-indigo-600 space-x-1 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                <span>{tx('Browse Roblox & RoV Stock', 'ดูสต็อกไอดี Roblox และ RoV')}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </div>
            </div>
          </div>

          <div onClick={() => switchView('topup')} className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex items-start space-x-4 sm:space-x-5">
            {/* 3 Stacked Playing-Card Game Logos (RoV, Roblox, Free Fire) */}
            <div className="relative w-20 h-16 flex items-center justify-center shrink-0 select-none pt-1">
              {/* Left Card: RoV */}
              <div className="absolute w-12 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-900 -rotate-12 -translate-x-3.5 translate-y-1 group-hover:-rotate-16 group-hover:-translate-x-4.5 transition-all duration-300 ease-out hover:!-translate-y-2.5 hover:!rotate-0 hover:!scale-115 hover:!z-30 hover:ring-2 hover:ring-red-400 z-10">
                <img src="/game-logos/rov/rov-icon.png" alt="RoV" className="w-full h-full object-cover" />
              </div>
              {/* Center Card (Pops up on card hover): Roblox */}
              <div className="absolute w-12 h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-slate-900 rotate-0 -translate-y-0.5 group-hover:-translate-y-2.5 group-hover:scale-110 group-hover:ring-2 group-hover:ring-emerald-400 transition-all duration-300 ease-out hover:!-translate-y-3 hover:!scale-115 hover:!z-30 z-20">
                <img src="/game-logos/roblox/roblox-icon.png" alt="Roblox" className="w-full h-full object-cover" />
              </div>
              {/* Right Card: Free Fire */}
              <div className="absolute w-12 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-900 rotate-12 translate-x-3.5 translate-y-1 group-hover:rotate-16 group-hover:translate-x-4.5 transition-all duration-300 ease-out hover:!-translate-y-2.5 hover:!rotate-0 hover:!scale-115 hover:!z-30 hover:ring-2 hover:ring-amber-400 z-10">
                <img src="/game-logos/freefire/freefire-icon.png" alt="Free Fire" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">{tx('24/7 Automated Game Top-Up', 'บริการเติมเกมอัตโนมัติ 24 ชม.')}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">{tx('Auto Bot', 'บอทออโต้')}</span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">{tx('RoV Coupons, Free Fire Diamonds via Player UID, and Roblox Robux via fast ID-Pass. Automatically fulfilled by bot in less than 30 seconds.', 'เติมคูปอง RoV, เพชร Free Fire ใช้แค่ UID และเติม Robux ระบบ ID-Pass ด่วนพิเศษ บอททำรายการเข้าเกมอัตโนมัติภายใน 30 วินาที')}</p>
              <div className="mt-3 flex items-center text-xs font-bold text-emerald-600 space-x-1 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                <span>{tx('Top-up RoV, Free Fire, Robux', 'เติมเกม RoV, Free Fire, Robux')}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Accounts Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">{tx('Featured Game Accounts', 'ไอดีเกมแนะนำยอดนิยม')}</h2>
            <p className="text-xs text-slate-500">{tx('Click any account card to inspect full specs, or buy with instant password delivery', 'คลิกที่การ์ดเพื่อดูสเปคไอดีแบบละเอียด หรือกดซื้อเพื่อรับรหัสผ่านทันที')}</p>
          </div>
          <button onClick={() => switchView('accounts')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 whitespace-nowrap shrink-0">
            <span>{tx('View All Stock', 'ดูไอดีทั้งหมด')}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="home-account-preview-grid">
          {accountProducts.slice(0, 4).map((acc) => (
            <div key={acc.id} onClick={() => openAccountDetail(acc)} className="cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 transition group flex flex-col justify-between">
              <div className="relative h-36 bg-slate-900 overflow-hidden">
                <img src={acc.image} alt={acc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap ${acc.game === 'Roblox' ? 'bg-indigo-600' : 'bg-red-600'}`}>{acc.game}</span>
                <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-0.5 rounded shadow text-xs font-black text-slate-900 whitespace-nowrap">฿{acc.price}</div>
              </div>
              <div className="p-3.5">
                <h4 className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition">{acc.title}</h4>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-indigo-600 font-bold inline-flex items-center gap-1 whitespace-nowrap">
                    <Eye className="w-3 h-3 shrink-0" />
                    {tx('Details', 'ดูสเปค')}
                  </span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); buyAccount(acc.id); }} className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 shadow-xs">
                    {tx('Buy', 'ซื้อ')} ฿{acc.price}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

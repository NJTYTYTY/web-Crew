'use client';

import React from 'react';
import {
  ArrowRight, CheckCircle2, ChevronRight, Clock, Shield, ShieldCheck, ShoppingBag, Sparkles, Zap,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function HomeView() {
  const { switchView, accountProducts, buyAccount } = useStore();
  const { tx } = useLanguage();

  return (
    <div id="view-home" className="page-view">
      {/* Hero Promotional Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 text-white min-h-[380px] flex items-center">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-indigo-500 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500 blur-3xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center w-full">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{tx('Automated PromptPay Top-Up & Account Delivery', 'ระบบเติมเกมและส่งมอบไอดีอัตโนมัติผ่าน PromptPay')}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {tx('Supercharge Your Gaming in', 'ยกระดับความมันส์เกมของคุณใน')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 whitespace-nowrap">
                  {tx('Seconds.', 'ไม่กี่วินาที')}
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                {tx(
                  'Instant Robux, RoV Coupons, and Free Fire Diamonds with automated 24/7 delivery. Buy verified ready-to-play Roblox & RoV accounts with instant PromptPay QR verification.',
                  'เติม Robux, คูปอง RoV และเพชร Free Fire เข้าทันทีตลอด 24 ชม. พร้อมเลือกซื้อไอดีเกม Roblox และ RoV คัดเกรด เช็คยอดอัตโนมัติผ่านพร้อมเพย์ QR'
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => switchView('topup')}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 whitespace-nowrap shrink-0"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>{tx('Top-Up Games Now', 'เติมเกมด่วนตอนนี้')}</span>
                </button>
                <button
                  onClick={() => switchView('accounts')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm backdrop-blur border border-white/20 transition flex items-center space-x-2 whitespace-nowrap shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{tx('Browse Accounts', 'เลือกซื้อไอดีเกม')}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs font-medium text-slate-300 border-t border-slate-800/80">
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

            <div className="lg:col-span-5 hidden lg:flex justify-end">
              <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border border-slate-700/80 shadow-2xl relative">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-ring shrink-0" />
                    <span className="text-xs font-bold text-slate-200 truncate">{tx('LIVE TOP-UP FEED', 'รายการเติมเกมล่าสุด')}</span>
                  </div>
                  <span className="text-[10px] mono bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded font-bold whitespace-nowrap shrink-0">24/7 AUTO</span>
                </div>
                <div className="py-4 space-y-3">
                  <div className="flex justify-between items-center gap-2 bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">RoV</div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{tx('350 Coupons + Bonus', '350 คูปอง + โบนัส')}</div>
                        <div className="text-[11px] text-slate-400 truncate">UID: 981244012</div>
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap shrink-0">
                      <div className="text-xs font-bold text-emerald-400">฿95.00</div>
                      <span className="text-[9px] text-slate-400 font-mono">{tx('Instant', 'เข้าทันที')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2 bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">R$</div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{tx('800 Robux Clean', '800 Robux เรทคุ้ม')}</div>
                        <div className="text-[11px] text-slate-400 truncate">User: BloxMasterX</div>
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap shrink-0">
                      <div className="text-xs font-bold text-emerald-400">฿290.00</div>
                      <span className="text-[9px] text-slate-400 font-mono">{tx('Instant', 'เข้าทันที')}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="whitespace-nowrap">{tx('Transactions Today:', 'รายการสำเร็จวันนี้:')}</span>
                  <span className="font-bold text-white mono whitespace-nowrap">{tx('1,489 completed', '1,489 รายการ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Service Jump Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div onClick={() => switchView('accounts')} className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex items-start space-x-4 sm:space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">{tx('Buy Ready-to-Play Game Accounts', 'เลือกซื้อไอดีเกมพร้อมเล่นทันที')}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 whitespace-nowrap shrink-0">{tx('Clean ID', 'ไอดีสะอาด')}</span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                {tx(
                  'Verified Roblox Blox Fruits Godhuman / Perm Fruits & High Rank RoV Accounts with 100+ skins. Auto credential reveal right after QR scan.',
                  'ไอดี Roblox Blox Fruits หมัด Godhuman / ผลถาวร และไอดี RoV แรงค์สูง สกินแรร์กว่า 100+ สกิน รับรหัสผ่านอัตโนมัติทันทีหลังสแกน QR'
                )}
              </p>
              <div className="mt-3 flex items-center text-xs font-bold text-indigo-600 space-x-1 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                <span>{tx('Browse Roblox & RoV Stock', 'ดูสต็อกไอดี Roblox และ RoV')}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </div>
            </div>
          </div>

          <div onClick={() => switchView('topup')} className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex items-start space-x-4 sm:space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
              <Zap className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">{tx('24/7 Automated Game Top-Up', 'บริการเติมเกมอัตโนมัติ 24 ชม.')}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">{tx('Auto Bot', 'บอทออโต้')}</span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                {tx(
                  'RoV Coupons, Free Fire Diamonds via Player UID, and Roblox Robux via fast ID-Pass. Automatically fulfilled by bot in less than 30 seconds.',
                  'เติมคูปอง RoV, เพชร Free Fire ใช้แค่ UID และเติม Robux ระบบ ID-Pass ด่วนพิเศษ บอททำรายการเข้าเกมอัตโนมัติภายใน 30 วินาที'
                )}
              </p>
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
            <p className="text-xs text-slate-500">{tx('Hand-verified accounts ready with instant password delivery', 'ไอดีคัดพิเศษพร้อมส่งมอบ Username / Password ทันทีหลังชำระเงิน')}</p>
          </div>
          <button onClick={() => switchView('accounts')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 whitespace-nowrap shrink-0">
            <span>{tx('View All Stock', 'ดูไอดีทั้งหมด')}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="home-account-preview-grid">
          {accountProducts.slice(0, 4).map((acc) => (
            <div key={acc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between">
              <div className="relative h-36 bg-slate-900">
                <img src={acc.image} alt={acc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap ${acc.game === 'Roblox' ? 'bg-indigo-600' : 'bg-red-600'}`}>{acc.game}</span>
                <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-0.5 rounded shadow text-xs font-black text-slate-900 whitespace-nowrap">฿{acc.price}</div>
              </div>
              <div className="p-3.5">
                <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{acc.title}</h4>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-emerald-600 font-bold whitespace-nowrap">● {tx('Clean Unlinked', 'สะอาด ไม่ติดเมล')}</span>
                  <button onClick={() => buyAccount(acc.id)} className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0">
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

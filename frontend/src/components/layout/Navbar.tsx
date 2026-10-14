'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Globe, Landmark, Menu, ShieldCheck, User, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function Navbar() {
  const { currentView, switchView, user } = useStore();
  const { lang, toggleLang, tx } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'accounts' | 'topup' | 'orders' | 'simulator' | 'auth') => {
    switchView(view);
    setMobileMenuOpen(false);
  };

  const navBtnClass = (active: boolean) =>
    `whitespace-nowrap shrink-0 px-3 py-2 rounded-lg text-sm font-semibold transition inline-flex items-center gap-1.5 ${
      active
        ? 'text-indigo-600 bg-indigo-50/80'
        : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 flex-nowrap">
        {/* Left: Logo + Main Navigation */}
        <div className="flex items-center gap-4 xl:gap-7 min-w-0 flex-nowrap">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 group text-left shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="whitespace-nowrap">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center">
                NEXUS<span className="text-indigo-600">PLAY</span>
              </span>
              <span className="text-[10px] block font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                {tx('THAI GAMING HUB', 'ศูนย์รวมเกมเมอร์ไทย')}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Strictly Single-Line Inline) */}
          <nav className="hidden lg:flex items-center gap-1 flex-nowrap">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={navBtnClass(currentView === 'home')}
            >
              <span>{tx('Home', 'หน้าแรก')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('accounts')}
              className={navBtnClass(currentView === 'accounts')}
            >
              <span>{tx('Account Marketplace', 'ตลาดซื้อขายไอดีเกม')}</span>
              <span className="whitespace-nowrap shrink-0 bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                {tx('HOT', 'ฮิต')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('topup')}
              className={navBtnClass(currentView === 'topup')}
            >
              <span>{tx('24/7 Top-Up', 'เติมเกม 24 ชม.')}</span>
              <span className="whitespace-nowrap shrink-0 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                {tx('Instant', 'เข้าไว')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('orders')}
              className={navBtnClass(currentView === 'orders')}
            >
              <span>{tx('Order History', 'ประวัติการสั่งซื้อ')}</span>
            </button>
          </nav>
        </div>

        {/* Right Header Actions (Strictly Single-Line Inline) */}
        <div className="flex items-center gap-2 shrink-0 flex-nowrap">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLang}
            className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 rounded-lg border border-slate-200/80 text-xs font-bold text-slate-700 transition"
            title={tx('Switch to Thai language', 'สลับเป็นภาษาอังกฤษ')}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{lang === 'en' ? 'EN | ไทย' : 'ไทย | EN'}</span>
          </button>

          {/* Live Exchange Currency Pill (Visible on XL screens so navbar never crowds) */}
          <div className="hidden xl:inline-flex whitespace-nowrap shrink-0 items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200/80 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{tx('THB (฿) PromptPay', 'บาท (฿) พร้อมเพย์')}</span>
          </div>

          {/* Quick Simulator Launcher */}
          <button
            type="button"
            onClick={() => handleNav('simulator')}
            className="hidden md:inline-flex whitespace-nowrap shrink-0 items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition"
          >
            <Landmark className="w-3.5 h-3.5 shrink-0" />
            <span>{tx('IQ-Bank Simulator', 'จำลองธนาคาร IQ-Bank')}</span>
          </button>

          {/* Auth State Button */}
          <div id="nav-user-area" className="shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => handleNav('orders')}
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl cursor-pointer transition"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                  {user.username}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchView('auth', 'login')}
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition shadow-indigo-600/20"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>{tx('Sign In', 'เข้าสู่ระบบ')}</span>
              </button>
            )}
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-between"
          >
            <span>{tx('Home', 'หน้าแรก')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('accounts')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-between"
          >
            <span>{tx('Account Marketplace', 'ตลาดซื้อขายไอดีเกม')}</span>
            <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
              {tx('HOT', 'ฮิต')}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('topup')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-between"
          >
            <span>{tx('24/7 Top-Up', 'เติมเกม 24 ชม.')}</span>
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
              {tx('Instant', 'เข้าไว')}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('orders')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-between"
          >
            <span>{tx('Order History', 'ประวัติการสั่งซื้อ')}</span>
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleNav('simulator')}
              className="flex-1 whitespace-nowrap inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold"
            >
              <Landmark className="w-3.5 h-3.5 shrink-0" />
              <span>{tx('IQ-Bank Simulator', 'จำลองธนาคาร IQ-Bank')}</span>
            </button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 whitespace-nowrap inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
              <span>{tx('Admin Console', 'ระบบหลังบ้าน')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

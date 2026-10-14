'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Globe, LogOut, Menu, ShieldCheck, User, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function Navbar() {
  const { currentView, switchView, user, logout } = useStore();
  const { lang, toggleLang, tx } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'accounts' | 'topup' | 'orders' | 'auth') => {
    switchView(view);
    setMobileMenuOpen(false);
  };

  const navBtnClass = (active: boolean) =>
    `whitespace-nowrap shrink-0 px-3 py-2 rounded-lg text-sm font-semibold transition inline-flex items-center gap-1.5 ${
      active
        ? 'text-indigo-600 bg-indigo-50/90'
        : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo (Clicks to Home) + Main Navigation */}
        <div className="flex items-center gap-4 xl:gap-8 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 group text-left shrink-0"
            title={tx('Go to Home', 'กลับหน้าแรก')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <img src="/logopic.webp" alt="NEXUS PLAY Logo" className="w-full h-full object-cover" />
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleNav('accounts')}
              className={navBtnClass(currentView === 'accounts')}
            >
              <span>{tx('Account Marketplace', 'ตลาดซื้อขายไอดีเกม')}</span>
              <span className="whitespace-nowrap shrink-0 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-100">
                {tx('HOT', 'ฮิต')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('topup')}
              className={navBtnClass(currentView === 'topup')}
            >
              <span>{tx('24/7 Top-Up', 'เติมเกม 24 ชม.')}</span>
              <span className="whitespace-nowrap shrink-0 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100">
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

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLang}
            className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 rounded-lg border border-slate-200/80 text-xs font-bold text-slate-700 transition"
            title={tx('Switch to Thai language', 'สลับเป็นภาษาอังกฤษ')}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{lang === 'en' ? 'EN | ไทย' : 'ไทย | EN'}</span>
          </button>

          {/* Auth State Button */}
          <div id="nav-user-area" className="shrink-0">
            {user ? (
              <div className="inline-flex items-center gap-1.5">
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
                <button
                  type="button"
                  onClick={logout}
                  title={tx('Sign Out', 'ออกจากระบบ')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200/80 transition shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
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
          <div className="pt-2 border-t border-slate-100 flex items-center">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full whitespace-nowrap inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
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

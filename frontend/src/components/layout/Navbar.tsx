'use client';

import React from 'react';
import { Gamepad2, Globe, Landmark, User } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function Navbar() {
  const { switchView, user } = useStore();
  const { lang, toggleLang, tx } = useLanguage();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <button
            type="button"
            onClick={() => switchView('home')}
            className="flex items-center space-x-2.5 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center">
                NEXUS<span className="text-indigo-600">PLAY</span>
              </span>
              <span className="text-[10px] block font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                {tx('THAI GAMING HUB', 'ศูนย์รวมเกมเมอร์ไทย')}
              </span>
            </div>
          </button>

          {/* Main Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-semibold">
            <button
              onClick={() => switchView('home')}
              className="nav-link px-3 py-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
            >
              {tx('Home', 'หน้าแรก')}
            </button>
            <button
              onClick={() => switchView('accounts')}
              className="nav-link px-3 py-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition flex items-center space-x-1.5"
            >
              <span>{tx('Account Marketplace', 'ตลาดซื้อขายไอดีเกม')}</span>
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-100">
                {tx('HOT', 'ฮิต')}
              </span>
            </button>
            <button
              onClick={() => switchView('topup')}
              className="nav-link px-3 py-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition flex items-center space-x-1.5"
            >
              <span>{tx('24/7 Top-Up', 'เติมเกม 24 ชม.')}</span>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100">
                {tx('Instant', 'เข้าไว')}
              </span>
            </button>
            <button
              onClick={() => switchView('orders')}
              className="nav-link px-3 py-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
            >
              {tx('Order History', 'ประวัติการสั่งซื้อ')}
            </button>
          </nav>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 rounded-lg border border-slate-200/80 text-xs font-bold text-slate-700 transition"
            title={tx('Switch to Thai language', 'สลับเป็นภาษาอังกฤษ')}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'en' ? 'EN | ไทย' : 'ไทย | EN'}</span>
          </button>

          {/* Live Exchange Currency Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200/80 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{tx('THB (฿) PromptPay', 'บาท (฿) พร้อมเพย์')}</span>
          </div>

          {/* Quick Simulator Launcher */}
          <button
            onClick={() => switchView('simulator')}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{tx('IQ-Bank Simulator', 'จำลองธนาคาร IQ-Bank')}</span>
          </button>

          {/* Auth State Button (Toggleable) */}
          <div id="nav-user-area">
            {user ? (
              <div
                onClick={() => switchView('orders')}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-800">{user.username}</span>
              </div>
            ) : (
              <button
                onClick={() => switchView('auth', 'login')}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition shadow-indigo-600/20"
              >
                <User className="w-4 h-4" />
                <span>{tx('Sign In', 'เข้าสู่ระบบ')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

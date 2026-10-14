'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Home, Landmark, QrCode, Receipt, ShieldAlert, ShoppingBag, User, Zap } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { StoreViewName } from '@/types/store';

export function PrototypeSwitcherBar() {
  const { currentView, switchView, openModal } = useStore();
  const { lang, toggleLang, tx } = useLanguage();

  const navBtnClass = (view: StoreViewName) =>
    `view-btn px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1 ${
      currentView === view
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
    }`;

  return (
    <aside
      aria-label="Prototype View Switcher"
      className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2 border-b border-slate-800 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {tx('PROTOTYPE CONTROLLER', 'แถบควบคุมระบบจำลอง')}
          </span>
          <span className="text-slate-400 hidden sm:inline">{tx('Switch Active View:', 'สลับหน้าแสดงผล:')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
          <button onClick={() => switchView('home')} id="tab-home" className={navBtnClass('home')}>
            <Home className="w-3.5 h-3.5" />
            <span>{tx('Home', 'หน้าแรก')}</span>
          </button>
          <button onClick={() => switchView('accounts')} id="tab-accounts" className={navBtnClass('accounts')}>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{tx('Account Shop', 'ร้านค้าไอดีเกม')}</span>
          </button>
          <button onClick={() => switchView('topup')} id="tab-topup" className={navBtnClass('topup')}>
            <Zap className="w-3.5 h-3.5" />
            <span>{tx('Game Top-Up', 'เติมเกม 24 ชม.')}</span>
          </button>
          <button onClick={() => switchView('orders')} id="tab-orders" className={navBtnClass('orders')}>
            <Receipt className="w-3.5 h-3.5" />
            <span>{tx('My Orders', 'ประวัติคำสั่งซื้อ')}</span>
          </button>
          <button onClick={() => switchView('auth')} id="tab-auth" className={navBtnClass('auth')}>
            <User className="w-3.5 h-3.5" />
            <span>{tx('Login / Register', 'เข้าสู่ระบบ / สมัคร')}</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <button
            onClick={() => switchView('simulator')}
            id="tab-simulator"
            className={`view-btn px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1 ${
              currentView === 'simulator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tx('IQ-Bank Webhook Simulator', 'จำลองธนาคาร IQ-Bank')}</span>
          </button>

          <button
            onClick={() => openModal('waiting')}
            className="px-2.5 py-1 rounded-md font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 flex items-center space-x-1"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{tx('Open QR Modal', 'เปิดป๊อปอัป QR')}</span>
          </button>

          <Link
            href="/admin"
            className="px-2.5 py-1 rounded-md font-medium bg-slate-800 text-indigo-300 border border-indigo-500/30 hover:bg-slate-700 hover:text-white flex items-center space-x-1"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>{tx('Admin Backoffice', 'ระบบหลังบ้าน Admin')}</span>
          </Link>

          <button
            type="button"
            onClick={toggleLang}
            className="px-2.5 py-1 rounded-md font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 hover:bg-indigo-500/30 flex items-center space-x-1"
            title="Switch Language (EN / ไทย)"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-300" />
            <span>{lang === 'en' ? 'EN | ไทย' : 'ไทย | EN'}</span>
          </button>
        </div>

        <div className="hidden xl:flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
          <span>{tx('IQ-Bank API: Online', 'IQ-Bank API: ออนไลน์')}</span>
        </div>
      </div>
    </aside>
  );
}

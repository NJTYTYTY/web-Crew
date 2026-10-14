'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { switchView } = useStore();
  const { tx } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            N
          </div>
          <span className="font-bold text-slate-900 whitespace-nowrap">NEXUS PLAY STORE THAILAND</span>
          <span className="text-slate-400">
            • {tx('Automated PromptPay & IQ-Bank Certified Gateway', 'ระบบชำระเงินพร้อมเพย์อัตโนมัติเชื่อมต่อ IQ-Bank')}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <span className="whitespace-nowrap">{tx('Fast Delivery (24/7)', 'จัดส่งอัตโนมัติ (24 ชม.)')}</span>
          <span className="whitespace-nowrap">{tx('Thai Baht (฿ THB)', 'สกุลเงินบาท (฿ THB)')}</span>
          <button
            type="button"
            onClick={() => switchView('simulator')}
            className="text-indigo-600 hover:underline font-bold whitespace-nowrap"
          >
            {tx('IQ-Bank Simulator', 'ระบบจำลองธนาคาร')}
          </button>
          <Link
            href="/admin"
            className="text-slate-600 hover:text-indigo-600 hover:underline font-semibold whitespace-nowrap"
          >
            {tx('Admin Backoffice', 'ระบบหลังบ้าน Admin')}
          </Link>
        </div>
      </div>
    </footer>
  );
}

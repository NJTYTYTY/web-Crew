'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { switchView } = useStore();
  const { tx } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            N
          </div>
          <span className="font-bold text-slate-900">NEXUS PLAY STORE THAILAND</span>
          <span className="text-slate-400">
            • {tx('Automated PromptPay & IQ-Bank Certified Gateway', 'ระบบชำระเงินพร้อมเพย์อัตโนมัติเชื่อมต่อ IQ-Bank')}
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <span>{tx('Fast Delivery (24/7)', 'จัดส่งอัตโนมัติ (24 ชม.)')}</span>
          <span>{tx('Thai Baht (฿ THB)', 'สกุลเงินบาท (฿ THB)')}</span>
          <button
            type="button"
            onClick={() => switchView('simulator')}
            className="text-indigo-600 hover:underline font-bold"
          >
            {tx('Simulator', 'ระบบจำลองธนาคาร')}
          </button>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import { PrototypeSwitcherBar } from '@/components/layout/PrototypeSwitcherBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaymentCheckoutModal } from '@/components/modal/PaymentCheckoutModal';

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <PrototypeSwitcherBar />
      <Navbar />
      <main className="flex-1 pb-16">{children}</main>
      <PaymentCheckoutModal />
      <Footer />
    </div>
  );
}

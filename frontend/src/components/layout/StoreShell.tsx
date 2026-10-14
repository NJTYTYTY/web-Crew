'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaymentCheckoutModal } from '@/components/modal/PaymentCheckoutModal';
import { AccountDetailModal } from '@/components/modal/AccountDetailModal';
import { AuthRequiredModal } from '@/components/modal/AuthRequiredModal';

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="flex-1 pb-16">{children}</main>
      <AccountDetailModal />
      <AuthRequiredModal />
      <PaymentCheckoutModal />
      <Footer />
    </div>
  );
}

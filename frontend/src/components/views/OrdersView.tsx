'use client';

import React from 'react';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function OrdersView() {
  const { user, customerOrders, revealOrderCredentials, switchView } = useStore();
  const { tx } = useLanguage();
  const displayUsername = user?.username || tx('Guest / Customer', 'ลูกค้าทั่วไป');

  return (
    <div id="view-orders" className="page-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 whitespace-nowrap shrink-0">
                {tx('SECTION 1.3', 'หมวดหมู่ 1.3')}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {tx('Customer Purchase History', 'ประวัติการสั่งซื้อและรับสินค้า')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {tx('Account:', 'บัญชีผู้ใช้งาน:')}{' '}
              <span className="font-bold text-slate-800" id="orders-user-label">
                {displayUsername}
              </span>
              . {tx('Showing real-time orders from PostgreSQL database.', 'แสดงรายการคำสั่งซื้อจริงจากฐานข้อมูลระบบ')}
            </p>
          </div>
        </div>

        {/* Orders Table / Card List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 whitespace-nowrap">{tx('Order ID & Ref', 'รหัสคำสั่งซื้อ & อ้างอิง')}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{tx('Item Details', 'รายละเอียดสินค้า')}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{tx('Type', 'ประเภท')}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{tx('Date / Time', 'วัน / เวลา')}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{tx('Amount', 'ยอดชำระ')}</th>
                  <th className="py-3 px-4 whitespace-nowrap">{tx('Payment Status', 'สถานะชำระเงิน')}</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">{tx('Fulfillment / Action', 'การส่งมอบ / จัดการ')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" id="orders-table-body">
                {customerOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <ShoppingBag className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-bold text-slate-600">
                          {tx('No purchase history found yet', 'ยังไม่มีประวัติการสั่งซื้อในระบบ')}
                        </p>
                        <p className="text-xs text-slate-400">
                          {tx(
                            'Orders you complete will automatically appear here from the database.',
                            'เมื่อคุณสั่งซื้อไอดีเกมหรือเติมเกมสำเร็จ รายการจะแสดงที่นี่จากฐานข้อมูลโดยอัตโนมัติ'
                          )}
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => switchView('accounts')}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition whitespace-nowrap"
                          >
                            {tx('Browse Game Accounts', 'เลือกซื้อไอดีเกม')}
                          </button>
                          <button
                            type="button"
                            onClick={() => switchView('topup')}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition whitespace-nowrap"
                          >
                            {tx('24/7 Game Top-Up', 'เติมเกม 24 ชม.')}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customerOrders.map((ord) => (
                    <tr key={ord.id + ord.ref} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div>{ord.id}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{ord.ref}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 min-w-[180px]">{ord.title}</td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{ord.type}</td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{ord.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">฿{ord.amount}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                            ord.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          ● {ord.status === 'PAID' ? tx('PAID', 'ชำระแล้ว') : tx('PENDING', 'รอชำระเงิน')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {ord.status === 'PAID' && ord.revealedPass && ord.revealedPass !== 'COMPLETED' && ord.revealedPass !== 'PENDING' ? (
                          <button
                            onClick={() => revealOrderCredentials(ord.revealedUser, ord.revealedPass, ord.title)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] border border-indigo-200 whitespace-nowrap"
                          >
                            {tx('View Account ID / Pass', 'ดูรหัสไอดีเกม / พาสเวิร์ด')}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                            {ord.status === 'PAID'
                              ? tx('Delivered to Account', 'เติมเข้าบัญชีเกมสำเร็จ')
                              : tx('Waiting for Payment', 'รอการชำระเงิน')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

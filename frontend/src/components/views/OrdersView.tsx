'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function OrdersView() {
  const { user, customerOrders, seedNewDemoOrder, revealOrderCredentials } = useStore();
  const { tx } = useLanguage();
  const displayUsername = user?.username || 'alex_gamer';

  return (
    <div id="view-orders" className="page-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                {tx('SECTION 1.3', 'หมวดหมู่ 1.3')}
              </span>
              <h1 className="text-2xl font-black text-slate-900">
                {tx('Customer Purchase History', 'ประวัติการสั่งซื้อและรับสินค้า')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {tx('Logged-in as', 'เข้าสู่ระบบในชื่อ')}{' '}
              <span className="font-bold text-slate-800" id="orders-user-label">
                {displayUsername}
              </span>
              . {tx('View order receipts and reveal purchased game account credentials.', 'ตรวจสอบใบเสร็จคำสั่งซื้อและเปิดดูรหัสผ่านไอดีเกมที่สั่งซื้อสำเร็จ')}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={seedNewDemoOrder}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{tx('Simulate New Completed Order', 'จำลองคำสั่งซื้อสำเร็จใหม่')}</span>
            </button>
          </div>
        </div>

        {/* Orders Table / Card List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">{tx('Order ID & Ref', 'รหัสคำสั่งซื้อ & อ้างอิง')}</th>
                  <th className="py-3 px-4">{tx('Item Details', 'รายละเอียดสินค้า')}</th>
                  <th className="py-3 px-4">{tx('Type', 'ประเภท')}</th>
                  <th className="py-3 px-4">{tx('Date / Time', 'วัน / เวลา')}</th>
                  <th className="py-3 px-4">{tx('Amount', 'ยอดชำระ')}</th>
                  <th className="py-3 px-4">{tx('Payment Status', 'สถานะชำระเงิน')}</th>
                  <th className="py-3 px-4 text-right">{tx('Fulfillment / Action', 'การส่งมอบ / จัดการ')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" id="orders-table-body">
                {customerOrders.map((ord) => (
                  <tr key={ord.id + ord.ref} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div>{ord.id}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{ord.ref}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{ord.title}</td>
                    <td className="py-3 px-4 text-slate-500">{ord.type}</td>
                    <td className="py-3 px-4 text-slate-400">{ord.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">฿{ord.amount}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ● {ord.status === 'PAID' ? tx('PAID', 'ชำระแล้ว') : ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {ord.revealedPass !== 'COMPLETED' ? (
                        <button
                          onClick={() => revealOrderCredentials(ord.revealedUser, ord.revealedPass, ord.title)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] border border-indigo-200"
                        >
                          {tx('View Account ID / Pass', 'ดูรหัสไอดีเกม / พาสเวิร์ด')}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {tx('Delivered to Account', 'เติมเข้าบัญชีเกมสำเร็จ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

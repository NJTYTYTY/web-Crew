'use client';

import React, { useMemo, useState } from 'react';
import { Eye, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export function AccountMarketplaceView() {
  const { accountProducts, buyAccount, openAccountDetail } = useStore();
  const { tx } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const availableCategories = useMemo(() => {
    const list = ['all'];
    const seen = new Set<string>();
    accountProducts.forEach((a) => {
      const cat = a.game?.trim();
      if (cat && !seen.has(cat.toLowerCase())) {
        seen.add(cat.toLowerCase());
        list.push(cat);
      }
    });
    if (!seen.has('roblox')) list.push('Roblox');
    if (!seen.has('rov')) list.push('RoV');
    return list;
  }, [accountProducts]);

  const filteredAndSorted = useMemo(() => {
    let base =
      categoryFilter === 'all'
        ? [...accountProducts]
        : accountProducts.filter((a) => a.game.toLowerCase() === categoryFilter.toLowerCase());

    if (availabilityFilter === 'available') base = base.filter((a) => a.stock === 'in_stock');
    if (availabilityFilter === 'sold') base = base.filter((a) => a.stock === 'sold_out');

    if (sortOption === 'price-asc') base.sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') base.sort((a, b) => b.price - a.price);
    return base;
  }, [accountProducts, categoryFilter, availabilityFilter, sortOption]);

  const filterBtnClass = (cat: string) =>
    `acc-filter px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
      categoryFilter.toLowerCase() === cat.toLowerCase() ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
    }`;

  const availBtnClass = (avail: 'all' | 'available' | 'sold') =>
    `px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
      availabilityFilter === avail ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <div id="view-accounts" className="page-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header & Search */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {tx('Game Account Marketplace', 'ตลาดซื้อขายไอดีเกมพร้อมเล่น')}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {tx(
                  'Click any account card to inspect full specs, level, and warranty. Instant credential reveal upon PromptPay scan.',
                  'คลิกที่การ์ดไอดีเกมเพื่อดูรายละเอียด เลเวล สกิน และข้อมูลรับประกัน รับรหัสผ่านทันทีหลังสแกนจ่ายผ่าน PromptPay'
                )}
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-bold overflow-x-auto hide-scrollbar max-w-full">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    id={`filter-${cat.toLowerCase()}`}
                    className={filterBtnClass(cat)}
                  >
                    {cat === 'all'
                      ? tx('All Games', 'ทุกเกม')
                      : cat.toLowerCase() === 'rov'
                      ? 'RoV (Arena of Valor)'
                      : cat}
                  </button>
                ))}
              </div>

              {/* Availability Filter */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-bold overflow-x-auto hide-scrollbar max-w-full">
                <button onClick={() => setAvailabilityFilter('all')} className={availBtnClass('all')}>
                  {tx('All Stock', 'ทั้งหมด')}
                </button>
                <button onClick={() => setAvailabilityFilter('available')} className={availBtnClass('available')}>
                  {tx('In Stock', 'พร้อมส่ง')}
                </button>
                <button onClick={() => setAvailabilityFilter('sold')} className={availBtnClass('sold')}>
                  {tx('Sold Out', 'ขายแล้ว')}
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                id="acc-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 whitespace-nowrap shrink-0"
              >
                <option value="featured">{tx('Sort: Featured First', 'เรียงตาม: แนะนำพิเศษ')}</option>
                <option value="price-asc">{tx('Price: Low to High', 'ราคา: ต่ำ ไป สูง')}</option>
                <option value="price-desc">{tx('Price: High to Low', 'ราคา: สูง ไป ต่ำ')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Cards Grid or Empty State */}
        {filteredAndSorted.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">{tx('No Game Accounts Found', 'ไม่พบไอดีเกมที่ตรงกับเงื่อนไข')}</h3>
            <p className="text-xs text-slate-500 mt-1">{tx('Try resetting your filters or check back later.', 'ลองเปลี่ยนตัวกรอง หรือกลับมาตรวจสอบใหม่อีกครั้ง')}</p>
            <button
              onClick={() => { setCategoryFilter('all'); setAvailabilityFilter('all'); }}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {tx('Reset Filters', 'รีเซ็ตตัวกรอง')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="account-marketplace-grid">
          {filteredAndSorted.map((acc) => {
            const isInStock = acc.stock === 'in_stock';
            return (
              <div
                key={acc.id}
                onClick={() => openAccountDetail(acc)}
                className="cursor-pointer bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col group"
              >
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={acc.image}
                    alt={acc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm whitespace-nowrap ${
                      acc.game === 'Roblox' ? 'bg-indigo-600' : 'bg-red-600'
                    }`}
                  >
                    {acc.game}
                  </span>

                  <span
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      isInStock ? 'bg-emerald-500/90 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isInStock ? tx('In Stock', 'พร้อมส่ง') : tx('Sold Out', 'ขายแล้ว')}
                  </span>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900">฿{acc.price}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition">
                      {acc.title}
                    </h3>

                    {acc.levelOrRank && (
                      <p className="text-[11px] font-semibold text-indigo-600 mt-1 truncate">
                        {acc.levelOrRank}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {acc.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 whitespace-nowrap"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 whitespace-nowrap">
                      <Eye className="w-3.5 h-3.5 shrink-0" />
                      <span>{tx('View Details', 'ดูรายละเอียด')}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        buyAccount(acc.id);
                      }}
                      disabled={!isInStock}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
                        isInStock
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                      <span>{isInStock ? tx('Buy Account', 'ซื้อไอดีนี้') : tx('Out of Stock', 'สินค้าหมด')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import { Eye, Search, ShoppingBag, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

function getGameBadgeColor(game: string): string {
  const lower = (game || '').toLowerCase().trim();
  if (lower === 'roblox') return 'bg-indigo-600';
  if (lower === 'rov' || lower.includes('arena of valor')) return 'bg-rose-600';
  if (lower.includes('free fire') || lower.includes('freefire')) return 'bg-amber-600';
  if (lower.includes('valorant')) return 'bg-red-500';
  if (lower.includes('genshin')) return 'bg-teal-600';
  if (lower.includes('minecraft')) return 'bg-emerald-600';
  if (lower.includes('pubg')) return 'bg-yellow-600';
  return 'bg-purple-600';
}

export function AccountMarketplaceView() {
  const { accountProducts, buyAccount, openAccountDetail } = useStore();
  const { tx } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: accountProducts.length };
    accountProducts.forEach((acc) => {
      const cat = acc.game?.trim().toLowerCase() || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [accountProducts]);

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
    let base = [...accountProducts];

    if (categoryFilter !== 'all') {
      base = base.filter((a) => a.game.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (availabilityFilter === 'available') base = base.filter((a) => a.stock === 'in_stock');
    if (availabilityFilter === 'sold') base = base.filter((a) => a.stock === 'sold_out');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      base = base.filter((a) => {
        const titleMatch = a.title.toLowerCase().includes(q);
        const gameMatch = a.game.toLowerCase().includes(q);
        const descMatch = (a.description || '').toLowerCase().includes(q);
        const levelMatch = (a.levelOrRank || '').toLowerCase().includes(q);
        const tagMatch = a.tags.some((t) => t.toLowerCase().includes(q));
        return titleMatch || gameMatch || descMatch || levelMatch || tagMatch;
      });
    }

    if (sortOption === 'price-asc') base.sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') base.sort((a, b) => b.price - a.price);
    return base;
  }, [accountProducts, categoryFilter, availabilityFilter, searchQuery, sortOption]);

  const filterBtnClass = (cat: string) => {
    const isActive = categoryFilter.toLowerCase() === cat.toLowerCase();
    return `acc-filter px-3 py-1.5 rounded-xl transition text-xs font-bold whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-xs'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
    }`;
  };

  const availBtnClass = (avail: 'all' | 'available' | 'sold') => {
    const isActive = availabilityFilter === avail;
    return `px-3 py-1.5 rounded-lg transition text-xs font-bold whitespace-nowrap shrink-0 ${
      isActive ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
    }`;
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setAvailabilityFilter('all');
  };

  const inStockCount = accountProducts.filter((a) => a.stock === 'in_stock').length;

  return (
    <div id="view-accounts" className="page-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header & Filter Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {tx('Game Account Marketplace', 'ตลาดซื้อขายไอดีเกมพร้อมเล่น')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {tx(`${inStockCount} In Stock`, `พร้อมส่ง ${inStockCount} รหัส`)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {tx(
                  'Click any account card to inspect full specs, level, and warranty. Instant credential reveal upon PromptPay scan.',
                  'คลิกที่การ์ดไอดีเกมเพื่อดูรายละเอียด เลเวล สกิน และข้อมูลรับประกัน รับรหัสผ่านทันทีหลังสแกนจ่ายผ่าน PromptPay'
                )}
              </p>
            </div>

            {/* Real-time Full-text Search Bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tx('Search accounts, games, heroes, skins...', 'ค้นหาไอดีเกม, ฮีโร่, สกิน, คีย์เวิร์ด...')}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Scalable Game Categories Strip with Item Counts */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {tx('Filter by Game Title', 'เลือกหมวดหมู่เกม')} ({availableCategories.length - 1} {tx('Games', 'เกม')})
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {availableCategories.map((cat) => {
                const countKey = cat === 'all' ? 'all' : cat.toLowerCase();
                const count = categoryCounts[countKey] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    id={`filter-${cat.toLowerCase()}`}
                    className={filterBtnClass(cat)}
                  >
                    <span>
                      {cat === 'all'
                        ? tx('All Games', 'ทุกเกม')
                        : cat.toLowerCase() === 'rov'
                        ? 'RoV'
                        : cat}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        categoryFilter.toLowerCase() === cat.toLowerCase()
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Filters: Stock Availability & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-bold">
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

              <span className="text-xs text-slate-500 font-medium pl-1">
                {tx(`Showing ${filteredAndSorted.length} of ${accountProducts.length} items`, `กำลังแสดง ${filteredAndSorted.length} จาก ${accountProducts.length} รายการ`)}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                id="acc-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
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
            <h3 className="text-base font-bold text-slate-800">
              {tx('No Game Accounts Found', 'ไม่พบไอดีเกมที่ตรงกับเงื่อนไข')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? tx(`No results matching "${searchQuery}". Try a different keyword or reset filters.`, `ไม่พบผลลัพธ์ที่ตรงกับ "${searchQuery}" ลองค้นหาด้วยคำอื่นหรือรีเซ็ตตัวกรอง`)
                : tx('Try resetting your filters or check back later.', 'ลองเปลี่ยนตัวกรอง หรือกลับมาตรวจสอบใหม่อีกครั้ง')}
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {tx('Reset All Filters', 'รีเซ็ตตัวกรองทั้งหมด')}
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
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm whitespace-nowrap ${getGameBadgeColor(acc.game)}`}
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


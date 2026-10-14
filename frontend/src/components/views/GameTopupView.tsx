'use client';

import React, { useState } from 'react';
import {
  AlertTriangle, Hash, HelpCircle, Info, Lock, QrCode, ShieldCheck, Sparkles, User, Zap,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { TopupGameKey } from '@/types/store';

export function GameTopupView() {
  const {
    activeTopupGame, selectTopupGame, packagesData, selectedPackage, selectPackage,
    uidInput, setUidInput, robloxUser, setRobloxUser, robloxPass, setRobloxPass, handleTopupCheckout,
  } = useStore();
  const { tx } = useLanguage();

  const [showUidHelp, setShowUidHelp] = useState(false);
  const pkgs = packagesData[activeTopupGame] || [];

  const gameTabClass = (g: TopupGameKey) =>
    `topup-game-btn p-3.5 rounded-xl border-2 flex flex-col items-center justify-center text-center transition group ${
      activeTopupGame === g ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'
    }`;

  const gameTitle = activeTopupGame === 'freefire' ? 'Free Fire' : activeTopupGame === 'roblox' ? 'Roblox Robux' : 'Arena of Valor (RoV)';
  const stepOneTitle =
    activeTopupGame === 'roblox'
      ? tx('Enter Roblox Credentials (ID-Pass)', 'กรอกข้อมูลไอดี Roblox (ID-Pass)')
      : activeTopupGame === 'rov'
      ? tx('Enter RoV OpenID / UID', 'กรอกหมายเลข OpenID / UID เกม RoV')
      : tx('Enter Free Fire Player UID', 'กรอกหมายเลข Player UID เกม Free Fire');

  return (
    <div id="view-topup" className="page-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{tx('SECTION 1.2', 'หมวดหมู่ 1.2')}</span>
            <h1 className="text-2xl font-black text-slate-900">{tx('Automated 24/7 Game Top-Up', 'ระบบเติมเกมอัตโนมัติ 24 ชั่วโมง')}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tx('Direct system injection via official UID or automated fast Robux bot delivery.', 'เติมเข้าเกมโดยตรงผ่านหมายเลข UID หรือระบบบอทเติม Robux อัตโนมัติความเร็วสูง')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Top-up Configurator (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{tx('Select Game to Top Up', 'เลือกเกมที่ต้องการเติม')}</label>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => selectTopupGame('rov')} id="topup-tab-rov" className={gameTabClass('rov')}>
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">RoV</div>
                  <span className="text-xs font-bold text-slate-900">Arena of Valor</span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">{tx('UID Instant Top-Up', 'เติมผ่าน UID เข้าไว')}</span>
                </button>
                <button onClick={() => selectTopupGame('freefire')} id="topup-tab-freefire" className={gameTabClass('freefire')}>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">FF</div>
                  <span className="text-xs font-bold text-slate-900">Free Fire</span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">{tx('UID Instant Top-Up', 'เติมผ่าน UID เข้าไว')}</span>
                </button>
                <button onClick={() => selectTopupGame('roblox')} id="topup-tab-roblox" className={gameTabClass('roblox')}>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">R$</div>
                  <span className="text-xs font-bold text-slate-900">Roblox Robux</span>
                  <span className="text-[10px] text-indigo-600 font-semibold mt-0.5">{tx('ID-Pass Bot Fast', 'ระบบ ID-Pass บอทไว')}</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                    <span id="step-1-title">{stepOneTitle}</span>
                  </h3>
                  <button type="button" onClick={() => setShowUidHelp((p) => !p)} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{tx('Where is my UID?', 'ดูเลข UID ตรงไหน?')}</span>
                  </button>
                </div>

                {showUidHelp && (
                  <div className="mb-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800">
                    {tx('UID can be found inside your in-game profile menu under your avatar name.', 'สามารถคัดลอกหมายเลข UID ได้จากหน้าโปรไฟล์ภายในเกม ใต้ชื่อตัวละครของคุณ')}
                  </div>
                )}

                {activeTopupGame !== 'roblox' ? (
                  <div id="form-mode-uid" className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{tx('Player OpenID / UID', 'หมายเลขผู้เล่น OpenID / UID')} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text" id="input-uid" value={uidInput} onChange={(e) => setUidInput(e.target.value)} placeholder="e.g. 192839218209"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Hash className="w-4 h-4" /></div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tx('No password needed! Top-up is transferred instantly directly via server API.', 'ไม่ต้องใช้รหัสผ่าน! ระบบโอนคูปอง/เพชรเข้าบัญชีเกมโดยตรงผ่าน API ทันที')}</span>
                    </p>
                  </div>
                ) : (
                  <div id="form-mode-idpass" className="space-y-4">
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start space-x-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{tx('Important Notice for Robux Top-Up:', 'คำแนะนำสำคัญสำหรับการเติม Robux:')}</span>
                        <p className="mt-0.5 text-amber-700">
                          {tx(
                            'Please temporarily disable 2-Step Verification (2FA / Authenticator) on your Roblox account so our automated bot can log in and purchase the Robux package.',
                            'กรุณาปิดการยืนยันตัวตน 2 ชั้น (2FA / รหัสอีเมล) ชั่วคราว เพื่อให้บอทอัตโนมัติสามารถเข้าสู่ระบบและเติมแพ็กเกจ Robux ได้ทันที'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{tx('Roblox Username', 'ชื่อผู้ใช้ Roblox (Username)')} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type="text" id="input-roblox-user" value={robloxUser} onChange={(e) => setRobloxUser(e.target.value)} placeholder="Roblox username"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User className="w-4 h-4" /></div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{tx('Roblox Password', 'รหัสผ่าน Roblox (Password)')} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type="password" id="input-roblox-pass" value={robloxPass} onChange={(e) => setRobloxPass(e.target.value)} placeholder="Roblox password"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock className="w-4 h-4" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                    <span>{tx('Select Denomination Package', 'เลือกแพ็กเกจราคาที่ต้องการเติม')}</span>
                  </h3>
                  <span className="text-xs text-slate-400">{tx('Tax Included 7%', 'รวมภาษีมูลค่าเพิ่ม 7%')}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" id="topup-packages-container">
                  {pkgs.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id} type="button" onClick={() => selectPackage(pkg.id)} id={`pkg-btn-${pkg.id}`}
                        className={`package-card text-left p-3.5 rounded-xl border-2 transition-all relative ${
                          isSelected ? 'border-indigo-600 bg-indigo-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {pkg.hot && (
                          <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-600 text-white uppercase tracking-wider">{tx('Popular', 'ขายดี')}</span>
                        )}
                        <div className="font-bold text-xs text-slate-900">{pkg.label}</div>
                        {pkg.bonus ? (
                          <div className="text-[10px] text-emerald-600 font-semibold">{pkg.bonus}</div>
                        ) : (
                          <div className="text-[10px] text-slate-400">{tx('Standard Delivery', 'จัดส่งมาตรฐาน')}</div>
                        )}
                        <div className="mt-2 text-sm font-black text-slate-900">฿{pkg.price}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sticky Card (4 Cols) */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
              <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>{tx('Order Summary', 'สรุปรายการสั่งซื้อ')}</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">PromptPay QR</span>
              </h3>

              <div className="py-4 space-y-3.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{tx('Service:', 'บริการ:')}</span>
                  <span className="font-bold text-slate-900" id="summary-game-name">{gameTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500" id="summary-account-label">
                    {activeTopupGame === 'roblox' ? tx('Roblox User:', 'ชื่อผู้ใช้ Roblox:') : tx('Player UID:', 'หมายเลข UID:')}
                  </span>
                  <span className="font-mono font-bold text-slate-900" id="summary-account-val">
                    {activeTopupGame === 'roblox' ? robloxUser || 'Unspecified' : uidInput || 'Unspecified'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{tx('Selected Package:', 'แพ็กเกจที่เลือก:')}</span>
                  <span className="font-bold text-indigo-600" id="summary-package-name">
                    {selectedPackage ? `${selectedPackage.label}${selectedPackage.bonus ? ` (${selectedPackage.bonus})` : ''}` : 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{tx('Estimated Delivery:', 'ระยะเวลาจัดส่ง:')}</span>
                  <span className="font-semibold text-emerald-600 flex items-center space-x-1"><Zap className="w-3 h-3" /><span>{tx('Instant (5-15 sec)', 'เข้าทันที (5-15 วินาที)')}</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{tx('Processing Fee:', 'ค่าธรรมเนียม:')}</span>
                  <span className="font-semibold text-slate-700">฿0.00</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-800">{tx('Total Price:', 'ยอดชำระสุทธิ:')}</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900" id="summary-total-price">฿{selectedPackage ? selectedPackage.price : 0}</span>
                    <span className="text-[10px] text-slate-400 font-bold block">{tx('THB Net', 'บาท (สุทธิ)')}</span>
                  </div>
                </div>
              </div>

              <button onClick={handleTopupCheckout} className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-md shadow-indigo-600/25 transition flex items-center justify-center space-x-2">
                <QrCode className="w-4 h-4" />
                <span>{tx('Confirm & Pay via IQ-Bank', 'ยืนยันและสแกนจ่ายผ่าน IQ-Bank')}</span>
              </button>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{tx('Automated IQ-Bank Webhook Detection', 'ตรวจจับยอดโอนอัตโนมัติผ่าน IQ-Bank Webhook')}</span>
              </div>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-900">
              <div className="font-bold flex items-center space-x-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{tx('Need test payment without money?', 'ต้องการทดสอบการชำระเงินแบบไม่เสียเงินจริง?')}</span>
              </div>
              <p className="text-indigo-700 text-[11px] leading-relaxed">
                {tx(
                  'Use the top bar "Open QR Modal" and click the IQ-Bank Webhook Simulator button to trigger a live payment confirmation!',
                  'กดปุ่มเปิด QR หรือคลิกปุ่ม จำลองธนาคาร IQ-Bank ด้านบนเพื่อจำลองการยิง Webhook ยืนยันยอดชำระเงินได้ทันที!'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

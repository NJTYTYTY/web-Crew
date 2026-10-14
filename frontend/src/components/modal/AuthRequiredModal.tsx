'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, Lock, Shield, User, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { AuthMode } from '@/types/store';

export function AuthRequiredModal() {
  const { isAuthPromptOpen, closeAuthPrompt, login, register } = useStore();
  const { tx } = useLanguage();

  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('alex_gamer');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthPromptOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (mode === 'register' && password !== confirmPassword) {
      setErrorMsg(tx('Passwords do not match.', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน'));
      return;
    }
    if (mode === 'register') {
      await register(username, password, confirmPassword);
    } else {
      await login(username, password);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={closeAuthPrompt}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAuthPrompt}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold mb-3">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{tx('Sign In Required to Purchase', 'กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อนสั่งซื้อ')}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {mode === 'register'
              ? tx('Create Account to Continue', 'สมัครสมาชิกเพื่อดำเนินการสั่งซื้อ')
              : tx('Sign In to Complete Order', 'เข้าสู่ระบบเพื่อดำเนินการสั่งซื้อ')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {tx(
              'Your purchased game account credentials and top-up receipts will be saved to your account.',
              'ระบบจะบันทึกรหัสไอดีเกมและใบเสร็จการเติมเกมไว้ในประวัติการสั่งซื้อของคุณโดยอัตโนมัติ'
            )}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-lg transition text-center whitespace-nowrap ${
              mode === 'login' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tx('Sign In', 'เข้าสู่ระบบ')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-lg transition text-center whitespace-nowrap ${
              mode === 'register' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tx('Create Account', 'สมัครสมาชิกใหม่')}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {tx('Username', 'ชื่อผู้ใช้ (Username)')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={tx('Enter username', 'กรอกชื่อผู้ใช้')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {tx('Password', 'รหัสผ่าน (Password)')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tx('Enter password', 'กรอกรหัสผ่าน')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {tx('Confirm Password', 'ยืนยันรหัสผ่านอีกครั้ง')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={tx('Confirm password', 'ยืนยันรหัสผ่าน')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/25 transition text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>
              {mode === 'register'
                ? tx('Register & Continue to Payment', 'สมัครสมาชิกและไปหน้าชำระเงิน')
                : tx('Sign In & Continue to Payment', 'เข้าสู่ระบบและไปหน้าชำระเงิน')}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{tx('Instant session — No email required.', 'ล็อกอินด่วนด้วย Username ไม่ต้องใช้อีเมล')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

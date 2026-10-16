'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, Gamepad2, Lock, Shield, User } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { AuthMode } from '@/types/store';

export function AuthView({ initialMode }: { initialMode?: AuthMode }) {
  const { authMode, switchView, login, register } = useStore();
  const { tx } = useLanguage();
  const activeMode = initialMode || authMode;

  const [username, setUsername] = useState('alex_gamer');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleModeSwitch = (mode: AuthMode) => {
    setErrorMsg(null);
    switchView('auth', mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (activeMode === 'register' && password !== confirmPassword) {
      setErrorMsg(tx('Passwords do not match.', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน'));
      return;
    }
    try {
      if (activeMode === 'register') {
        await register(username, password, confirmPassword);
      } else {
        await login(username, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || tx('Authentication failed. Please try again.', 'เกิดข้อผิดพลาดในการยืนยันตัวตน โปรดลองอีกครั้ง'));
    }
  };

  return (
    <div id="view-auth" className="page-view">
      <div className="max-w-md mx-auto px-4 py-10 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl overflow-hidden mx-auto flex items-center justify-center shadow-md shadow-indigo-500/30 mb-3">
              <img src="/logopic.webp" alt="NEXUS PLAY Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-black text-slate-900" id="auth-heading">
              {activeMode === 'register' ? tx('Create Fast Account', 'สมัครสมาชิกด่วน') : tx('Welcome Back', 'ยินดีต้อนรับกลับมา')}
            </h2>
            <p className="text-xs text-slate-500 mt-1" id="auth-subheading">
              {activeMode === 'register'
                ? tx('Only Username and Password needed to keep your purchases safe', 'ใช้เพียง Username และ Password เพื่อจัดเก็บประวัติการสั่งซื้อของคุณ')
                : tx('Enter your username and password to access your orders', 'กรอกชื่อผู้ใช้และรหัสผ่านเพื่อดูประวัติคำสั่งซื้อและไอดีเกมของคุณ')}
            </p>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              id="btn-mode-login"
              className={`flex-1 py-2 px-3 rounded-lg transition text-center whitespace-nowrap ${
                activeMode === 'login' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tx('Sign In', 'เข้าสู่ระบบ')}
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              id="btn-mode-register"
              className={`flex-1 py-2 px-3 rounded-lg transition text-center whitespace-nowrap ${
                activeMode === 'register' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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

          {/* FORM STRICT REQUIREMENT: Only Username, Password (and Confirm Password for register) */}
          <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {tx('Username', 'ชื่อผู้ใช้ (Username)')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="auth-username"
                  required
                  placeholder={tx('Enter username (e.g. gamer_thai99)', 'กรอกชื่อผู้ใช้ (เช่น gamer_thai99)')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {tx('Password', 'รหัสผ่าน (Password)')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="auth-password"
                  required
                  placeholder={tx('Enter your password', 'กรอกรหัสผ่านของคุณ')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
            </div>

            {activeMode === 'register' && (
              <div id="field-confirm-pass">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {tx('Confirm Password', 'ยืนยันรหัสผ่านอีกครั้ง')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="auth-confirm-password"
                    required
                    placeholder={tx('Confirm your password', 'กรอกรหัสผ่านอีกครั้งเพื่อยืนยัน')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              id="auth-submit-btn"
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/25 transition text-sm flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <span id="auth-btn-label">
                {activeMode === 'register' ? tx('Create Account & Sign In', 'สมัครสมาชิกและเข้าสู่ระบบ') : tx('Sign In', 'เข้าสู่ระบบ')}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{tx('High-speed username session. No email registration required.', 'ระบบล็อกอินความเร็วสูงด้วย Username ไม่ต้องใช้อีเมล')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

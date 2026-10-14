"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { lang, toggleLang, tx } = useLanguage();
  const [username, setUsername] = useState("operator.node@apexpay.internal");
  const [password, setPassword] = useState("ApexSecureKey#2025");
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      router.push("/admin");
    }, 500);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-space-lg bg-surface font-body-md text-on-surface relative">
      {/* Top-right Language Switcher */}
      <div className="fixed top-4 right-6 z-50">
        <button
          type="button"
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            translate
          </span>
          <span className={lang === "en" ? "font-bold text-primary" : "text-on-surface-variant"}>
            EN
          </span>
          <span className="text-outline-variant">|</span>
          <span className={lang === "th" ? "font-bold text-primary" : "text-on-surface-variant"}>
            ไทย
          </span>
        </button>
      </div>

      <div className="flex flex-col w-full items-center justify-center py-space-xl">
        {showErrorBanner && (
          <div className="w-full max-w-md mb-space-md transition-all duration-300 ease-in-out">
            <div className="bg-error-container text-on-error-container rounded-lg p-space-md shadow-sm flex items-start space-x-space-md">
              <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">
                security_update_warning
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-headline-sm text-headline-sm text-on-error-container">
                    {tx("Access Denied & Logged", "ปฏิเสธการเข้าถึงและบันทึกประวัติแล้ว")}
                  </p>
                  <button
                    className="text-on-error-container hover:opacity-75 transition-opacity"
                    onClick={() => setShowErrorBanner(false)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-on-error-container mt-1">
                  {tx(
                    "Invalid operator credentials. Access attempt logged under IP ",
                    "ข้อมูลผู้ดูแลระบบไม่ถูกต้อง บันทึกความพยายามเข้าถึงภายใต้ IP "
                  )}
                  <span className="font-label-sm text-label-sm font-semibold tracking-wider">
                    203.144.144.22
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-md overflow-hidden relative">
          <div className="bg-inverse-surface px-space-lg py-space-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-inverse-on-surface uppercase tracking-wider">
                {tx("Node: US-EAST-SECURE-09", "โหนด: US-EAST-SECURE-09")}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-surface-container-high">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
              <span className="font-label-sm text-label-sm text-inverse-on-surface">
                SYS.PORT 4438
              </span>
            </div>
          </div>

          <div className="p-space-2xl flex flex-col">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-lg shadow-sm mb-space-md">
                <span
                  className="material-symbols-outlined text-on-primary text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  shield_person
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                {tx("ApexPay Admin Console", "คอนโซลผู้ดูแลระบบ ApexPay")}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {tx(
                  "Direct Core Infrastructure Authentication",
                  "ระบบยืนยันตัวตนโครงสร้างพื้นฐานหลักโดยตรง"
                )}
              </p>
              <div className="mt-space-md inline-flex items-center gap-1.5 px-space-md py-1 bg-surface-container text-on-surface-variant rounded-full">
                <span
                  className="material-symbols-outlined text-error text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock
                </span>
                <span className="font-label-sm text-label-sm tracking-wide uppercase font-semibold text-error">
                  {tx(
                    "Restricted Access • Internal Operator Only",
                    "จำกัดสิทธิ์ • เฉพาะเจ้าหน้าที่ภายในเท่านั้น"
                  )}
                </span>
              </div>
            </div>

            <form className="mt-space-xl flex flex-col space-y-space-lg" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="adminUsername">
                  {tx("Operator Identifier / UID", "รหัสประจำตัวผู้ดูแลระบบ / UID")}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] pointer-events-none">
                    badge
                  </span>
                  <input
                    id="adminUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors"
                    placeholder="operator.node@apexpay.internal"
                    required
                    spellCheck={false}
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="adminPassword">
                    {tx("Passcode & Hardware Key", "รหัสผ่านและฮาร์ดแวร์คีย์")}
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {tx("RSA / YubiKey Ready", "รองรับ RSA / YubiKey")}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] pointer-events-none">
                    vpn_key
                  </span>
                  <input
                    id="adminPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-10 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors"
                    placeholder="••••••••••••••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    className="absolute right-2.5 p-1 text-outline hover:text-on-surface transition-colors flex items-center"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={tx("Toggle visibility", "แสดง/ซ่อนรหัสผ่าน")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                disabled={isVerifying}
                className="w-full h-11 bg-on-surface hover:bg-inverse-surface active:scale-[0.99] text-inverse-on-surface rounded-lg font-headline-sm text-headline-sm flex items-center justify-center space-x-2 transition-all shadow-sm mt-space-sm disabled:opacity-75"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                <span>
                  {isVerifying
                    ? tx("Verifying Enclave...", "กำลังตรวจสอบสิทธิ์...")
                    : tx("Sign In to Backoffice", "เข้าสู่ระบบหลังบ้าน")}
                </span>
              </button>
            </form>

            <div className="mt-space-xl pt-space-lg bg-surface-container-low rounded-lg p-space-md flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary text-[18px]">dashboard</span>
                <Link
                  className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1"
                  href="/admin"
                >
                  <span>{tx("View Live Dashboard", "ดูแดชบอร์ดสด")}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </Link>
              </div>
              <button
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface bg-surface-container px-2.5 py-1 rounded transition-colors"
                onClick={() => setShowErrorBanner((prev) => !prev)}
                type="button"
              >
                {tx("Simulate Error State", "จำลองสถานะแจ้งเตือน")}
              </button>
            </div>
          </div>

          <div className="bg-surface-container px-space-lg py-space-md flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2">
            <div className="flex items-center space-x-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
              <span className="font-label-sm text-label-sm">
                {tx("256-Bit SSL Secured", "ปลอดภัยด้วย 256-Bit SSL")}
              </span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">
              {tx("IQ-Bank Automated Gateway Admin Node", "โหนดแอดมินเกตเวย์อัตโนมัติ IQ-Bank")}
            </div>
          </div>
        </div>

        <div className="max-w-md w-full text-center mt-space-lg px-space-md">
          <p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
            {tx(
              "Notice: This system is restricted exclusively to authorized operators. Unauthorized connection attempts are automatically detected, captured, and reported.",
              "ประกาศ: ระบบนี้จำกัดเฉพาะเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น ความพยายามเชื่อมต่อโดยไม่ได้รับอนุญาตจะถูกตรวจจับและบันทึกโดยอัตโนมัติ"
            )}
          </p>
        </div>
      </div>
    </main>
  );
}

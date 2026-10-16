"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { clearAdminSession, loginApi, logoutApi, setAdminSession } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const { lang, toggleLang, tx } = useLanguage();
  const [username, setUsername] = useState("admin_iq");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setShowErrorBanner(false);
    setErrorMessage("");
    try {
      const res = await loginApi(username.trim(), password);
      const role = res?.user?.role;
      if (role !== "ADMIN") {
        clearAdminSession();
        await logoutApi().catch(() => {});
        setErrorMessage(
          tx(
            "Access Denied: This account does not have ADMIN operator privileges.",
            "ปฏิเสธการเข้าถึง: บัญชีนี้ไม่มีสิทธิ์ระดับผู้ดูแลระบบ (ADMIN)"
          )
        );
        setShowErrorBanner(true);
        setIsVerifying(false);
        return;
      }
      setAdminSession(
        {
          id: res?.user?.id,
          username: res?.user?.username || username.trim(),
          role: "ADMIN",
        },
        res?.token
      );
      setIsVerifying(false);
      router.replace("/admin");
    } catch (err: any) {
      clearAdminSession();
      setErrorMessage(
        err?.message ||
        tx(
          "Invalid operator username or password. Access attempt logged.",
          "รหัสผู้ดูแลระบบหรือรหัสผ่านไม่ถูกต้อง บันทึกความพยายามเข้าถึงแล้ว"
        )
      );
      setShowErrorBanner(true);
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-space-lg bg-surface font-body-md text-on-surface relative">
      {/* Top-right Language Switcher */}
      <div className="fixed top-4 right-4 sm:right-6 z-50">
        <button
          type="button"
          onClick={toggleLang}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-high whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
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
                <div className="flex items-center justify-between gap-2">
                  <p className="font-headline-sm text-headline-sm text-on-error-container">
                    {tx("Access Denied & Logged", "ปฏิเสธการเข้าถึงและบันทึกประวัติแล้ว")}
                  </p>
                  <button
                    className="text-on-error-container hover:opacity-75 transition-opacity shrink-0"
                    onClick={() => setShowErrorBanner(false)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-on-error-container mt-1">
                  {errorMessage ||
                    tx(
                      "Invalid operator credentials. Access attempt logged under IP 203.144.144.22",
                      "ข้อมูลผู้ดูแลระบบไม่ถูกต้อง บันทึกความพยายามเข้าถึงภายใต้ IP 203.144.144.22"
                    )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-md overflow-hidden relative">
          <div className="bg-inverse-surface px-4 sm:px-space-lg py-space-xs flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary-container animate-pulse shrink-0"></span>
              <span className="font-label-sm text-label-sm text-inverse-on-surface uppercase tracking-wider truncate">
                {tx("Node: NEXUS-TH-SECURE-01", "โหนด: NEXUS-TH-SECURE-01")}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-surface-container-high whitespace-nowrap shrink-0">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
              <span className="font-label-sm text-label-sm text-inverse-on-surface">
                PostgreSQL Live
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-space-2xl flex flex-col">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-md shadow-indigo-500/20 mb-space-md border border-surface-container-high">
                <img src="/logopic.webp" alt="NEXUS PLAY Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  NEXUS<span className="text-indigo-600">PLAY</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-primary font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  ADMIN
                </span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface mt-1">
                {tx("NEXUS PLAY Admin Console", "คอนโซลผู้ดูแลระบบ NEXUS PLAY")}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                {tx(
                  "Direct Core Infrastructure & PostgreSQL Authentication",
                  "ระบบยืนยันตัวตนผู้ดูแลระบบหลังบ้านและฐานข้อมูลหลัก"
                )}
              </p>
              <div className="mt-space-md inline-flex items-center gap-1.5 px-space-md py-1 bg-surface-container text-on-surface-variant rounded-full whitespace-nowrap">
                <span
                  className="material-symbols-outlined text-error text-[15px] shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock
                </span>
                <span className="font-label-sm text-label-sm tracking-wide uppercase font-semibold text-error whitespace-nowrap">
                  {tx(
                    "Restricted Access • Internal Operator Only",
                    "จำกัดสิทธิ์ • เฉพาะผู้ดูแลระบบเท่านั้น"
                  )}
                </span>
              </div>
            </div>

            <form className="mt-space-xl flex flex-col space-y-space-lg" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="adminUsername">
                    {tx("Operator Username", "ชื่อผู้ใช้ผู้ดูแลระบบ (Admin Username)")}
                  </label>
                  <span className="font-label-sm text-[11px] text-primary">Default: admin_iq</span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] pointer-events-none">
                    badge
                  </span>
                  <input
                    id="adminUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="admin_iq"
                    required
                    spellCheck={false}
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-label-md text-label-md text-on-surface whitespace-nowrap" htmlFor="adminPassword">
                    {tx("Admin Password", "รหัสผ่านผู้ดูแลระบบ")}
                  </label>
                  <span className="font-label-sm text-[11px] text-primary whitespace-nowrap shrink-0">
                    Default: admin123
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
                    className="w-full h-10 pl-9 pr-10 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="••••••••••••"
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
                className="w-full h-11 bg-on-surface hover:bg-inverse-surface active:scale-[0.99] text-inverse-on-surface rounded-lg font-headline-sm text-headline-sm flex items-center justify-center space-x-2 transition-all shadow-sm mt-space-sm disabled:opacity-75 whitespace-nowrap"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                <span className="whitespace-nowrap">
                  {isVerifying
                    ? tx("Verifying Admin Credentials...", "กำลังตรวจสอบสิทธิ์ผู้ดูแลระบบ...")
                    : tx("Sign In to NEXUS PLAY Backoffice", "เข้าสู่ระบบหลังบ้าน NEXUS PLAY")}
                </span>
              </button>
            </form>

            <div className="mt-space-xl pt-space-lg bg-surface-container-low rounded-lg p-space-md flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0">storefront</span>
                <Link
                  className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1 whitespace-nowrap"
                  href="/"
                >
                  <span>{tx("Back to Storefront", "กลับสู่หน้าร้านค้า")}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </Link>
              </div>
              <button
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface bg-surface-container px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0"
                onClick={() => {
                  setUsername("admin_iq");
                  setPassword("admin123");
                  setShowErrorBanner(false);
                }}
                type="button"
              >
                {tx("Fill Demo Admin", "กรอกรหัสแอดมินตัวอย่าง")}
              </button>
            </div>
          </div>

          <div className="bg-surface-container px-4 sm:px-space-lg py-space-md flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2">
            <div className="flex items-center space-x-1.5 text-on-surface-variant whitespace-nowrap">
              <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">verified_user</span>
              <span className="font-label-sm text-label-sm">
                {tx("256-Bit JWT & Bcrypt Secured", "ปลอดภัยด้วย JWT & Bcrypt")}
              </span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              {tx("NEXUS PLAY Automated Gateway", "เกตเวย์อัตโนมัติ NEXUS PLAY")}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

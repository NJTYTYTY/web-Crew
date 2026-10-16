"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAdminSession } from "@/lib/api";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const adminUser = getAdminSession();
    if (!adminUser || adminUser.role !== "ADMIN") {
      setIsAuthorized(false);
      router.replace("/admin/login");
      return;
    }
    setIsAuthorized(true);
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3 p-4">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-surface-container-high animate-pulse">
          <img src="/logopic.webp" alt="NEXUS PLAY" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>Verifying NEXUS PLAY Admin Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div className="lg:pl-64 transition-all">
        <AdminHeader
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />
        <main className="relative pt-16 bg-surface min-h-screen overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

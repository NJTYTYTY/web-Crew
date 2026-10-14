"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

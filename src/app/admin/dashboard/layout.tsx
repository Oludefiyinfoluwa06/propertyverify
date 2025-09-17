"use client";

import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AdminHeader onMenuToggle={() => setMobileOpen((s) => !s)} />
      <div className="min-h-screen bg-gray-50 flex mt-[65px]">
        {/* Sidebar: hidden on small screens - AdminSidebar should accept open prop or handle its own visibility */}
        <div className={`hidden md:block md:fixed md:inset-y-0 md:w-64`}> 
          <AdminSidebar />
        </div>

        {/* Mobile sliding panel */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute left-0 inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4 overflow-auto">
              <AdminSidebar />
            </div>
          </div>
        )}

        <div className="flex-1 md:pl-70 p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    </>
  );
}

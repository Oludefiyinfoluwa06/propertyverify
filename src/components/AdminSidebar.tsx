"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Home, FileText } from 'lucide-react';

export default function AdminSidebar() {
  const path = usePathname();

  const items = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { id: 'users', label: 'Agents & Users', href: '/admin/dashboard/users', icon: Users },
    { id: 'properties', label: 'Properties', href: '/admin/dashboard/properties', icon: FileText },
  ];

  return (
    <div className="w-64 mt-[65px] bg-white/95 backdrop-blur-sm shadow-lg border-r border-gray-200 relative h-full overflow-y-auto transition-all duration-200">
      <div className="p-6 sm:p-8 border-b border-gray-200">
        <h3 className="font-semibold text-lg tracking-tight">Admin</h3>
        <p className="text-sm text-gray-500 mt-1 font-medium">Platform management</p>
      </div>
      <nav className="p-3 sm:p-4">
        <ul className="space-y-1.5">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.id}>
                <Link href={it.href} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${path === it.href ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-900'}`}>
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="font-medium tracking-tight text-sm">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, CheckCircle, MapPin, Menu, X } from 'lucide-react';

export default function AgentSidebar() {
  const path = usePathname();

  const items = [
    { id: 'overview', label: 'Overview', href: '/agent/dashboard', icon: FileText },
    { id: 'properties', label: 'My Properties', href: '/agent/dashboard/properties', icon: MapPin },
    { id: 'verifications', label: 'Verifications', href: '/agent/dashboard/verifications', icon: CheckCircle },
  ];

  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  // Close sidebar on window resize above mobile breakpoint
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto z-30 transition-all duration-300 ease-in-out lg:w-64 lg:left-0 lg:translate-x-0 ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"}`}>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Agent</h3>
          <p className="text-sm text-gray-500 mt-1">Your workspace</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {items.map((it) => {
              const Icon = it.icon;
              const isActive = path === it.href;
              return (
                <li key={it.id}>
                  <Link
                    href={it.href}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 ${isActive 
                        ? "bg-green-50 text-green-700 font-medium" 
                        : "text-gray-600"}`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-green-600" : "text-gray-400"}
                    `} />
                    <span className="font-medium truncate">{it.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

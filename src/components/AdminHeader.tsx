"use client";

import { Shield, Menu } from 'lucide-react';
import ProfileDropdown from './Header/ProfileDropdown';

type AdminHeaderProps = {
  onMenuToggle?: () => void;
};

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200 fixed top-0 w-full z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[4.5rem]">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => onMenuToggle?.()}
              className="md:hidden mr-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>

            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <span className="block text-xl font-bold tracking-tight text-gray-900">PropertyVerify</span>
                <span className="text-sm font-medium text-green-600">Admin Portal</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}

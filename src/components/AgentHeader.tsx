"use client";

import { Shield } from 'lucide-react';
import ProfileDropdown from './Header/ProfileDropdown';

export default function AgentHeader() {

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
              <div className="ml-2 text-gray-900 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate">
                  <span className="sm:hidden">Agent Portal</span>
                  <span className="hidden sm:inline">PropertyVerify Agent</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Bell, Home, Menu, Search, Shield, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthProvider';
import ProfileDropdown from './Header/ProfileDropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authCtx = useAuth();
  const user = authCtx?.user || null;
  const router = useRouter();

  const navigationItems = [
    { id: 'home', label: 'Home', href: "/", icon: Home },
    { id: 'search', label: 'Search Properties', href: "/search", icon: Search },
  ];

  // If someone is logged in, redirect them immediately to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.push('/admin/dashboard');
      else if (user.role === 'agent') router.push('/agent/dashboard');
      else router.push('/agent/dashboard');
    }
  }, [user, router]);

  const path = usePathname();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PropertyVerify</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${path === item.href
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-900'
                    } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Bell className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <div className="relative">
                  <ProfileDropdown />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/agent/auth/login"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/agent/auth/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigationItems.map((item) => {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${path === item.href
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-500 hover:bg-gray-50'
                    } block px-3 py-2 text-base font-medium w-full text-left`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
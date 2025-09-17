"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener('click', handle);
    return () => window.removeEventListener('click', handle);
  }, []);

  function handleLogout() {
    auth.logout();
    router.push('/');
  }

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen((s) => !s)} 
        className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="relative">
          {auth.user?.profile?.avatar ? (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image 
                src={auth.user.profile.avatar} 
                alt={auth.user.name || 'Profile'} 
                width={32} 
                height={32} 
                className="object-cover" 
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-green-600">
                {(auth.user?.name || 'U').charAt(0)}
              </span>
            </div>
          )}
          {auth.user?.isVerified && (
            <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5">
              <Shield size={8} className="text-white" />
            </div>
          )}
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-sm font-medium truncate max-w-[120px]">
            {auth.user?.name || 'User'}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {auth.user?.role || 'Guest'}
          </div>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`
        absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 overflow-hidden
        transition-all duration-200 origin-top-right
        ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        <div className="p-4 border-b">
          <div className="font-medium">{auth.user?.name}</div>
          <div className="text-sm text-gray-600 truncate">{auth.user?.email}</div>
        </div>

        <div className="py-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

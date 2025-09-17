"use client";
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.token) {
      router.push('/login');
    }
  }, [auth?.token]);

  if (!auth?.token) return null;

  return <>{children}</>;
}

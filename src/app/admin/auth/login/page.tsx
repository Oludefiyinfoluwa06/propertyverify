"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import auth from '@/lib/auth';
import { useAuth } from '@/context/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (auth.getToken()) {
      const role = user?.role;
      if (role === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [router, user?.role]);

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await auth.login(email, password);
      const role = response?.data?.user?.role;

      if (role !== 'admin') {
        setError('Access denied. Admin accounts only.');
        return;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to log in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Sign In</h1>
          <p className="text-gray-600">Access the PropertyVerify admin dashboard</p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-6 flex items-start gap-2 text-sm bg-red-50 text-red-600 px-4 py-3 rounded-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@propertyverify.ng"
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

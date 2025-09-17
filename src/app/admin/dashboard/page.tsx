"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any>({ users: [], properties: [], verifications: [] });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/admin/dashboard');
        setStats(res.data.stats || null);
        setRecent(res.data.recent || {});
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 md:p-8 transition-all duration-200">
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1.5 sm:mt-2 text-base sm:text-lg">Platform overview and recent activity</p>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg sm:rounded-xl shadow-sm border border-green-100 transition-transform hover:-translate-y-0.5 duration-200">
            <div className="text-sm font-medium text-gray-600">Total Users</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</div>
          </div>
          <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg sm:rounded-xl shadow-sm border border-green-100 transition-transform hover:-translate-y-0.5 duration-200">
            <div className="text-sm font-medium text-gray-600">Total Agents</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalAgents}</div>
          </div>
          <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg sm:rounded-xl shadow-sm border border-green-100 transition-transform hover:-translate-y-0.5 duration-200 sm:col-span-2 lg:col-span-1">
            <div className="text-sm font-medium text-gray-600">Properties</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalProperties}</div>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-sm text-gray-500">Loading stats...</div>
      )}

      <div className="mt-8 sm:mt-12">
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight mb-4 sm:mb-6">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg transition-all duration-200 hover:shadow-xl">
            <h4 className="text-sm font-semibold text-green-700 mb-3">Recent Users</h4>
            <ul className="space-y-2">
              {recent.users?.map((u: any) => (
                <li key={u._id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="font-medium truncate mr-2">{u.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex-shrink-0">{u.role}</span>
                </li>
              ))}
              {recent.users?.length === 0 && (
                <li className="text-sm text-gray-500 py-1">No recent users</li>
              )}
            </ul>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg transition-all duration-200 hover:shadow-xl">
            <h4 className="text-sm font-semibold text-green-700 mb-3">Recent Properties</h4>
            <ul className="space-y-2">
              {recent.properties?.map((p: any) => (
                <li key={p._id} className="py-1 px-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="font-medium line-clamp-1">{p.title}</span>
                </li>
              ))}
              {recent.properties?.length === 0 && (
                <li className="text-sm text-gray-500 py-1">No recent properties</li>
              )}
            </ul>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg transition-all duration-200 hover:shadow-xl md:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold text-green-700 mb-3">Recent Verifications</h4>
            <ul className="space-y-2">
              {recent.verifications?.map((v: any) => (
                <li key={v._id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="font-medium truncate mr-2">{v.property?.title || v._id}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex-shrink-0">{v.status}</span>
                </li>
              ))}
              {recent.verifications?.length === 0 && (
                <li className="text-sm text-gray-500 py-1">No recent verifications</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

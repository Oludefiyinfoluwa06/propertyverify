"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get(`/api/admin/users?page=${page}&limit=20`);
        setUsers(res.data.users || []);
        setTotalPages(res.data.pagination?.pages || 1);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    }
    fetchUsers();
  }, [page]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold">Users & Agents</h2>
      <p className="text-sm text-gray-500">Manage platform users and agent accounts</p>

      {/* Table for larger screens */}
      <div className="mt-4 hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="mt-4 space-y-3 md:hidden">
        {users.map((u) => (
          <div key={u._id} className="p-3 border border-gray-100 rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">{u.name}</div>
                <div className="text-sm text-gray-500 truncate">{u.email}</div>
              </div>
              <div className="ml-3">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{u.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 bg-white border rounded">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-2 bg-white border rounded">Next</button>
        </div>
        <div className="text-sm text-gray-500">Page {page} of {totalPages}</div>
      </div>
    </div>
  );
}

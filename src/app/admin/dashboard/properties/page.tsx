"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await api.get(`/api/admin/properties?page=${page}&limit=20`);
        setProperties(res.data.properties || []);
        setTotalPages(res.data.pagination?.pages || 1);
      } catch (err) {
        console.error('Failed to fetch properties', err);
      }
    }
    fetchProperties();
  }, [page]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold">Properties</h2>
      <p className="text-sm text-gray-500">View and manage all property listings</p>

      <div className="mt-4 hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Agent</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">State</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Verification</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {properties.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.agent?.name || '-'}</td>
                <td className="px-4 py-3">{p.state}</td>
                <td className="px-4 py-3">{p.verification?.status || 'pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="mt-4 space-y-3 md:hidden">
        {properties.map((p) => (
          <div key={p._id} className="p-3 border border-gray-100 rounded-lg bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">{p.title}</div>
                <div className="text-sm text-gray-500 truncate">{p.agent?.name || '-'}</div>
                <div className="text-xs text-gray-500 mt-1">{p.state} • {p.verification?.status || 'pending'}</div>
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

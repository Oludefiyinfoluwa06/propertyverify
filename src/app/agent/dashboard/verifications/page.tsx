"use client";

import Link from "next/link";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Verifications() {
  const [verifications, setVerifications] = useState<any[]>([]);

  useEffect(() => {
    fetchMyVerifications();
  }, []);

  async function fetchMyVerifications() {
    try {
      const res = await api.get('/api/verifications/my-verifications');
      setVerifications(res.data.verifications || []);
    } catch (err) {
      console.error('Failed to fetch verifications', err);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">My Verifications</h3>
        <Link
          href="/agent/dashboard/verifications/verify"
          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto text-center"
        >
          New Verification
        </Link>
      </div>

      {/* Large Screen Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {verifications.map((verification) => (
              <tr key={verification._id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{verification.property?.title || 'Property'}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    verification.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : verification.status === 'pending' || verification.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {verification.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {verification.score?.overall ? `${verification.score.overall}%` : '-'}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(verification.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mr-3 hover:underline">View</button>
                  {verification.status === 'completed' && (
                    <button className="text-blue-600 hover:text-blue-900 hover:underline">Download</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-gray-200">
        {verifications.map((verification) => (
          <div key={verification._id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium text-gray-900">{verification.property?.title || 'Property'}</div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                verification.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : verification.status === 'pending' || verification.status === 'in-progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {verification.status}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Score:</span>
                <span className="text-gray-900">{verification.score?.overall ? `${verification.score.overall}%` : '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-900">{new Date(verification.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-100">
                <button className="text-green-600 hover:text-green-900 text-sm font-medium hover:underline">View</button>
                {verification.status === 'completed' && (
                  <button className="text-blue-600 hover:text-blue-900 text-sm font-medium hover:underline">Download</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {verifications.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm sm:text-base">
            No verifications found. Start by creating a new verification request.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import dynamic from 'next/dynamic';

const VerifyForm = dynamic(() => import('@/components/VerifyForm/VerifyForm'), { ssr: false });

export default function VerifyPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">New Verification</h3>
      </div>

      <VerifyForm />
    </div>
  );
}

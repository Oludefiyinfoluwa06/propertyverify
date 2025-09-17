"use client";
import { useState } from 'react';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function VerifyForm() {
  const [propertyId, setPropertyId] = useState('');
  const [priority, setPriority] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
  const payload = await api.post('/api/verifications/request', { propertyId, priority });
  setResult(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to request verification');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-2">Verify a Property</h2>
      <p className="text-gray-600 mb-4">Enter property details to start the verification process</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div>
          <div className="relative">
            <Input
              label="Property Reference"
              id="verify-property-ref"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              placeholder="Enter the unique property reference number"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">You can find this number on the property listing page</p>
        </div>

        <div>
          <label htmlFor="verify-priority" className="block text-sm font-medium text-gray-700 mb-1">Verification Speed</label>
          <select
            id="verify-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="low">Standard (5-7 business days) - ₦25,000</option>
            <option value="medium">Priority (3-5 business days) - ₦50,000</option>
            <option value="high">Express (1-2 business days) - ₦75,000</option>
            <option value="urgent">Urgent (24 hours) - ₦100,000</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Faster verification requires additional fees
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full sm:w-auto"
        >
          {loading ? 'Submitting request...' : 'Request Verification'}
        </Button>
      </form>

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="font-medium">Verification Request Submitted Successfully</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-green-100">
              <span className="font-medium text-gray-700">Reference Number</span>
              <span className="text-gray-900">{result.verification?.id || result.verification?._id || result.data?.verification?.id || result.data?.verification?._id}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-green-100">
              <span className="font-medium text-gray-700">Payment Required</span>
              <span className="text-gray-900">₦{(result.paymentAmount || result.data?.paymentAmount || result.data?.amount || 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-green-100">
              <span className="font-medium text-gray-700">Selected Speed</span>
              <span className="text-gray-900">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
            </div>

            <div className="mt-4 bg-green-100 p-4 rounded text-sm text-green-800">
              <p className="font-medium mb-2">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-green-700">
                <li>Complete the payment to begin verification</li>
                <li>Track progress in your dashboard</li>
                <li>Receive updates via email and SMS</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

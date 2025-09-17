"use client";
import { useState } from 'react';
import api from '@/lib/api';

export default function ShareButton({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  async function handleShare() {
    setLoading(true);
    try {
      const payload = await api.post(`/api/properties/${propertyId}/share`);
      const url = payload.shareUrl || payload.url || payload;
      setShareUrl(url);
      if (url) {
        await navigator.clipboard.writeText(String(url));
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={handleShare} disabled={loading} className="px-3 py-2 border rounded">
        {loading ? 'Sharing...' : 'Share'}
      </button>
      {shareUrl && <div className="text-xs text-gray-500 mt-1">Copied link to clipboard</div>}
    </>
  );
}

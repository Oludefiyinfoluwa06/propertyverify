"use client";
import { useState } from 'react';
import api from '@/lib/api';

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false);
  const [favorited, setFavorited] = useState(false);

  async function toggleFavorite() {
    setLoading(true);
    try {
      await api.post(`/api/properties/${propertyId}/favorite`);
      setFavorited(true);
    } catch (e) {
      // ignore - ideally show toast
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={toggleFavorite} disabled={loading} className={`px-3 py-2 rounded border ${favorited ? 'bg-green-600 text-white' : 'bg-white'}`}>
      {favorited ? 'Favorited' : 'Favorite'}
    </button>
  );
}

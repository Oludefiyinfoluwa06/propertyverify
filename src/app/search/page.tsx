"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CheckCircle, MapPin, Search, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from '@/lib/api';
import absoluteImageUrl from '@/lib/image';
import formatCurrency from '@/lib/format';
import Link from 'next/link';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    propertyType: '',
    verified: true
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchProperties(reset = false) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.location) params.append('state', filters.location);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.verified !== undefined) params.append('verified', String(filters.verified));
      params.append('page', String(reset ? 1 : page));

  const payload = await api.get(`/api/properties?${params.toString()}`);
  // Expecting { success, data: { properties, pagination } } or similar
  const list = payload.properties || payload.data?.properties || payload;
  const pagination = payload.pagination || payload.data?.pagination || {};

      if (reset) {
        setProperties(list || []);
        setPage(pagination.page || 1);
        setPages(pagination.pages || 1);
      } else {
        setProperties((prev) => [...prev, ...(list || [])]);
        setPage(pagination.page || page);
        setPages(pagination.pages || pages);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    fetchProperties(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = () => {
    setPage(1);
    fetchProperties(true);
  };

  const loadMore = () => {
    if (page >= pages) return;
    setPage((p) => p + 1);
    fetchProperties(false);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Verified Properties</h1>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, property type, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button onClick={onSearch} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>

              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Property Type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Price Range</option>
                <option value="0-50m">Under ₦50M</option>
                <option value="50m-100m">₦50M - ₦100M</option>
                <option value="100m+">Above ₦100M</option>
              </select>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => setFilters({...filters, verified: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Verified Only</span>
              </label>
            </div>
          </div>

          {/* Results */}
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => {
              const id = property._id || property.id || property._doc?._id;
              const title = property.title || property.name || property.summary || 'Property';
              const location = property.address || property.location || property.state || '';
              const price = property.price || property.amount || property.listingPrice || 0;
              const verified = property.verified || (property.verification && property.verification.status === 'verified');
              const score = property.verification?.score || property.score || 0;
              const imageSrc = absoluteImageUrl((property.images && property.images[0]) || property.image || property.photo || property.thumbnail || null);

              return (
                <div key={id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-100 overflow-hidden">
                      {imageSrc ? (
                        // using plain img to avoid next/image domain restrictions
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      {verified && (
                        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                        Score: {score}%
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{location}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-4">{formatCurrency(price)}</div>

                    <div className="flex space-x-2">
                      <Link href={`/property/${id}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium transition-colors text-center">
                        View Details
                      </Link>
                      <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            {loading ? (
              <div className="text-gray-600">Loading...</div>
            ) : (
              page < pages && (
                <button onClick={loadMore} className="bg-white border border-gray-300 px-4 py-2 rounded-md">
                  Load more
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

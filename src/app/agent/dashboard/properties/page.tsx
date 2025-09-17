"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";

export default function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const auth = useAuth();

  useEffect(() => {
    let mounted = true;
    async function fetchMyProperties() {
      try {
        const res = await api.get('/api/properties/my');
        const payload = res?.data || res;
        const props = payload?.properties || payload?.data?.properties || payload?.properties || [];
        if (mounted) setProperties(props || []);
      } catch (err) {
        console.error('Failed to fetch agent properties', err);
      }
    }
    if (auth?.token) fetchMyProperties();
    return () => { mounted = false; };
  }, [auth?.token]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">My Properties</h3>
        <Link
          href="/agent/dashboard/properties/new"
          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto text-center"
        >
          New Property
        </Link>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {properties.length > 0 ? properties.map((property) => (
            <div 
              key={property._id} 
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">{property.city}, {property.state}</span>
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-green-600 mt-1.5 sm:mt-2">
                    {property.currency}{property.price?.toLocaleString?.() || property.price}
                  </p>
                </div>
                <div className="sm:text-right flex sm:block items-center justify-between sm:justify-start">
                  <p className="text-xs text-gray-500 sm:mb-2 order-last sm:order-first">
                    Added: {new Date(property.createdAt).toLocaleDateString()}
                  </p>
                  {/* Uncomment and style buttons if needed
                  <div className="space-x-2">
                    <button className="text-green-600 hover:text-green-900 text-sm">View</button>
                    <button className="text-red-600 hover:text-red-900 text-sm">Remove</button>
                  </div>
                  */}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm sm:text-base">
                No properties found. Start by adding a new property.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
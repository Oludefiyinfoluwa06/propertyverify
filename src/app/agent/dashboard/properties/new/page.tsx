"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const propertyTypes = [
    'Apartment',
    'House',
    'Land',
    'Commercial',
    'Office',
    'Industrial',
    'Other'
  ];

  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title,
        description,
        address,
        price: Number(price),
        state: stateVal,
        city,
        propertyType,
      };
      const res = await api.post('/api/properties', payload);
      const body = res || {};
      const created = body?.data?.property || body?.property || body?.data || body;
      const createdId = created?._id || (created?.data && created.data._id) || created?.property?._id;

      if (images && images.length && createdId) {
        const form = new FormData();
        for (let i = 0; i < images.length; i++) form.append('images', images[i]);
        await api.post(`/api/properties/${createdId}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      router.push('/agent/dashboard/properties');
    } catch (err: any) {
      console.error('Failed to create property', err);
      setError(err?.message || 'Failed to create property. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/agent/dashboard/properties"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to properties
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Property</h2>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-50 border border-red-100 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <Input
            id="property-title"
            label="Property Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Modern 3-Bedroom Apartment"
            required
            error={error ? '' : undefined}
          />

          <Textarea
            id="property-description"
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the property in detail..."
            required
            error={error ? '' : undefined}
            rows={4}
          />

          <Input
            id="property-address"
            label="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Complete property address"
            required
            error={error ? '' : undefined}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              id="property-price"
              label="Price (₦)"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              required
              error={error ? '' : undefined}
              min={0}
            />

            <Input
              id="property-state"
              label="State"
              value={stateVal}
              onChange={e => setStateVal(e.target.value)}
              placeholder="e.g., Lagos"
              required
              error={error ? '' : undefined}
            />

            <Input
              id="property-city"
              label="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g., Ikeja"
              required
              error={error ? '' : undefined}
            />
          </div>

          <div>
            <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              id="property-type"
              value={propertyType}
              onChange={e => setPropertyType(e.target.value)}
              required
              className={`
                w-full px-4 py-2.5 rounded-lg
                bg-white border border-gray-300
                text-gray-900 text-base
                transition duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500/20 focus:border-green-500
                ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
              `}
            >
              <option value="">Select a type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="property-images"
                    className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  >
                    <span>Upload images</span>
                    <input
                      id="property-images"
                      type="file"
                      multiple
                      onChange={e => setImages(e.target.files)}
                      className="sr-only"
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                {images && images.length > 0 && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    {images.length} {images.length === 1 ? 'image' : 'images'} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" loading={loading}>
              Create property
            </Button>
            <Link href="/agent/dashboard/properties">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
  
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import api from '@/lib/api';

const propertyTypes = [
  'Apartment',
  'House',
  'Land',
  'Commercial',
  'Office',
  'Industrial',
  'Other'
];

export default function EditPropertyPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<{ [key: string]: boolean }>({}); 

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    api.get(`/api/properties/${id}`).then((res: any) => {
      const data = res?.data?.property || res?.property || res?.data || res;
      if (!mounted) return;
      setProperty(data);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setAddress(data.address || '');
      setPrice(data.price?.toString?.() || '');
      setStateVal(data.state || '');
      setCity(data.city || '');
      setPropertyType(data.propertyType || '');
      setOwnerName(data.owner?.name || '');
      setOwnerPhone(data.owner?.phone || '');
    }).catch(err => {
      console.error('Failed to load property', err);
    }).finally(() => setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  async function handleSave(e: any) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const payload: any = {
        title,
        description,
        address,
        price: Number(price),
        state: stateVal,
        city,
        propertyType,
        owner: { name: ownerName, phone: ownerPhone }
      };
      
      // Validate price is a number
      if (isNaN(payload.price)) {
        setError('Please enter a valid price');
        setSaving(false);
        return;
      }

      // Update property details
      const propertyResponse = await api.put(`/api/properties/${id}`, payload);
      if (!propertyResponse?.data && !propertyResponse?.ok) {
        throw new Error('Failed to update property details');
      }

      // Upload new images if provided
      if (images && images.length) {
        try {
          const form = new FormData();
          for (let i = 0; i < images.length; i++) {
            const file = images[i];
            // Basic validation
            if (!file.type.startsWith('image/')) {
              setError(`File "${file.name}" is not an image. Please upload only image files.`);
              setSaving(false);
              return;
            }
            form.append('images', file);
          }
          
          const imageResponse = await api.post(
            `/api/properties/${id}/images`,
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          
          if (!imageResponse?.data && !imageResponse?.ok) {
            throw new Error('Failed to upload images');
          }
        } catch (imageErr: any) {
          setError('Failed to upload images: ' + (imageErr.message || 'Please try again'));
          console.error('Image upload error:', imageErr);
          setSaving(false);
          return;
        }
      }

      router.push('/agent/dashboard/properties');
    } catch (err: any) {
      console.error('Failed to update property', err);
      setError(err.message || 'Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteImage(imgUrl: string) {
    setDeleteLoading(prev => ({ ...prev, [imgUrl]: true }));
    setError(null);
    
    try {
      const filename = imgUrl.split('/').pop();
      if (!filename) {
        throw new Error('Invalid image URL');
      }
      
      const response = await api.del(`/api/properties/${id}/images`, { data: { filename } });
      if (!response?.data && !response?.ok) {
        throw new Error('Failed to delete image');
      }
      
      // Update UI
      setProperty((p: any) => ({
        ...p,
        images: (p.images || []).filter((i: string) => i !== imgUrl)
      }));
    } catch (err: any) {
      console.error('Failed to delete image:', err);
      setError(`Failed to delete image: ${err.message || 'Please try again'}`);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [imgUrl]: false }));
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/agent/dashboard/properties" className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-xl font-semibold">Edit Property</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="Enter property title"
        />
        
        <Textarea
          id="description"
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          placeholder="Describe the property"
        />
        
        <Input
          id="address"
          label="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
          placeholder="Full property address"
        />
        
        <div className="grid grid-cols-3 gap-4">
          <Input
            id="price"
            label="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            type="number"
            required
            placeholder="Price"
          />
          <Input
            id="state"
            label="State"
            value={stateVal}
            onChange={e => setStateVal(e.target.value)}
            required
            placeholder="State"
          />
          <Input
            id="city"
            label="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
            placeholder="City"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            id="propertyType"
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Select property type</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="ownerName"
            label="Owner Name"
            value={ownerName}
            onChange={e => setOwnerName(e.target.value)}
            required
            placeholder="Property owner's name"
          />
          <Input
            id="ownerPhone"
            label="Owner Phone"
            value={ownerPhone}
            onChange={e => setOwnerPhone(e.target.value)}
            type="tel"
            required
            placeholder="Owner's contact number"
          />
        </div>

        {property.images && property.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
            <div className="grid grid-cols-3 gap-4">
              {property.images.map((img: string) => (
                <div key={img} className="relative border rounded-lg overflow-hidden">
                  <div className="w-full h-36 relative">
                    <Image src={img} alt="property" fill className="object-cover" />
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleDeleteImage(img)}
                    loading={deleteLoading[img]}
                    className="absolute top-2 right-2 h-8 w-8 !p-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Images</label>
          <input
            type="file"
            multiple
            onChange={e => setImages(e.target.files)}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            accept="image/*"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
          >
            {saving ? 'Saving changes...' : 'Save changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/agent/dashboard/properties')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

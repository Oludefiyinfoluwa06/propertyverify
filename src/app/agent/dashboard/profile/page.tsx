"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AgentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get('/api/auth/me');
      const u = res.data.user || res.data;
      setProfile(u);
      setName(u.name || '');
      setCompany(u.profile?.company || '');
      setLocation(u.profile?.location || '');
      setPhone(u.phone || '');
      setError(null);
    } catch (err: any) { 
      console.error(err);
      setError(err?.message || 'Failed to load profile');
    }
  }

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await api.put('/api/auth/profile', { 
        name, 
        phone,
        profile: { company, location } 
      });
      const u = res.data.user || res.data;
      setProfile(u);
      setSuccess('Profile updated successfully');
    } catch (err: any) { 
      console.error(err);
      setError(err?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(e: any) {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validate file type
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (f.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    setAvatarFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  // async function submitAvatar(e: any) {
  //   e.preventDefault();
  //   if (!avatarFile) return;
    
  //   setUploadLoading(true);
  //   setError(null);
    
  //   try {
  //     const fd = new FormData();
  //     fd.append('avatar', avatarFile);
  //     const res = await api.post('/api/auth/avatar', fd, { 
  //       headers: { 'Content-Type': 'multipart/form-data' } 
  //     });
      
  //     const u = res.data.user || res.data;
  //     setProfile(u);
  //     setPreview(null);
  //     setAvatarFile(null);
  //     setSuccess('Avatar updated successfully');
  //   } catch (err: any) { 
  //     console.error(err);
  //     setError(err?.message || 'Failed to upload avatar'); 
  //   } finally {
  //     setUploadLoading(false);
  //   }
  // }

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="border-b pb-6 mb-6">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <div className="mt-2 text-sm text-gray-600">
          Logged in as: <span className="font-medium">{profile?.email}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 relative rounded-full overflow-hidden bg-gray-100 ring-2 ring-offset-2 ring-gray-200">
              <Image 
                src={preview || profile?.profile?.avatar || '/placeholder-avatar.png'} 
                alt={profile?.name || 'Profile picture'} 
                fill 
                sizes="96px" 
                className="object-cover" 
              />
            </div>
            <label 
              htmlFor="avatar-upload" 
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Camera size={18} className="text-gray-600" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </label>
          </div>

          {avatarFile && (
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Selected: {avatarFile.name}</p>
              <Button
                // onClick={submitAvatar}
                variant="secondary"
                loading={uploadLoading}
                className="w-auto"
              >
                {uploadLoading ? 'Uploading...' : 'Save new picture'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <Input
          id="fullName"
          label="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your full name"
          required
        />

        <Input
          id="phone"
          label="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          type="tel"
          placeholder="Your contact number"
          required
        />

        <Input
          id="company"
          label="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Your company name"
        />

        <Input
          id="location"
          label="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Your business location"
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Saving changes...' : 'Save changes'}
          </Button>
        </div>
      </form>

      {profile?.isVerified === false && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Account Verification Required</h3>
          <p className="text-sm text-yellow-700">
            Please verify your phone number to access all features. We&rsquo;ll send you a verification code.
          </p>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => {}} // TODO: Implement resend verification code
          >
            Resend Verification Code
          </Button>
        </div>
      )}
    </div>
  );
}

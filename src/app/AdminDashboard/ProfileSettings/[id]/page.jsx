'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { User } from 'lucide-react';

const MAX_IMG_MB = 5;
const ACCEPTED_IMG = ['image/png', 'image/jpeg', 'image/webp'];

export default function ProfilePage() {
  const params = useParams();
  const routeId = params?.id;

  const apiBase = (process.env.NEXT_PUBLIC_API_DOMAIN || '').replace(/\/$/, '');
  const toAbsoluteUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('blob:')) return path; // allow temporary preview
    if (/^https?:\/\//i.test(path)) return path;
    return `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const localUser = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const u = JSON.parse(localStorage.getItem('authUser')) || null;
      // normalize immediately so UI always has absolute url
      if (u?.profile_picture) {
        u.profile_picture = toAbsoluteUrl(u.profile_picture);
      }
      return u;
    } catch {
      return null;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const id = routeId || localUser?.id;

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    cnic: '',
    address: '',
    profile_picture: null, // File
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ type: '', text: '' });
  const [previewImage, setPreviewImage] = useState('');
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });

  const previewUrlRef = useRef(null);

  useEffect(() => {
    if (!localUser) return;
    setProfileData((p) => ({
      ...p,
      first_name: localUser.first_name || '',
      last_name: localUser.last_name || '',
      phone: localUser.phone || '',
      cnic: localUser.cnic || '',
      address: localUser.address || '',
      profile_picture: null,
    }));
    setPreviewImage(localUser.profile_picture || '');
  }, [localUser]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const showBanner = (type, text) => setBanner({ type, text });

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const guardToken = () => {
    if (!token) {
      showBanner('error', 'You must be logged in to perform this action.');
      return false;
    }
    return true;
  };

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      if (!ACCEPTED_IMG.includes(file.type)) {
        showBanner('error', 'Please upload a PNG, JPG, or WEBP image.');
        return;
      }
      if (file.size > MAX_IMG_MB * 1024 * 1024) {
        showBanner('error', `Image must be ≤ ${MAX_IMG_MB}MB.`);
        return;
      }

      setProfileData((prev) => ({ ...prev, [name]: file }));

      // Temporary preview via blob (do NOT store this in localStorage)
      const url = URL.createObjectURL(file);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = url;
      setPreviewImage(url);
      return;
    }

    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setBanner({ type: '', text: '' });

    if (!guardToken()) return;
    if (!id) {
      showBanner('error', 'User id is missing.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      const res = await fetch(`${apiBase}/api/auth/users/${id}/`, {
        method: 'PATCH',
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.detail || json?.message || 'Failed to update profile');
      }

      // Build canonical, absolute picture URL
      const serverPic = json.profile_picture || '';
      const absolutePic = toAbsoluteUrl(serverPic) || toAbsoluteUrl(localUser?.profile_picture) || previewImage;

      const updatedUser = {
        ...(localUser || {}),
        first_name: json.first_name ?? profileData.first_name,
        last_name: json.last_name ?? profileData.last_name,
        phone: json.phone ?? profileData.phone,
        cnic: json.cnic ?? profileData.cnic,
        address: json.address ?? profileData.address,
        profile_picture: absolutePic.startsWith('blob:') ? '' : absolutePic, // never persist blob
      };

      localStorage.setItem('authUser', JSON.stringify(updatedUser));

      // Show the right preview (prefer server-provided absolute)
      setPreviewImage(absolutePic);

      showBanner('success', 'Profile updated successfully.');
    } catch (err) {
      showBanner('error', err.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setBanner({ type: '', text: '' });

    if (!guardToken()) return;

    if (!passwordData.new_password || !passwordData.current_password) {
      showBanner('error', 'Please fill in all password fields.');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      showBanner('error', 'New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          old_password: passwordData.current_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.detail || json?.message || 'Password change failed');
      }

      showBanner('success', 'Password updated successfully.');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      showBanner('error', err.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 -mb-px border-b-2 transition-colors ${activeTab === id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-800'
        }`}
      role="tab"
      aria-selected={activeTab === id}
      aria-controls={`panel-${id}`}
    >
      {label}
    </button>
  );

  const PasswordInput = ({ name, placeholder, value, onChange, visible, onToggle }) => (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Settings</h1>

      {/* Tabs */}
      <div className="flex border-b mb-4 sm:mb-6 gap-4" role="tablist" aria-label="Settings Tabs">
        <TabButton id="profile" label="Profile Settings" />
        <TabButton id="password" label="Change Password" />
      </div>

      {/* Banner */}
      {banner.text && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${banner.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          role={banner.type === 'success' ? 'status' : 'alert'}
        >
          {banner.text}
        </div>
      )}

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
        {/* Profile Form */}
        {activeTab === 'profile' && (
          <form id="panel-profile" role="tabpanel" aria-labelledby="profile" onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-400">
                    <User className="w-10 h-10" />  {/* default icon */}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleProfileChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, or WEBP up to {MAX_IMG_MB}MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                <input
                  type="text"
                  name="cnic"
                  value={profileData.cnic}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}

        {/* Password Form */}
        {activeTab === 'password' && (
          <form
            id="panel-password"
            role="tabpanel"
            aria-labelledby="password"
            onSubmit={handlePasswordSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <PasswordInput
                name="current_password"
                placeholder="Current password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData((p) => ({ ...p, current_password: e.target.value }))}
                visible={showPwd.current}
                onToggle={() => setShowPwd((p) => ({ ...p, current: !p.current }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <PasswordInput
                name="new_password"
                placeholder="New password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData((p) => ({ ...p, new_password: e.target.value }))}
                visible={showPwd.next}
                onToggle={() => setShowPwd((p) => ({ ...p, next: !p.next }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <PasswordInput
                name="confirm_password"
                placeholder="Confirm new password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData((p) => ({ ...p, confirm_password: e.target.value }))}
                visible={showPwd.confirm}
                onToggle={() => setShowPwd((p) => ({ ...p, confirm: !p.confirm }))}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

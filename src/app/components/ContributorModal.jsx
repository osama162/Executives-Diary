import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const ContributorModal = ({ isOpen, onClose, onSubmit, contributor }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    cnic: '',
    phone: '',
    address: '',
    password: '',
    confirm_password: '',
    profile_picture: null
  });
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (contributor) {
      setFormData({
        first_name: contributor.first_name || '',
        last_name: contributor.last_name || '',
        email: contributor.email || '',
        cnic: contributor.cnic || '',
        phone: contributor.phone || '',
        address: contributor.address || '',
        password: '',
        confirm_password: '',
        profile_picture: null
      });
      setPreviewUrl(contributor.profile_picture || null);
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        cnic: '',
        phone: '',
        address: '',
        password: '',
        confirm_password: '',
        profile_picture: null
      });
      setPreviewUrl(null);
    }
    setErrors({});
  }, [contributor, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.cnic.trim()) newErrors.cnic = 'CNIC is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (!contributor) {
      if (!formData.password.trim()) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null && val !== '') payload.append(key, val);
    });
    payload.append('role', 'contributor');
    payload.append('status', 'active');

    onSubmit(payload);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, profile_picture: null }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/25" onClick={onClose} />
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {contributor ? 'Edit Contributor' : 'Add New Contributor'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.first_name ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter first name"
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.last_name ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter last name"
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>
            </div>

            {/* Email + CNIC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.cnic ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="45206-1181628-8"
                />
                {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
              </div>
            </div>

            {/* Phone + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="0340-1234567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Password + Confirm Password (new contributor only) */}
            {!contributor && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter password"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Confirm password"
                  />
                  {errors.confirm_password && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                  )}
                </div>
              </div>
            )}

            {/* Profile Picture (moved to the end, with nicer UI) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>

              <div
                className="flex items-center gap-4 rounded-lg border border-dashed border-gray-300 p-4 hover:border-gray-400 transition-colors"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-16 w-16 rounded-full object-cover ring-1 ring-gray-200"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}

                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Upload a profile image (JPG, PNG). Max ~5MB.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      id="profile_picture"
                      name="profile_picture"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {previewUrl && (
                      <button
                        type="button"
                        onClick={clearFile}
                        className="text-xs px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {errors.profile_picture && (
                <p className="text-red-500 text-sm mt-1">{errors.profile_picture}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1b1b4a] hover:bg-[#1b1b4a] text-white rounded-lg cursor-pointer"
              >
                {contributor ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContributorModal;

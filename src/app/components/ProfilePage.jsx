// src/components/ProfilePage.jsx
import React, { useState, useEffect } from "react";

export default function ProfilePage({ user, token, API_BASE, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    cnic: "",
    address: "",
    profile_picture: null,
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // Populate form with existing user data
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        cnic: user.cnic || "",
        address: user.address || "",
        profile_picture: null,
      });
      setPreviewImage(user.profile_picture || "");
    }
  }, [user]);

  // Handle form input changes
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setProfileData({ ...profileData, [name]: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  // Submit profile changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      const res = await fetch(`${API_BASE}/api/auth/users/${user.id}/`, {
        method: "PATCH",
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Failed to update profile");

      // Merge existing user data with backend response to avoid null overwriting
      const updatedUser = {
        ...user,
        first_name: json.first_name ?? user.first_name,
        last_name: json.last_name ?? user.last_name,
        phone: json.phone ?? user.phone,
        cnic: json.cnic ?? user.cnic,
        address: json.address ?? user.address,
        profile_picture: json.profile_picture ?? user.profile_picture,
      };

      onUserUpdate(updatedUser);

      // Update profileData so form keeps displaying values
      setProfileData({
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone: updatedUser.phone,
        cnic: updatedUser.cnic,
        address: updatedUser.address,
        profile_picture: null,
      });

      setPreviewImage(updatedUser.profile_picture || "");
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage("New password and confirmation do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          old_password: passwordData.current_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Password change failed");

      setMessage("Password updated successfully!");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === "profile" ? "border-b-2 border-blue-600" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile Settings
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "password" ? "border-b-2 border-blue-600" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {message && <div className="mb-4 text-sm text-red-600">{message}</div>}

      {/* Profile Form */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={profileData.first_name}
            onChange={handleProfileChange}
            className="border px-3 py-2 w-full"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={profileData.last_name}
            onChange={handleProfileChange}
            className="border px-3 py-2 w-full"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={profileData.phone}
            onChange={handleProfileChange}
            className="border px-3 py-2 w-full"
          />
          <input
            type="text"
            name="cnic"
            placeholder="CNIC"
            value={profileData.cnic}
            onChange={handleProfileChange}
            className="border px-3 py-2 w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={profileData.address}
            onChange={handleProfileChange}
            className="border px-3 py-2 w-full"
          />

          {/* Profile Picture Preview */}
          {previewImage && (
            <div className="mb-2">
              <img src={previewImage} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full" />
            </div>
          )}

          <input
            type="file"
            name="profile_picture"
            accept="image/*"
            onChange={handleProfileChange}
            className="border px-3 py-2 w-full"
          />

          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      )}

      {/* Password Form */}
      {activeTab === "password" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <input
            type="password"
            name="current_password"
            placeholder="Current Password"
            value={passwordData.current_password}
            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
            className="border px-3 py-2 w-full"
          />
          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            value={passwordData.new_password}
            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
            className="border px-3 py-2 w-full"
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm New Password"
            value={passwordData.confirm_password}
            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
            className="border px-3 py-2 w-full"
          />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2">
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      )}
    </div>
  );
}

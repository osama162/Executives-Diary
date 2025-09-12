"use client"; // Indicates this is client-side only code

import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; // Use Next.js router
import Link from "next/link";

const DashboardLayout = ({children}) => {
  const [currentPage, setCurrentPage] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN;
  const router = useRouter();

  // Fetch user from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse and set user state
      }
    }
  }, []);

  const signOut = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch(`${API_BASE}/api/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Always clear local data
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setUser(null); // Set user to null after logout
      router.push("/Login"); // Redirect to login
    }
  };

  console.log(user);

  return (
    <div className='flex h-screen bg-gray-50'>
      <AdminSidebar user={user} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='px-6 py-4 flex items-center justify-between'>
            <h1 className='text-xl font-semibold text-gray-800'>
              {user?.role === 'admin' ? 'Admin Dashboard' : 'Contributor Dashboard'}
            </h1>

            {/* Right corner profile + logout */}
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <h3 className='font-medium text-gray-900'>{user?.username}</h3>
                <p className='text-sm text-gray-500 capitalize'>{user?.role}</p>
              </div>

              <Link href={`/AdminDashboard/ProfileSettings/${user?.id}`} className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer'>
                <span className='text-white font-semibold text-sm'>
                  {user?.name ? user?.name.split(' ').map((n) => n[0]).join('') : user?.email?.[0]?.toUpperCase() || '?'}
                </span>
              </Link>

              {/* LogOut icon */}
              <button
                onClick={signOut}
                title='Sign Out'
                className='text-red-500 hover:text-red-700 transition-colors cursor-pointer'
              >
                <LogOut className='w-6 h-6' />
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

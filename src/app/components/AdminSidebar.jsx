'use client' // Add this to indicate client-side only code

import React from 'react';
import { Home, Users, FileText, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Next.js useRouter
import Image from 'next/image'; // Next.js image component

import logo from '../images/executivesdiary-logo-beta.png'; // ✅ import logo
import Link from 'next/link';

const AdminSidebar = ({ user }) => {
  const router = useRouter();

  const signOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    router.push('/login');
  };

  const adminMenuItems = [
    { id: 'home', name: 'Home', icon: Home, link: '/AdminDashboard/' },
    { id: 'contributors', name: 'Contributors', icon: Users, link: '/AdminDashboard/Contributors' },
    { id: 'biographies', name: 'Biographies', icon: FileText, link: '/AdminDashboard/Biographies' },
  ];

  const contributorMenuItems = [
    { id: 'home', name: 'Home', icon: Home, link: '/AdminDashboard/' },
    { id: 'executives', name: 'Executives', icon: UserCheck, link: '/AdminDashboard/Executives' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : contributorMenuItems;

  return (
    <div className="bg-white w-64 shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-4 pb-3 flex justify-center border-b border-gray-200">
        <a
          href="/"
          rel="noopener noreferrer"
        >
          <Image
            src={logo}
            alt="Executives Diary Logo"
            className="h-12 object-contain"
            width={150}
            height={48}
          />
        </a>

      </div>

      {/* Menu */}
      <nav className="flex-1 mt-6 px-3 pt-5">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.link}
                className={`${item.link === item.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group w-full flex items-center pl-2 pr-2 py-2 text-sm font-medium border-l-4 transition-colors duration-150 ease-in-out`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer (if needed, you can add it) */}
      {/* You can add the logout button or footer links here */}
      <button
        onClick={signOut}
        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 mt-4"
      >
        Sign Out
      </button>
    </div>
  );
};

export default AdminSidebar;

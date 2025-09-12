'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon, EyeIcon, HomeIcon } from '@heroicons/react/24/outline';
import DiaryClosed from '../(site)/Diaries/[id]/page';

export default function Header({ userRole: roleProp }) {
  const router = useRouter();
  const params = useParams();
  const urlExecId = params?.id; // when on /ClientDashboard/[id]/...

  // env + token
  const API_BASE = (process.env.NEXT_PUBLIC_API_DOMAIN || '').replace(/\/$/, '');
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // role (prop wins; else localStorage)
  const role = useMemo(() => {
    if (roleProp) return String(roleProp).toLowerCase();
    if (typeof window === 'undefined') return '';
    return String(
      localStorage.getItem('userRole') || localStorage.getItem('role') || ''
    ).toLowerCase();
  }, [roleProp]);

  // executive basics
  const [execName, setExecName] = useState('');
  const [execRole, setExecRole] = useState('Executive');
  const [execAvatar, setExecAvatar] = useState(null);

  // Load executive profile only if role is executive
  useEffect(() => {
    if (role !== 'executive' || !token) return;

    const execId =
      urlExecId ||
      (typeof window !== 'undefined' ? localStorage.getItem('executiveId') : null);

    if (!execId) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/executives/${execId}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Failed to load executive');

        const d = json?.data ?? json;
        const nameFromApi =
          d?.diary_title ||
          `${d?.user_first_name ?? ''} ${d?.user_last_name ?? ''}`.trim() ||
          d?.user_email ||
          '';
        setExecName(nameFromApi);
        setExecAvatar(d?.picture || null);
        setExecRole('Executive');
      } catch {
        // graceful fallback
        const fallbackName =
          (typeof window !== 'undefined' && localStorage.getItem('username')) || 'User';
        setExecName(fallbackName);
        setExecAvatar(null);
        setExecRole('Executive');
      }
    })();
  }, [role, token, API_BASE, urlExecId]);

  const handleHome = () => {
    router.push('/AdminDashboard/Executives');
  };

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('role');
        // keep/clear any other auth keys your app uses
      }
    } finally {
      router.replace('/login');
    }
  };

  // helper for initial letter circle when no avatar
  const Initial = ({ name }) => {
    const ch = (name || 'U').trim().charAt(0).toUpperCase();
    return (
      <div className="w-11 h-11 rounded-full bg-violet-600 text-white grid place-items-center text-lg font-semibold">
        {ch}
      </div>
    );
  };

  const isExec = role === 'executive';
  const isBackOffice = role === 'admin' || role === 'contributor';

  return (
    <header className="bg-[#2F353C] text-white">
      <nav className="px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-white">Executive Diary</span>

          <div className="hidden md:flex items-center space-x-6">
            {/* Preview link - always visible */}
 {/* Preview link - all roles */}
{urlExecId && (
  <a
    href={`/Diaries/${urlExecId}?showRecommendations=false`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 border-r border-gray-600 pr-3 hover:text-gray-300"
  >
    <EyeIcon className="w-5 h-5" />
    <span>Preview my Executive Diary</span>
  </a>
)}


            {/* Home (only admin/contributor) */}
            {isBackOffice && (
              <button
                className="flex items-center space-x-2 border-r border-gray-600 pr-3 hover:text-gray-300"
                onClick={handleHome}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </button>
            )}

            {/* Logout (only executive) */}
            {isExec && (
              <button
                className="flex items-center space-x-2 border-r border-gray-600 pr-3 hover:text-gray-300 font-semibold"
                onClick={handleLogout}
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-400" />
                <span className="text-white">Logout</span>
              </button>
            )}

            {/* Profile (only executive) */}
            {isExec && (
              <div className="flex items-center space-x-3">
                {execAvatar ? (
                  <Image
                    src={execAvatar}
                    alt="Profile"
                    width={44}
                    height={44}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Initial name={execName} />
                )}
                <div className="leading-tight">
                  <div className="font-semibold text-white truncate max-w-[180px]">
                    {execName || 'User'}
                  </div>
                  <div className="text-sm text-gray-300">{execRole}</div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu icon (kept as-is) */}
          <button className="md:hidden text-white">
            <i className="fas fa-bars" />
          </button>
        </div>
      </nav>
    </header>
  );
}

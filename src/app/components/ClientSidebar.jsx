'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  HomeIcon, IdentificationIcon, BookOpenIcon, DocumentTextIcon,
  PhotoIcon, AcademicCapIcon, UsersIcon, KeyIcon, CogIcon,
} from '@heroicons/react/24/outline';
import { useMemo } from 'react';

export default function ClientSidebar({ userRole: roleProp }) {
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id;

  // Prefer prop, else read from localStorage (client only)
  const role = useMemo(() => {
    if (roleProp) return String(roleProp).toLowerCase();
    if (typeof window === 'undefined') return '';
    return String(localStorage.getItem('userRole') || localStorage.getItem('role') || '').toLowerCase();
  }, [roleProp]);

  const showChangePassword = role === 'executive'; // only executives see it

  const base = id ? `/ClientDashboard/${id}` : `/ClientDashboard`;

  const sectionsBase = [
    // { icon: HomeIcon, label: 'Home', segment: '' },
    { icon: IdentificationIcon, label: 'Social Card', segment: 'SocialCard' },
    { icon: BookOpenIcon, label: 'Diary Cover', segment: 'DiaryCover' },
    { icon: DocumentTextIcon, label: 'My Story', segment: 'MyStory' },
    { icon: PhotoIcon, label: 'Social Posts', segment: 'SocialPost' },
    { icon: UsersIcon, label: 'Recommendations', segment: 'Recommendation' },
    // Change Password is appended conditionally below
    { icon: CogIcon, label: 'Setting', segment: 'Setting' },
  ];

  const sections = showChangePassword
    ? [
      ...sectionsBase.slice(0, 6), // up to Recommendations
      { icon: KeyIcon, label: 'Change Password', segment: 'ChangePassword' },
      ...sectionsBase.slice(6),    // Settings
    ]
    : sectionsBase;

  const menuItems = sections.map(s => ({
    ...s,
    href: s.segment ? `${base}/${s.segment}` : base,
  }));

  const activeHref =
    menuItems
      .map(m => m.href)
      .filter(h => pathname === h || pathname.startsWith(h + '/'))
      .sort((a, b) => b.length - a.length)[0] || null;

  return (
    <aside className="w-20 bg-slate-800 h-screen overflow-visible relative z-[60]">
      <ul className="space-y-0">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = item.href === activeHref || pathname === item.href;

          return (
            <li key={i} className="relative group">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex items-center h-16 text-white transition-all duration-300 ease-in-out relative border-b border-slate-700',
                  isActive ? 'bg-emerald-600' : 'hover:bg-emerald-500',
                ].join(' ')}
              >
                <div className="w-20 flex justify-center items-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Hover label */}
                <div className="absolute left-20 top-0 h-16 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-x-4 group-hover:translate-x-0 pointer-events-none flex items-center px-6 whitespace-nowrap z-[9999] shadow-lg">
                  <span className="font-medium text-lg tracking-wide uppercase text-white">
                    {item.label}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LOGIN_ROUTES = {
  default: '/AdminDashboard',
  admin: '/AdminDashboard',
  executive: '/ExecutiveDashboard',
};

export default function Login() {
  const router = useRouter();

  // UI state
  const [showOtherUserEmail, setShowOtherUserEmail] = useState(false);

  // Logic state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otherEmail, setOtherEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const API_BASE = (process.env.NEXT_PUBLIC_API_DOMAIN || '').replace(/\/$/, '');

  const toAbsoluteUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('blob:')) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErr('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...(showOtherUserEmail && otherEmail ? { other_email: otherEmail } : {}),
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.status_code !== 200) {
        const msg = json?.message || 'Login failed';
        throw new Error(msg);
      }

      const { token, user } = json.data || {};
      const normalizedUser = {
        ...user,
        profile_picture: toAbsoluteUrl(user?.profile_picture),
      };

      localStorage.setItem('authToken', token || '');
      localStorage.setItem('authUser', JSON.stringify(normalizedUser));

      const role = (normalizedUser?.role || 'default').toLowerCase();
      const route = LOGIN_ROUTES[role] || LOGIN_ROUTES.default;
      router.push(route);
    } catch (e) {
      setErr(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT: side container - Hidden on small screens */}
      <div
        className="hidden lg:flex w-2/3 bg-cover bg-center relative p-5"
        style={{
          backgroundImage:
            "url('https://www.executivesdiary.com/images/content/admin-login-page.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-0" />

        {/* Text aligned to bottom-left */}
        <div className="relative z-10 text-white px-10 lg:px-16 py-8 flex flex-col justify-center h-full">
          <div>
            <h1 className="text-[48px] font-semibold leading-tight mb-2">
              LOGIN <br />
              EXECUTIVES DIARY
            </h1>
            <p className="text-base font-normal text-white/90">Executives Diary</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Form container */}
      <div className="flex w-full lg:w-1/3 items-center justify-center p-5 bg-white">
        <div className="w-full max-w-md">
          {/* Logo + heading */}
          <div className="text-center mb-14">
            <img
              src="https://www.executivesdiary.com/images/logo/executives-diary-logo.png"
              width={200}
              height={75}
              alt="executives diary"
              className="mx-auto"
            />
            <h4 className="text-gray-400 font-light text-xl mt-8">
              Login to Your Account
            </h4>
          </div>

          {/* Error */}
          {err && (
            <div className="my-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {err}
            </div>
          )}

          {/* Form */}
          <form className="my-5" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-0"
                // placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-0"
                // placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="mb-4 text-sm text-gray-700">
              <label className="inline-flex items-center gap-2">
                <span>Login to other user's diary?</span>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={showOtherUserEmail}
                  onChange={() => setShowOtherUserEmail((v) => !v)}
                />
              </label>

              {/* Forgot Password */}
              <div className="mt-1">
                <a
                  href="https://www.executivesdiary.com/admin/password/reset"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Forgot Password
                </a>
              </div>

              {/* Conditionally show User's email field */}
              {showOtherUserEmail && (
                <div className="mt-3">
                  <input
                    type="email"
                    name="otherUserEmail"
                    value={otherEmail}
                    onChange={(e) => setOtherEmail(e.target.value)}
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-0"
                    placeholder="User’s email"
                    autoComplete="off"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#1b0f3f] text-white text-[13px] font-bold uppercase px-10 py-[10px] rounded-[3px] transition duration-200
                  ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#1b0f3f] cursor-pointer'}`}
              >
                {loading ? 'Signing In…' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

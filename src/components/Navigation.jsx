'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav
        className="flex items-center justify-between px-8 py-4 mx-auto mt-4 max-w-7xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/80 shadow-2xl rounded-2xl border border-white/30 dark:border-white/10"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <Link href="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 drop-shadow-lg tracking-tight">
          MedMCQ
        </Link>
        <div className="flex space-x-6">
          <Link href="/dashboard" className="relative px-4 py-2 font-semibold text-gray-800 dark:text-white rounded-lg transition-all duration-200 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            Dashboard
          </Link>
          <Link href="/practice" className="relative px-4 py-2 font-semibold text-gray-800 dark:text-white rounded-lg transition-all duration-200 hover:bg-fuchsia-100/70 dark:hover:bg-fuchsia-900/40 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400">
            Practice
          </Link>
          <Link href="/about" className="relative px-4 py-2 font-semibold text-gray-800 dark:text-white rounded-lg transition-all duration-200 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            About
          </Link>
          <Link href="/contact" className="relative px-4 py-2 font-semibold text-gray-800 dark:text-white rounded-lg transition-all duration-200 hover:bg-cyan-100/70 dark:hover:bg-cyan-900/40 hover:text-cyan-700 dark:hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400">
            Contact
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:from-indigo-600 hover:to-cyan-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 font-semibold text-indigo-600 dark:text-indigo-300 hover:underline transition-colors duration-200">
                Sign In
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:from-indigo-600 hover:to-cyan-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation; 
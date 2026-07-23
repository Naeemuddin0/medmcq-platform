'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between px-8 py-4 mx-auto mt-4 max-w-7xl bg-white dark:bg-gray-900 shadow-md rounded-[6px] border border-gray-200 dark:border-gray-800">
        <Link href="/" className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Medita
        </Link>
        <div className="flex space-x-6 items-center">
          <Link href="/dashboard" className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200 rounded-[6px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Dashboard
          </Link>
          <Link href="/practice" className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200 rounded-[6px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Practice
          </Link>
          <Link href="/about" className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200 rounded-[6px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            About
          </Link>
          <Link href="/contact" className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200 rounded-[6px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Contact
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-[6px] font-bold shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 font-semibold text-gray-900 dark:text-white hover:underline transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-[6px] font-bold shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
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
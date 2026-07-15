'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/practice', label: 'Practice' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const Navigation = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-line bg-paper dark:border-white/10 dark:bg-[#10141a]">
      <nav className="mx-auto flex max-w-page items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-ink dark:text-white">
          MedMCQ
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink dark:text-white/60 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <button onClick={() => signOut()} className="btn-outline hidden text-sm sm:inline-flex">
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-ink-muted hover:text-ink dark:text-white/60 dark:hover:text-white sm:inline">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary hidden text-sm sm:inline-flex">
                Register
              </Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink dark:border-white/15 dark:text-white md:hidden"
          >
            <span className="sr-only">Menu</span>
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M0 1H18M0 7H18M0 13H18" stroke="currentColor" strokeWidth="1.5" /></svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-line px-6 py-4 dark:border-white/10 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-ink-muted hover:text-ink dark:text-white/60 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <button onClick={() => signOut()} className="btn-outline w-full text-sm">
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink-muted hover:text-ink dark:text-white/60 dark:hover:text-white">
                  Sign In
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;

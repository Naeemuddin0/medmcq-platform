import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-line dark:border-white/10">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-serif text-lg font-semibold text-ink dark:text-white">MedMCQ</span>
          <p className="mt-1 text-sm text-ink-muted dark:text-white/50">
            Structured MCQ practice for medical students.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted dark:text-white/50">
          <Link href="/practice" className="hover:text-ink dark:hover:text-white">Practice</Link>
          <Link href="/about" className="hover:text-ink dark:hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-ink dark:hover:text-white">Contact</Link>
        </nav>
        <p className="text-xs text-ink-faint dark:text-white/30">
          &copy; {new Date().getFullYear()} MedMCQ Platform
        </p>
      </div>
    </footer>
  );
}

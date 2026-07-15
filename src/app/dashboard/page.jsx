'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProgressBar from '../../components/ProgressBar';
import { subjects } from '../../lib/subjects';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchProgress() {
      setLoading(true);
      try {
        const res = await fetch('/api/progress', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setProgress(data.progress || {});
        }
      } catch (e) {
        // ignore
      }
      setLoading(false);
    }
    if (status === 'authenticated') fetchProgress();
  }, [status]);

  if (status === 'loading' || loading) {
    return <div className="px-6 py-16 text-center text-ink-muted dark:text-white/60">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-page px-6 py-16">
      <p className="eyebrow mb-3">Dashboard</p>
      <h1 className="font-serif text-3xl font-semibold text-ink dark:text-white">
        Welcome, {session?.user?.name || 'User'}
      </h1>
      <p className="mt-2 text-ink-muted dark:text-white/60">
        Here&rsquo;s where you stand across each subject.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const subjProgress = progress[subject.id] || { completed: 0, total: 0, correctCount: 0 };
          const percent = subjProgress.total ? Math.round((subjProgress.completed / subjProgress.total) * 100) : 0;
          const correctness = subjProgress.completed ? Math.round((subjProgress.correctCount / subjProgress.completed) * 100) : 0;
          let prep = 'Low';
          if (correctness >= 80) prep = 'High';
          else if (correctness >= 50) prep = 'Medium';

          return (
            <Link
              key={subject.id}
              href={`/practice/${subject.id}`}
              className="card flex flex-col gap-3 border-l-[3px] p-5 transition-colors hover:bg-paper-dim dark:hover:bg-white/[0.06]"
              style={{ borderLeftColor: subject.color }}
            >
              <h3 className="font-serif text-lg font-semibold text-ink dark:text-white">
                {subject.name}
              </h3>
              <div className="text-sm text-ink-muted dark:text-white/60">
                {subjProgress.completed} / {subjProgress.total || '—'} completed
              </div>
              <ProgressBar progress={percent} color={subject.color} />
              <div className="flex items-center justify-between text-sm text-ink-muted dark:text-white/60">
                <span>{percent}% complete</span>
                <span>{correctness}% correct</span>
              </div>
              <span className="text-sm font-medium" style={{ color: subject.color }}>
                Preparation: {prep}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

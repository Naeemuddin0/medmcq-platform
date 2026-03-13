'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const subjects = [
  { id: 'Anatomy', name: 'Anatomy', accent: 'border-blue-400 shadow-blue-200' },
  { id: 'Physiology', name: 'Physiology', accent: 'border-green-400 shadow-green-200' },
  { id: 'Biochemistry', name: 'Biochemistry', accent: 'border-yellow-400 shadow-yellow-200' },
  { id: 'Pathology', name: 'Pathology', accent: 'border-red-400 shadow-red-200' },
  { id: 'Microbiology', name: 'Microbiology', accent: 'border-purple-400 shadow-purple-200' },
  { id: 'Pharmacology', name: 'Pharmacology', accent: 'border-pink-400 shadow-pink-200' }
];

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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-indigo-100/60 to-cyan-50/40 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome, {session?.user?.name || 'User'}
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {subjects.map((subject) => {
            const subjProgress = progress[subject.id] || { completed: 0, total: 0, correctCount: 0 };
            const percent = subjProgress.total ? Math.round((subjProgress.completed / subjProgress.total) * 100) : 0;
            const correctness = subjProgress.completed ? Math.round((subjProgress.correctCount / subjProgress.completed) * 100) : 0;
            let prep = 'Low';
            if (correctness >= 80) prep = 'High';
            else if (correctness >= 50) prep = 'Medium';
            return (
              <div
                key={subject.id}
                className={
                  `backdrop-blur-xl shadow-2xl rounded-2xl p-6 mb-4 transition-transform duration-200 hover:scale-105 border-2 ${subject.accent}`
                }
                style={{
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.14)',
                  borderWidth: '2px',
                  background: `linear-gradient(135deg, ${
                    subject.id === 'Anatomy' ? 'rgba(99,102,241,0.18),rgba(6,182,212,0.10)' :
                    subject.id === 'Physiology' ? 'rgba(16,185,129,0.18),rgba(59,130,246,0.10)' :
                    subject.id === 'Biochemistry' ? 'rgba(250,204,21,0.18),rgba(139,92,246,0.10)' :
                    subject.id === 'Pathology' ? 'rgba(239,68,68,0.18),rgba(59,130,246,0.10)' :
                    subject.id === 'Microbiology' ? 'rgba(168,85,247,0.18),rgba(6,182,212,0.10)' :
                    'rgba(99,102,241,0.18),rgba(6,182,212,0.10)'
                  })`,
                  backgroundBlendMode: 'overlay',
                }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 drop-shadow">{subject.name}</h3>
                <div className="text-gray-800 dark:text-white/90 mb-2">{subjProgress.completed} / {subjProgress.total} completed</div>
                <div className="w-full bg-gray-200 dark:bg-white/20 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="text-gray-700 dark:text-white/80 text-sm">{percent}% complete</div>
                <div className="text-gray-700 dark:text-white/80 text-sm">Correctness: {correctness}%</div>
                <div className="text-gray-700 dark:text-white/80 text-sm">Preparation: {prep}</div>
              </div>
            );
          })}
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Start Practicing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/practice/${subject.id}`}
              className={
                `rounded-2xl shadow-xl p-6 mb-4 transition-transform duration-200 hover:scale-105 ` +
                `glass-card`
              }
              style={{
                backdropFilter: 'blur(8px)',
                background: `linear-gradient(135deg, ${
                  subject.id === 'Anatomy' ? 'rgba(59,130,246,0.7),rgba(59,130,246,0.3)' :
                  subject.id === 'Physiology' ? 'rgba(34,197,94,0.7),rgba(34,197,94,0.3)' :
                  subject.id === 'Biochemistry' ? 'rgba(251,191,36,0.7),rgba(251,191,36,0.3)' :
                  subject.id === 'Pathology' ? 'rgba(239,68,68,0.7),rgba(239,68,68,0.3)' :
                  subject.id === 'Microbiology' ? 'rgba(168,85,247,0.7),rgba(168,85,247,0.3)' :
                  'rgba(236,72,153,0.7),rgba(236,72,153,0.3)'
                })`,
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
              }}
            >
              <h2 className="text-xl font-semibold text-white mb-2 drop-shadow">{subject.name}</h2>
              <p className="text-white/80">
                Start practicing {subject.name.toLowerCase()} questions
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const subjects = [
  { id: 'Anatomy', name: 'Anatomy', border: 'border-blue-500' },
  { id: 'Physiology', name: 'Physiology', border: 'border-green-500' },
  { id: 'Biochemistry', name: 'Biochemistry', border: 'border-yellow-500' },
  { id: 'Pathology', name: 'Pathology', border: 'border-red-500' },
  { id: 'Microbiology', name: 'Microbiology', border: 'border-purple-500' },
  { id: 'Pharmacology', name: 'Pharmacology', border: 'border-pink-500' }
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
    return <div className="p-8 font-semibold text-gray-700">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">
          Welcome, {session?.user?.name || 'User'}
        </h1>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Progress</h2>
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
                className={`bg-white dark:bg-gray-800 rounded-[6px] p-6 transition-transform hover:-translate-y-1 shadow-sm border-l-4 ${subject.border} border-y border-r border-gray-200 dark:border-gray-700`}
              >
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{subject.name}</h3>
                <div className="text-gray-700 dark:text-gray-300 mb-2 font-medium">{subjProgress.completed} / {subjProgress.total} completed</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-[6px] h-2 mb-2 border border-gray-300 dark:border-gray-600">
                  <div className="bg-gray-800 dark:bg-gray-200 h-2 rounded-[6px]" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-semibold">{percent}% complete</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Correctness: {correctness}%</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Preparation: {prep}</div>
              </div>
            );
          })}
        </div>
        
        <div className="mb-6">
          <Link
            href="/dashboard/ai-quiz"
            className="block bg-gray-900 dark:bg-gray-800 rounded-[6px] p-8 transition-colors hover:bg-gray-800 dark:hover:bg-gray-700 border border-transparent dark:border-gray-600 shadow-sm text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-2">AI Quiz Builder</h2>
                <p className="text-gray-300 text-lg font-medium">
                  Upload your own medical PDFs or clinical images and generate custom MCQs instantly.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mb-10">
          <Link
            href="/dashboard/analytics"
            className="block bg-white dark:bg-gray-800 rounded-[6px] p-8 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm text-gray-900 dark:text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-2">Performance Analytics & AI Insights</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  View your subject accuracy and get a personalized AI study plan.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Start Practicing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/practice/${subject.id}`}
              className={`bg-white dark:bg-gray-800 rounded-[6px] shadow-sm p-6 transition-transform hover:-translate-y-1 border-l-4 ${subject.border} border-y border-r border-gray-200 dark:border-gray-700`}
            >
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">{subject.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Start practicing {subject.name.toLowerCase()} questions
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
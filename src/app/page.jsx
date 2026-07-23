'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gray-900 dark:bg-black text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Master Medical MCQs with AI
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300">
            Your professional platform for comprehensive medical question practice.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/practice" className="px-8 py-4 bg-white text-gray-900 rounded-[6px] text-lg font-bold hover:bg-gray-100 transition-colors">
              Start Practicing
            </Link>
            <Link href="/register" className="px-8 py-4 border-2 border-gray-600 text-white rounded-[6px] text-lg font-bold hover:border-gray-400 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white dark:bg-gray-900 rounded-[6px] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Adaptive Engine</h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI-driven question selection tailored strictly to your weaknesses for efficient learning.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-gray-900 rounded-[6px] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Deep Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track progress with high-contrast visualizations and AI-generated study plans.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-gray-900 rounded-[6px] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Vignette Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload clinical images or notes. Our multimodal AI instantly generates accurate MCQs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 
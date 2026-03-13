'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-100/60 to-cyan-50/40 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-down">
            Master Medical MCQs with AI
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fade-in-up">
            Your personalized platform for comprehensive medical question practice.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-scale-in">
            <Link href="/practice" className="px-8 py-4 bg-white text-indigo-700 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              Start Practicing
            </Link>
            <Link href="/register" className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-700 transform hover:scale-105 transition-all duration-300">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 dark:border-indigo-900">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Smart Recommendations</h3>
            <p className="text-gray-600 dark:text-gray-300">
              AI-driven question selection tailored to your weaknesses for efficient learning.
            </p>
          </div>
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 dark:border-indigo-900">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Detailed Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track progress with interactive visualizations to identify strengths and gaps.
            </p>
          </div>
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 dark:border-indigo-900">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Comprehensive Library</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access 20,000+ questions from trusted medical textbooks for thorough preparation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 
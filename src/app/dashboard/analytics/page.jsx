'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-xl animate-pulse">Loading AI Insights & Analytics...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Error: {error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 pt-24 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Performance Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300 font-medium mt-2">Track your progress and get personalized AI study recommendations.</p>
        </div>
        <Link href="/dashboard" className="text-gray-900 dark:text-white hover:underline font-bold">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Statistics Panel */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-[6px] p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-black mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">Subject Accuracy</h2>
          <div className="space-y-6">
            {data.stats.map(stat => (
              <div key={stat.subject}>
                <div className="flex justify-between mb-1 text-sm font-bold">
                  <span className="text-gray-900 dark:text-white">{stat.subject}</span>
                  <span className={stat.accuracy < 50 ? 'text-red-600 dark:text-red-400' : stat.accuracy < 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}>
                    {stat.accuracy}% ({stat.correct}/{stat.completed})
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-[6px] h-2.5 border border-gray-300 dark:border-gray-600">
                  <div 
                    className={`h-2.5 rounded-[6px] ${stat.accuracy < 50 ? 'bg-red-500' : stat.accuracy < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${stat.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Study Plan Panel */}
        <div className="bg-gray-900 dark:bg-gray-800 shadow-sm rounded-[6px] p-6 border border-gray-900 dark:border-gray-700 flex flex-col text-white">
          <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
            <span className="text-3xl mr-3">🧠</span>
            <h2 className="text-xl font-black text-white">AI Study Plan</h2>
          </div>
          
          <div className="flex-1 bg-gray-800 dark:bg-gray-900 p-5 rounded-[6px] border border-gray-700">
            <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-line leading-relaxed font-medium">
              {data.studyPlan}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center text-sm font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-3 rounded-[6px]">
            <span>Overall Accuracy: {data.overallAccuracy}%</span>
            <span>Total Answered: {data.totalQuestionsAnswered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

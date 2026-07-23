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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-2">Track your progress and get personalized AI study recommendations.</p>
        </div>
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-semibold">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Statistics Panel */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">Subject Accuracy</h2>
          <div className="space-y-6">
            {data.stats.map(stat => (
              <div key={stat.subject}>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span className="text-gray-700">{stat.subject}</span>
                  <span className={stat.accuracy < 50 ? 'text-red-500' : stat.accuracy < 80 ? 'text-yellow-600' : 'text-green-600'}>
                    {stat.accuracy}% ({stat.correct}/{stat.completed})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${stat.accuracy < 50 ? 'bg-red-500' : stat.accuracy < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${stat.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Study Plan Panel */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg rounded-xl p-6 border border-indigo-100 flex flex-col">
          <div className="flex items-center mb-6 border-b border-indigo-200 pb-4">
            <span className="text-3xl mr-3">🧠</span>
            <h2 className="text-xl font-semibold text-indigo-900">AI Study Plan</h2>
          </div>
          
          <div className="flex-1 bg-white/60 p-5 rounded-lg border border-indigo-50">
            <div className="prose prose-indigo max-w-none text-gray-800 whitespace-pre-line leading-relaxed">
              {data.studyPlan}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center text-sm font-medium text-indigo-800 bg-white/80 p-3 rounded-lg">
            <span>Overall Accuracy: {data.overallAccuracy}%</span>
            <span>Total Answered: {data.totalQuestionsAnswered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

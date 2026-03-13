import Link from 'next/link';

const subjects = [
  { id: 'Anatomy', name: 'Anatomy', accent: 'border-blue-400 shadow-blue-200' },
  { id: 'Physiology', name: 'Physiology', accent: 'border-green-400 shadow-green-200' },
  { id: 'Biochemistry', name: 'Biochemistry', accent: 'border-yellow-400 shadow-yellow-200' },
  { id: 'Pathology', name: 'Pathology', accent: 'border-red-400 shadow-red-200' },
  { id: 'Microbiology', name: 'Microbiology', accent: 'border-purple-400 shadow-purple-200' },
  { id: 'Pharmacology', name: 'Pharmacology', accent: 'border-pink-400 shadow-pink-200' }
];

export default function PracticeLanding() {
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-indigo-100/60 to-cyan-50/40 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Select a Subject to Practice
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/practice/${subject.id}`}
              className={`rounded-2xl p-6 mb-4 transition-transform duration-200 hover:scale-105 backdrop-blur-xl border-2 ${subject.accent} shadow-2xl`}
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
              <h2 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">{subject.name}</h2>
              <p className="text-white/90">
                Start practicing {subject.name.toLowerCase()} questions
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 
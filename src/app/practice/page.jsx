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
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">
          Select a Subject to Practice
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/practice/${subject.id}`}
              className="rounded-[6px] p-6 mb-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-colors shadow-sm block group"
            >
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">{subject.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 font-bold group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Start practicing {subject.name.toLowerCase()} questions &rarr;
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 
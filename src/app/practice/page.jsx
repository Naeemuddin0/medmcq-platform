import SubjectCard from '../../components/SubjectCard';
import { subjects } from '../../lib/subjects';

export default function PracticeLanding() {
  return (
    <div className="mx-auto max-w-page px-6 py-16">
      <p className="eyebrow mb-3">Practice</p>
      <h1 className="font-serif text-3xl font-semibold text-ink dark:text-white">
        Select a subject
      </h1>
      <p className="mt-2 max-w-xl text-ink-muted dark:text-white/60">
        Pick a subject below to begin. Your progress is saved automatically as you go.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}

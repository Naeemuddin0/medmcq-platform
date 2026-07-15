import Link from 'next/link';

export default function SubjectCard({ subject, description, stat }) {
  return (
    <Link
      href={`/practice/${subject.id}`}
      className="card group flex flex-col gap-3 border-l-[3px] p-5 transition-colors hover:bg-paper-dim dark:hover:bg-white/[0.06]"
      style={{ borderLeftColor: subject.color }}
    >
      <h3 className="font-serif text-lg font-semibold text-ink dark:text-white">
        {subject.name}
      </h3>
      <p className="text-sm text-ink-muted dark:text-white/60">
        {description || `Practice ${subject.name.toLowerCase()} questions.`}
      </p>
      {stat && <div className="mt-1">{stat}</div>}
      <span
        className="mt-1 text-sm font-medium group-hover:underline"
        style={{ color: subject.color }}
      >
        Practice &rarr;
      </span>
    </Link>
  );
}

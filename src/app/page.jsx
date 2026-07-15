import Link from 'next/link';

const features = [
  {
    title: 'Subject-by-subject practice',
    body: 'Work through Anatomy, Physiology, Biochemistry, Pathology, Microbiology and Pharmacology at your own pace.',
  },
  {
    title: 'Progress that persists',
    body: 'Every answer is recorded, so you can pick up exactly where you left off and see how each subject is trending.',
  },
  {
    title: 'A 20,000+ question library',
    body: 'Questions drawn from standard medical references, each with a written explanation for the correct answer.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="border-b border-line px-6 py-20 dark:border-white/10 sm:py-28">
        <div className="mx-auto max-w-page">
          <p className="eyebrow mb-4">Medical MCQ practice</p>
          <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-ink dark:text-white sm:text-5xl">
            Practice built for how medical exams are actually structured.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted dark:text-white/60">
            Track your accuracy subject by subject, revisit what you got wrong, and know exactly
            where you stand before test day.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/practice" className="btn-primary">
              Start Practicing
            </Link>
            <Link href="/register" className="btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-page gap-10 sm:grid-cols-3">
          {features.map((feature, i) => (
            <div key={feature.title} className="border-t-2 border-accent pt-5">
              <span className="text-xs font-semibold text-ink-faint dark:text-white/30">
                0{i + 1}
              </span>
              <h3 className="mt-2 font-serif text-lg font-semibold text-ink dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-white/60">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import React from 'react';

const team = [
  {
    name: 'Naeem Ud Din',
    role: 'Full Stack Data Scientist',
    img: '/team-naeem.jpeg',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow mb-3">About</p>
      <h1 className="font-serif text-3xl font-semibold text-ink dark:text-white">
        A focused way to prepare for medical exams
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted dark:text-white/70">
        MedMCQ Platform is a medical MCQ practice and progress-tracking tool. Our goal is to
        help medical students prepare for exams and build knowledge using clear, data-driven
        feedback rather than guesswork.
      </p>
      <p className="mt-4 leading-relaxed text-ink-muted dark:text-white/70">
        The platform tracks completion and accuracy per subject so you always know where you
        stand, and where to focus next.
      </p>

      <h2 className="mt-14 font-serif text-xl font-semibold text-ink dark:text-white">Our Team</h2>
      <div className="mt-6 flex flex-wrap gap-6">
        {team.map((member) => (
          <div key={member.name} className="card flex w-64 flex-col items-center p-6 text-center">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border border-line dark:border-white/10">
              <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
            </div>
            <div className="font-serif text-lg font-semibold text-ink dark:text-white">{member.name}</div>
            <div className="mt-1 text-sm text-accent dark:text-emerald-400">{member.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

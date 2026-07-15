'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProgressBar from '../../../components/ProgressBar';

const subjects = {
  Anatomy: 'Anatomy',
  Physiology: 'Physiology',
  Biochemistry: 'Biochemistry',
  Pathology: 'Pathology',
  Microbiology: 'Microbiology',
  Pharmacology: 'Pharmacology'
};

export default function SubjectPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const subject = params.subject;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (subject && session) {
      fetchQuestion();
    }
  }, [subject, session]);

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/practice?subject=${subject}`);
      const data = await response.json();

      if (response.ok) {
        if (data.completed) {
          setQuestion(null);
          setError('You have completed all questions for this subject.');
        } else {
          setQuestion(data.question);
          setProgress(data.progress);
          setTotal(data.total);
          setSelectedAnswer('');
          setShowExplanation(false);
          setIsCorrect(null);
        }
      } else {
        setError(data.error || 'Failed to fetch question');
      }
    } catch (error) {
      setError('An error occurred while fetching the question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (showExplanation) return;

    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.id,
          subject,
          isCorrect: correct,
        }),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleNext = () => {
    fetchQuestion();
  };

  const handleReset = async () => {
    try {
      const response = await fetch('/api/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject }),
      });

      if (response.ok) {
        fetchQuestion();
      } else {
        setError('Failed to reset progress');
      }
    } catch (error) {
      setError('An error occurred while resetting progress');
    }
  };

  if (status === 'loading' || isLoading) {
    return <div className="px-6 py-16 text-center text-ink-muted dark:text-white/60">Loading...</div>;
  }

  if (!subject || !subjects[subject]) {
    return <div className="px-6 py-16 text-center text-ink-muted dark:text-white/60">Invalid subject</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <button
        className="mb-6 text-sm font-medium text-ink-muted hover:text-ink dark:text-white/60 dark:hover:text-white"
        onClick={() => {
          router.push('/dashboard');
          setTimeout(() => window.location.reload(), 100);
        }}
      >
        &larr; Back to Subjects
      </button>

      <p className="eyebrow mb-2">Practice</p>
      <h1 className="font-serif text-3xl font-semibold text-ink dark:text-white">
        {subjects[subject]}
      </h1>

      <div className="mt-8">
        <ProgressBar progress={total ? (progress / total) * 100 : 0} />
        <div className="mt-2 flex items-center justify-between text-sm text-ink-muted dark:text-white/60">
          <span>Question {progress + 1} of {total}</span>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to reset your progress for this subject?')) {
                await handleReset();
              }
            }}
            className="font-medium text-red-700 hover:underline dark:text-red-400"
          >
            Reset progress
          </button>
        </div>
      </div>

      {error ? (
        <div className="card mt-8 border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      ) : question ? (
        <div className="card mt-8 p-6">
          <p className="mb-6 text-lg text-ink dark:text-white">{question.text}</p>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full rounded-md border p-4 text-left font-medium text-ink transition-colors dark:text-white ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
                      : 'border-red-600 bg-red-50 dark:bg-red-900/30'
                    : 'border-line hover:border-accent dark:border-white/15'
                }`}
                disabled={showExplanation}
              >
                {option}
              </button>
            ))}
          </div>

          {!showExplanation && (
            <button onClick={handleNext} className="btn-outline mt-5">
              Skip
            </button>
          )}

          {showExplanation && (
            <div className="mt-6 rounded-md bg-paper-dim p-4 dark:bg-white/5">
              <p className="mb-2 font-semibold text-ink dark:text-white">Explanation</p>
              <p className="text-ink-muted dark:text-white/70">{question.explanation}</p>
              <button onClick={handleNext} className="btn-primary mt-4">
                Next Question
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

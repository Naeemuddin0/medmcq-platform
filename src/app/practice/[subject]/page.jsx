'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProgressBar from '../../../components/ProgressBar';
import Link from 'next/link';

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
    return <div>Loading...</div>;
  }

  if (!subject || !subjects[subject]) {
    return <div>Invalid subject</div>;
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-indigo-100/60 to-cyan-50/40 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            onClick={() => {
              router.push('/dashboard');
              setTimeout(() => window.location.reload(), 100);
            }}
          >
            ← Back to Subjects
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {subjects[subject]} Practice
        </h1>

        <div className="mb-8">
          <ProgressBar progress={(progress / total) * 100} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Question {progress + 1} of {total}
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to reset your progress for this subject?')) {
                await handleReset();
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Reset Progress
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : question ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-lg mb-6">{question.text}</p>
            
            <div className="space-y-4">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/50'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-500'
                  }`}
                  disabled={showExplanation}
                >
                  {option}
                </button>
              ))}
            </div>

            {!showExplanation && (
              <button
                onClick={handleNext}
                className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
              >
                Skip
              </button>
            )}

            {showExplanation && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="font-semibold mb-2">Explanation:</p>
                <p>{question.explanation}</p>
                <button
                  onClick={handleNext}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
} 
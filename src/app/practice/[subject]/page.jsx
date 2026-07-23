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
  const [isAdaptiveMode, setIsAdaptiveMode] = useState(false);
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
  }, [subject, session, isAdaptiveMode]);

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/practice?subject=${subject}&adaptive=${isAdaptiveMode}`);
      const data = await response.json();

      if (response.ok) {
        if (data.completed) {
          setQuestion(null);
          setError('You have completed all questions for this subject in the current mode.');
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
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <button
            className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-[6px] font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            onClick={() => {
              router.push('/dashboard');
              setTimeout(() => window.location.reload(), 100);
            }}
          >
            ← Back to Subjects
          </button>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {subjects[subject]} Practice
          </h1>
          <button
            onClick={() => {
              setError('');
              setIsAdaptiveMode(!isAdaptiveMode);
            }}
            className={`px-4 py-2 rounded-[6px] font-bold transition-colors shadow-sm flex items-center ${isAdaptiveMode ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600'}`}
          >
            {isAdaptiveMode ? '🧠 Adaptive Mode: ON' : 'Adaptive Mode: OFF'}
          </button>
        </div>

        <div className="mb-8">
          <ProgressBar progress={(progress / total) * 100} />
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-2">
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
            className="bg-red-600 text-white px-4 py-2 rounded-[6px] font-bold hover:bg-red-700 transition-colors"
          >
            Reset Progress
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-[6px] border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
          </div>
        ) : question ? (
          <div className="bg-white dark:bg-gray-800 rounded-[6px] shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">{question.text}</p>
            
            <div className="space-y-4">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-[6px] border-2 transition-colors duration-200 text-gray-900 dark:text-white font-bold ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/50'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 bg-white dark:bg-gray-800'
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
                className="mt-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold px-6 py-2 rounded-[6px] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
              >
                Skip
              </button>
            )}

            {showExplanation && (
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[6px]">
                <p className="font-black text-gray-900 dark:text-white mb-2">Explanation:</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-6">{question.explanation}</p>
                <button
                  onClick={handleNext}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-6 py-2 rounded-[6px] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
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
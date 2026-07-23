'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function QuizPlayer({ quiz }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Fallback in case quiz has no questions
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="p-8 text-center">This quiz has no questions.</div>;
  }

  const currentQ = quiz.questions[currentQuestionIdx];

  const handleSelect = (optionKey) => {
    if (showExplanation) return;
    setSelectedAnswer(optionKey);
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore((s) => s + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
          <p className="text-xl mb-6">You scored {score} out of {quiz.questions.length}</p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard/ai-quiz" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Create Another Quiz
            </Link>
            <Link href="/dashboard" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
        <span className="text-gray-500 font-medium">Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">{currentQ.question}</h2>
        
        <div className="space-y-3">
          {Object.entries(currentQ.options).map(([key, value]) => {
            let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
            
            if (showExplanation) {
              if (key === currentQ.correctAnswer) {
                btnClass += "bg-green-100 border-green-500 text-green-900";
              } else if (key === selectedAnswer) {
                btnClass += "bg-red-100 border-red-500 text-red-900";
              } else {
                btnClass += "border-gray-200 text-gray-500 opacity-50";
              }
            } else {
              if (key === selectedAnswer) {
                btnClass += "bg-blue-50 border-blue-500 text-blue-900";
              } else {
                btnClass += "border-gray-200 hover:border-blue-300 text-gray-700";
              }
            }

            return (
              <button 
                key={key} 
                className={btnClass}
                onClick={() => handleSelect(key)}
                disabled={showExplanation}
              >
                <span className="font-bold mr-2 uppercase">{key})</span> {value}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className={`p-6 rounded-lg mb-6 border-l-4 ${selectedAnswer === currentQ.correctAnswer ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <h3 className="font-bold mb-2 flex items-center">
            {selectedAnswer === currentQ.correctAnswer ? (
              <span className="text-green-700">✅ Correct!</span>
            ) : (
              <span className="text-red-700">❌ Incorrect</span>
            )}
          </h3>
          <p className="text-gray-800 whitespace-pre-line leading-relaxed">
            <span className="font-semibold block mb-1">Explanation:</span>
            {currentQ.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        {!showExplanation ? (
          <button 
            className={`px-8 py-3 rounded-md font-bold text-white shadow-sm transition-colors ${selectedAnswer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
            onClick={handleCheck}
            disabled={!selectedAnswer}
          >
            Check Answer
          </button>
        ) : (
          <button 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white shadow-sm transition-colors"
            onClick={handleNext}
          >
            {currentQuestionIdx < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function QuizPlayer({ quiz }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // AI Tutor State
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef(null);

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
      setIsTutorOpen(false);
      setChatMessages([]);
    } else {
      setFinished(true);
    }
  };

  const handleAskTutor = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isStreaming) return;

    const newMessage = { role: 'user', content: chatInput };
    const newChatHistory = [...chatMessages, newMessage];
    
    setChatMessages(newChatHistory);
    setChatInput('');
    setIsStreaming(true);

    try {
      // Add a temporary assistant message that will be updated
      setChatMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newChatHistory,
          context: {
            question: currentQ.question,
            options: Object.values(currentQ.options),
            correctAnswer: currentQ.correctAnswer,
            userSelected: selectedAnswer,
            explanation: currentQ.explanation
          }
        })
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamedResponse = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        streamedResponse += chunkValue;
        
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: streamedResponse };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  if (finished) {
    return (
    return (
      <div className="p-8 max-w-3xl mx-auto pt-24 min-h-screen">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-[6px] p-8 text-center">
          <h1 className="text-3xl font-black mb-4 text-gray-900 dark:text-white">Quiz Completed!</h1>
          <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">You scored {score} out of {quiz.questions.length}</p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard/ai-quiz" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-[6px] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Create Another Quiz
            </Link>
            <Link href="/dashboard" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-[6px] font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto pt-24 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{quiz.title}</h1>
        <span className="text-gray-500 font-bold">Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-[6px] p-6 mb-6">
        <h2 className="text-xl font-medium mb-6 text-gray-900 dark:text-white">{currentQ.question}</h2>
        
        <div className="space-y-3">
          {Object.entries(currentQ.options).map(([key, value]) => {
            let btnClass = "w-full text-left p-4 rounded-[6px] border-2 transition-colors font-bold ";
            
            if (showExplanation) {
              if (key === currentQ.correctAnswer) {
                btnClass += "bg-green-50 border-green-500 text-green-900 dark:bg-green-900/50 dark:text-white";
              } else if (key === selectedAnswer) {
                btnClass += "bg-red-50 border-red-500 text-red-900 dark:bg-red-900/50 dark:text-white";
              } else {
                btnClass += "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 opacity-50 bg-white dark:bg-gray-800";
              }
            } else {
              if (key === selectedAnswer) {
                btnClass += "bg-gray-100 border-gray-900 text-gray-900 dark:bg-gray-700 dark:border-white dark:text-white";
              } else {
                btnClass += "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800";
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
        <div className={`p-6 rounded-[6px] mb-6 border-l-4 shadow-sm ${selectedAnswer === currentQ.correctAnswer ? 'bg-green-50 border-green-500 dark:bg-green-900/50' : 'bg-red-50 border-red-500 dark:bg-red-900/50'}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg flex items-center">
              {selectedAnswer === currentQ.correctAnswer ? (
                <span className="text-green-700">✅ Correct!</span>
              ) : (
                <span className="text-red-700">❌ Incorrect</span>
              )}
            </h3>
            
            {!isTutorOpen && (
              <button 
                onClick={() => setIsTutorOpen(true)}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-[6px] text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm flex items-center"
              >
                <span>🧑‍⚕️ Ask AI Tutor</span>
              </button>
            )}
          </div>
          
          {!isTutorOpen ? (
             <p className="text-gray-900 dark:text-white whitespace-pre-line font-medium leading-relaxed">
               <span className="font-black block mb-1">Explanation:</span>
               {currentQ.explanation}
             </p>
          ) : (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-[6px] border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-96">
              <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 font-bold flex justify-between items-center">
                <span>Interactive AI Tutor (Socratic Mode)</span>
                <button onClick={() => setIsTutorOpen(false)} className="hover:opacity-70 text-xl leading-none">&times;</button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-4">
                <div className="flex w-full">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white p-3 rounded-[6px] rounded-tl-sm max-w-[85%] shadow-sm font-medium">
                    Hi! I'm your AI Medical Tutor. I'm here to help you reason through this question. What part of the explanation or options are you unsure about?
                  </div>
                </div>
                
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-[6px] max-w-[85%] shadow-sm whitespace-pre-wrap font-medium ${msg.role === 'user' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-tr-sm' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-tl-sm'}`}>
                      {msg.content || <span className="animate-pulse">Thinking...</span>}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              <form onSubmit={handleAskTutor} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isStreaming}
                  placeholder="Ask a question (e.g., Why is B wrong?)"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-[6px] focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isStreaming}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2 w-10 h-10 rounded-[6px] hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        {!showExplanation ? (
          <button 
            className={`px-8 py-3 rounded-[6px] font-bold text-white shadow-sm transition-colors ${selectedAnswer ? 'bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' : 'bg-gray-300 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'}`}
            onClick={handleCheck}
            disabled={!selectedAnswer}
          >
            Check Answer
          </button>
        ) : (
          <button 
            className="px-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-[6px] font-bold text-white shadow-sm transition-colors"
            onClick={handleNext}
          >
            {currentQuestionIdx < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}

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
        <div className={`p-6 rounded-lg mb-6 border-l-4 shadow-sm ${selectedAnswer === currentQ.correctAnswer ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
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
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition flex items-center shadow-md"
              >
                <span>🧑‍⚕️ Ask AI Tutor</span>
              </button>
            )}
          </div>
          
          {!isTutorOpen ? (
             <p className="text-gray-800 whitespace-pre-line leading-relaxed">
               <span className="font-semibold block mb-1">Explanation:</span>
               {currentQ.explanation}
             </p>
          ) : (
            <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-inner overflow-hidden flex flex-col h-96">
              <div className="bg-indigo-600 text-white px-4 py-3 font-semibold flex justify-between items-center">
                <span>Interactive AI Tutor (Socratic Mode)</span>
                <button onClick={() => setIsTutorOpen(false)} className="text-indigo-200 hover:text-white text-xl leading-none">&times;</button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                <div className="flex w-full">
                  <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                    Hi! I'm your AI Medical Tutor. I'm here to help you reason through this question. What part of the explanation or options are you unsure about?
                  </div>
                </div>
                
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                      {msg.content || <span className="animate-pulse">Thinking...</span>}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              <form onSubmit={handleAskTutor} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isStreaming}
                  placeholder="Ask a question (e.g., Why is B wrong?)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isStreaming}
                  className="bg-indigo-600 text-white p-2 w-10 h-10 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

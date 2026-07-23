'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AIQuizBuilder() {
  const [file, setFile] = useState(null);
  const [strategy, setStrategy] = useState('comprehensive');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('strategy', strategy);

    try {
      const res = await fetch('/api/ai-quiz/generate', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push(`/dashboard/ai-quiz/${data.quizId}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pt-24 min-h-screen">
      <h1 className="text-3xl font-black mb-6 text-gray-900 dark:text-white">AI Quiz Builder</h1>
      <p className="text-gray-600 dark:text-gray-300 font-medium mb-8">Upload a medical document (PDF, TXT, DOCX, or PPTX) and let AI generate a custom quiz for you.</p>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-[6px] p-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 font-bold p-4 rounded-[6px] mb-6 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Upload Document or Clinical Image (PDF, TXT, DOCX, PPTX, PNG, JPG)
          </label>
          <input 
            type="file" 
            accept=".pdf,.txt,.docx,.pptx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 dark:text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-[6px] file:border-0
              file:text-sm file:font-bold
              file:bg-gray-200 file:text-gray-900
              dark:file:bg-gray-700 dark:file:text-white
              hover:file:bg-gray-300 dark:hover:file:bg-gray-600 transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Quiz Coverage Strategy
          </label>
          <select 
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white sm:text-sm rounded-[6px]"
          >
            <option value="comprehensive">Comprehensive (Cover everything - ~10 questions)</option>
            <option value="high-yield">High Yield (Important concepts only - ~5 questions)</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-[6px] shadow-sm text-sm font-bold text-white ${loading ? 'bg-gray-400 dark:bg-gray-600' : 'bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'} transition-colors`}
        >
          {loading ? 'Analyzing & Generating Quiz...' : 'Generate AI Quiz'}
        </button>
      </form>
    </div>
  );
}

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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">AI Quiz Builder</h1>
      <p className="text-gray-600 mb-8">Upload a medical document (PDF, TXT, DOCX, or PPTX) and let AI generate a custom quiz for you.</p>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Document or Clinical Image (PDF, TXT, DOCX, PPTX, PNG, JPG)
          </label>
          <input 
            type="file" 
            accept=".pdf,.txt,.docx,.pptx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Coverage Strategy
          </label>
          <select 
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="comprehensive">Comprehensive (Cover everything - ~10 questions)</option>
            <option value="high-yield">High Yield (Important concepts only - ~5 questions)</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Analyzing & Generating Quiz...' : 'Generate AI Quiz'}
        </button>
      </form>
    </div>
  );
}

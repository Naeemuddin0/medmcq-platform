'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-[6px] shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Create Your Account</h1>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-900 dark:text-gray-300 font-bold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-[6px] border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-gray-900 dark:text-gray-300 font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-[6px] border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-gray-900 dark:text-gray-300 font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-[6px] border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-500 font-bold text-sm text-center">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-[6px] font-bold transition-colors ${
              isLoading
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-[6px] h-5 w-5 border-t-2 border-b-2 border-current"></div>
              </div>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700 dark:text-gray-400 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-gray-900 dark:text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
} 
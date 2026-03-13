'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('Failed to send message.');
      }
    } catch {
      setStatus('Failed to send message.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-indigo-100/60 to-cyan-50/40 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Have questions, feedback, or want to collaborate? Fill out the form below or email us directly.
        </p>
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-900/80 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-gray-800 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input className="shadow appearance-none border border-gray-300 dark:border-gray-700 rounded w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="name" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input className="shadow appearance-none border border-gray-300 dark:border-gray-700 rounded w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="email" type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea className="shadow appearance-none border border-gray-300 dark:border-gray-700 rounded w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="message" placeholder="Your Message" rows={4} value={message} onChange={e => setMessage(e.target.value)} required disabled={isLoading}></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-60" type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          {status && <div className="mt-4 text-center text-sm font-semibold text-blue-700 dark:text-blue-300">{status}</div>}
        </form>
        <div className="mt-8 text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-2">Our Team</h2>
          <ul className="list-disc pl-6">
            <li><strong>Naeem Ud Din</strong> – Data Scientist</li>
            <li><strong>Imran Nadeem</strong> – Data Analyst</li>
            <li><strong>Hassan Raza</strong> – Data Analyst</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
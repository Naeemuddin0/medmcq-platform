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
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Contact Us</h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300 font-medium">
          Have questions, feedback, or want to collaborate? Fill out the form below or email us directly.
        </p>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-sm rounded-[6px] px-8 pt-6 pb-8 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-gray-900 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input className="appearance-none border-2 border-gray-200 dark:border-gray-600 rounded-[6px] w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white leading-tight focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors" id="name" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-900 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input className="appearance-none border-2 border-gray-200 dark:border-gray-600 rounded-[6px] w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white leading-tight focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors" id="email" type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-900 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea className="appearance-none border-2 border-gray-200 dark:border-gray-600 rounded-[6px] w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white leading-tight focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors" id="message" placeholder="Your Message" rows={4} value={message} onChange={e => setMessage(e.target.value)} required disabled={isLoading}></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold py-2 px-6 rounded-[6px] focus:outline-none transition-colors disabled:opacity-60" type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          {status && <div className="mt-4 text-center text-sm font-bold text-gray-900 dark:text-white">{status}</div>}
        </form>
        <div className="mt-8 text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Our Team</h2>
          <ul className="list-disc pl-6 font-medium">
            <li><strong>Naeem Ud Din</strong> – Data Scientist</li>
            <li><strong>Imran Nadeem</strong> – Data Analyst</li>
            <li><strong>Hassan Raza</strong> – Data Analyst</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
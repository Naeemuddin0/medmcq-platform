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
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="eyebrow mb-3">Contact</p>
      <h1 className="font-serif text-3xl font-semibold text-ink dark:text-white">Get in touch</h1>
      <p className="mt-3 text-ink-muted dark:text-white/60">
        Have questions, feedback, or want to collaborate? Fill out the form below.
      </p>

      <form onSubmit={handleSubmit} className="card mt-8 p-8">
        <div className="mb-5">
          <label className="field-label" htmlFor="name">Name</label>
          <input className="field-input" id="name" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
        </div>
        <div className="mb-5">
          <label className="field-label" htmlFor="email">Email</label>
          <input className="field-input" id="email" type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
        </div>
        <div className="mb-6">
          <label className="field-label" htmlFor="message">Message</label>
          <textarea className="field-input" id="message" placeholder="Your Message" rows={4} value={message} onChange={e => setMessage(e.target.value)} required disabled={isLoading}></textarea>
        </div>
        <button className="btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
        {status && <p className="mt-4 text-sm font-medium text-accent dark:text-emerald-400">{status}</p>}
      </form>

      <div className="mt-10">
        <h2 className="font-serif text-lg font-semibold text-ink dark:text-white">Our Team</h2>
        <ul className="mt-3 space-y-1 text-ink-muted dark:text-white/60">
          <li><span className="font-medium text-ink dark:text-white">Naeem Ud Din</span> &ndash; Data Scientist</li>
          <li><span className="font-medium text-ink dark:text-white">Imran Nadeem</span> &ndash; Data Analyst</li>
          <li><span className="font-medium text-ink dark:text-white">Hassan Raza</span> &ndash; Data Analyst</li>
        </ul>
      </div>
    </div>
  );
}

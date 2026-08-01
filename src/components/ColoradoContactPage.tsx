'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  EnvelopeIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';

export default function ColoradoContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'colorado' }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMessage(
        'Something went wrong. Please try again or email hess.rylan@gmail.com directly.'
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#002868] leading-tight">
          Contact BMX Colorado
        </h1>
        <p className="text-[#4A5568] mt-3 text-sm sm:text-base max-w-xl">
          Questions about the forum, track boards, or the statewide community? Send a note —
          we read every message.
        </p>
      </div>

      <div className="bg-white border-2 border-[#D0D7E2] rounded-xl p-6 sm:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-6">
            <p className="text-2xl font-black text-[#002868] mb-2 flex items-center justify-center gap-2">
              <CheckIcon className="w-7 h-7 text-[#BF0A30]" />
              Message sent
            </p>
            <p className="text-[#4A5568] font-medium mb-6">
              Thanks for reaching out. We&apos;ll get back to you soon.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="px-6 py-3 border-2 border-[#002868] text-[#002868] font-black rounded-lg hover:bg-[#002868]/5 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="co-name" className="block text-[#002868] font-black text-sm mb-1.5">
                Your name *
              </label>
              <input
                type="text"
                id="co-name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white text-[#0B1C2D] border-2 border-[#D0D7E2] rounded-lg focus:border-[#002868] focus:outline-none font-medium"
                placeholder="Rider name"
              />
            </div>

            <div>
              <label htmlFor="co-email" className="block text-[#002868] font-black text-sm mb-1.5">
                Your email *
              </label>
              <input
                type="email"
                id="co-email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white text-[#0B1C2D] border-2 border-[#D0D7E2] rounded-lg focus:border-[#002868] focus:outline-none font-medium"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="co-message" className="block text-[#002868] font-black text-sm mb-1.5">
                Message *
              </label>
              <textarea
                id="co-message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-white text-[#0B1C2D] border-2 border-[#D0D7E2] rounded-lg focus:border-[#002868] focus:outline-none font-medium resize-y"
                placeholder="Forum help, track board questions, partnership ideas, feedback…"
              />
            </div>

            {status === 'error' && (
              <div className="border-2 border-[#BF0A30]/40 bg-[#BF0A30]/5 rounded-lg p-4">
                <p className="text-[#BF0A30] font-bold text-sm flex items-start gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-[#BF0A30] text-white font-black py-3.5 px-6 rounded-lg hover:bg-[#9E0828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                <span className="flex items-center justify-center gap-2">
                  <BoltIcon className="w-5 h-5 animate-pulse" />
                  Sending…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <EnvelopeIcon className="w-5 h-5" />
                  Send message
                </span>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[#D0D7E2] text-center">
          <p className="text-[#4A5568] text-sm font-medium">Or email directly:</p>
          <a
            href="mailto:hess.rylan@gmail.com"
            className="inline-block mt-1 text-[#002868] font-black text-lg hover:text-[#BF0A30] transition-colors"
          >
            hess.rylan@gmail.com
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/forum"
          className="block bg-white border-2 border-[#D0D7E2] rounded-xl p-5 hover:border-[#002868] transition-colors"
        >
          <p className="font-black text-[#002868]">Forum</p>
          <p className="text-sm text-[#4A5568] mt-1">Track boards and statewide discussion</p>
        </Link>
        <Link
          href="/tracks"
          className="block bg-white border-2 border-[#D0D7E2] rounded-xl p-5 hover:border-[#002868] transition-colors"
        >
          <p className="font-black text-[#002868]">Tracks</p>
          <p className="text-sm text-[#4A5568] mt-1">Colorado BMX tracks directory</p>
        </Link>
      </div>
    </div>
  );
}

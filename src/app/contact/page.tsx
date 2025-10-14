'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage('Oops! Something went wrong. Please try again or email me directly at hess.rylan@gmail.com');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-purple-600 relative overflow-hidden">
      {/* Geometric Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 opacity-80" style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)'}}></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-pink-400 opacity-60" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'}}></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-cyan-400 opacity-70" style={{clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'}}></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 bg-lime-400 animate-float"></div>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-block mb-8 bg-black text-yellow-400 font-black px-6 py-3 border-4 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105"
        >
          ← BACK TO HOME
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <Image
              src="/logo.jpeg"
              alt="DEN BMX Logo"
              width={200}
              height={200}
              className="border-8 border-yellow-400 rounded-full shadow-2xl"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-yellow-400 mb-4" style={{textShadow: '4px 4px 0px #ff00ff, 8px 8px 0px #00ffff'}}>
            CONTACT ME
          </h1>
          <p className="text-2xl text-white font-bold bg-black px-6 py-3 inline-block border-4 border-cyan-400">
            📧 GET IN TOUCH • SAY HI 📧
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-black border-8 border-yellow-400 p-4 shadow-2xl">
            <Image
              src="/contactme-img.jpeg"
              alt="BMX Family"
              width={600}
              height={800}
              className="w-full h-auto"
            />
            <div className="mt-4 text-center">
              <p className="text-yellow-400 font-black text-xl">
                🏁 RIDE WITH US 🏁
              </p>
              <p className="text-white font-bold mt-2">
                Join the Denver BMX community!
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-black border-8 border-pink-500 p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-pink-500 mb-6">
              SEND A MESSAGE
            </h2>

            {status === 'success' ? (
              <div className="bg-green-500 border-4 border-green-700 p-6 text-center animate-bounce-slow">
                <p className="text-2xl font-black text-black mb-2">✓ MESSAGE SENT!</p>
                <p className="text-black font-bold mb-4">Thanks for reaching out! I&apos;ll get back to you soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="bg-black text-green-400 font-black px-6 py-3 border-4 border-green-400 hover:bg-green-400 hover:text-black transition-all"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-yellow-400 font-black text-lg mb-2">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 text-white border-4 border-cyan-400 focus:border-yellow-400 focus:outline-none font-bold"
                    placeholder="John Rider"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-yellow-400 font-black text-lg mb-2">
                    YOUR EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 text-white border-4 border-cyan-400 focus:border-yellow-400 focus:outline-none font-bold"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-yellow-400 font-black text-lg mb-2">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800 text-white border-4 border-cyan-400 focus:border-yellow-400 focus:outline-none font-bold resize-none"
                    placeholder="Tell me about your BMX experience, questions, or just say hi!"
                  />
                </div>

                {status === 'error' && (
                  <div className="bg-red-900 border-4 border-red-600 p-4">
                    <p className="text-red-200 font-bold">⚠️ {errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gradient-to-br from-orange-400 to-red-600 hover:from-red-600 hover:to-orange-400 text-white font-black py-4 px-8 border-8 border-black shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⚡</span>
                      SENDING...
                    </span>
                  ) : (
                    '📧 SEND MESSAGE 📧'
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t-4 border-slate-700">
              <p className="text-white font-bold text-center">
                Or email me directly at:
              </p>
              <a
                href="mailto:hess.rylan@gmail.com"
                className="block text-cyan-400 font-black text-xl text-center hover:text-yellow-400 transition-colors mt-2"
              >
                hess.rylan@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10 mt-12">
        <div className="bg-black border-4 border-yellow-400 px-6 py-4 inline-block">
          <p className="text-yellow-400 font-black text-lg">
            ⚡ DEN BMX ⚡ DENVER METRO BMX SCHEDULES ⚡
          </p>
        </div>
      </footer>
    </div>
  );
}


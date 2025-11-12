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
    } catch {
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Geometric Background Shapes - Subtle punk accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64" style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)', backgroundColor: '#00ff0c'}}></div>
        <div className="absolute top-20 right-0 w-96 h-96" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)', backgroundColor: '#00ff0c'}}></div>
        <div className="absolute bottom-0 left-20 w-80 h-80" style={{clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', backgroundColor: '#00ff0c'}}></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 bg-[#00ff0c] animate-float opacity-30"></div>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-block mb-6 sm:mb-8 bg-black text-[#00ff0c] font-black px-4 sm:px-6 py-3 border-4 border-[#00ff0c] active:bg-[#00ff0c] active:text-black transition-all transform active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          ← BACK TO HOME
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <Image
              src="/DEN_BMX_FINAL_Green.png"
              alt="DEN BMX Logo"
              width={250}
              height={250}
              className="shadow-2xl"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-[#00ff0c] mb-4" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
            CONTACT ME
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-bold bg-black px-4 sm:px-6 py-2 sm:py-3 inline-block border-4 border-[#00ff0c]">
            📧 GET IN TOUCH • SAY HI 📧
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-black border-4 border-[#00ff0c] p-4 shadow-2xl">
            <Image
              src="/contactme-img.jpeg"
              alt="BMX Family"
              width={600}
              height={800}
              className="w-full h-auto"
            />
            <div className="mt-4 text-center">
              <p className="text-[#00ff0c] font-black text-xl">
                🏁 RIDE WITH US 🏁
              </p>
              <p className="text-white font-bold mt-2">
                Join the Denver BMX community!
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-black border-4 border-[#00ff0c] p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-[#00ff0c] mb-6">
              SEND A MESSAGE
            </h2>

            {status === 'success' ? (
              <div className="bg-[#00ff0c] border-4 border-black p-6 text-center">
                <p className="text-2xl font-black text-black mb-2">✓ MESSAGE SENT!</p>
                <p className="text-black font-bold mb-4">Thanks for reaching out! I&apos;ll get back to you soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="bg-black text-[#00ff0c] font-black px-6 py-3 border-4 border-[#00ff0c] hover:bg-[#00ff0c] hover:text-black transition-all"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[#00ff0c] font-black text-lg mb-2">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black text-white border-4 border-[#00ff0c] focus:border-white focus:outline-none font-bold"
                    placeholder="John Rider"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#00ff0c] font-black text-lg mb-2">
                    YOUR EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black text-white border-4 border-[#00ff0c] focus:border-white focus:outline-none font-bold"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#00ff0c] font-black text-lg mb-2">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-black text-white border-4 border-[#00ff0c] focus:border-white focus:outline-none font-bold resize-none"
                    placeholder="Tell me about your BMX experience, questions, or just say hi!"
                  />
                </div>

                {status === 'error' && (
                  <div className="bg-black border-4 border-[#00ff0c] p-4">
                    <p className="text-[#00ff0c] font-bold">⚠️ {errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-4 px-6 sm:px-8 border-4 border-[#00ff0c] shadow-2xl transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
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

            <div className="mt-8 pt-8 border-t-4 border-[#00ff0c]">
              <p className="text-white font-bold text-center">
                Or email me directly at:
              </p>
              <a
                href="mailto:hess.rylan@gmail.com"
                className="block text-[#00ff0c] font-black text-xl text-center hover:text-white transition-colors mt-2"
              >
                hess.rylan@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10 mt-12">
        <div className="bg-black border-4 border-[#00ff0c] px-6 py-4 inline-block">
          <p className="text-[#00ff0c] font-black text-lg">
            ⚡ DEN BMX ⚡ DENVER METRO BMX SCHEDULES ⚡
          </p>
        </div>
      </footer>
    </div>
  );
}


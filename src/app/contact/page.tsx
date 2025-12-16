'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  EnvelopeIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  BoltIcon
} from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';

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
      {/* Background Image - Color BMX Racing Photo */}
      <div 
        className="fixed inset-0 z-0 w-full h-full" 
        style={{ 
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/side-view-people-riding-bicycled-sunny-day.jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 w-full h-full bg-black/50" />
      </div>
      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Hero - Professional Punk */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] p-8 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              CONTACT ME
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-4 shadow-2xl">
            <Image
              src="/contactme-img.jpeg"
              alt="BMX Family"
              width={600}
              height={800}
              className="w-full h-auto"
            />
            <div className="mt-4 text-center">
              <p className="text-[#00ff0c] font-black text-xl">
                RIDE WITH US
              </p>
              <p className="text-white font-bold mt-2">
                Join the Denver BMX community!
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-[#00ff0c] mb-6">
              SEND A MESSAGE
            </h2>

            {status === 'success' ? (
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 text-center backdrop-blur-sm">
                <p className="text-2xl font-black text-[#00ff0c] mb-2 flex items-center justify-center gap-2">
                  <CheckIcon className="w-6 h-6" />
                  MESSAGE SENT!
                </p>
                <p className="text-white font-bold mb-4">Thanks for reaching out! I&apos;ll get back to you soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                    className="bg-black text-[#00ff0c] font-black px-6 py-3 border-4 border-[#00ff0c] rounded-xl hover:bg-[#00ff0c] hover:text-black transition-all"
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
                    className="w-full px-4 py-3 bg-black text-white border-4 border-[#00ff0c] rounded-xl focus:border-white focus:outline-none font-bold"
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
                    className="w-full px-4 py-3 bg-black text-white border-4 border-[#00ff0c] rounded-xl focus:border-white focus:outline-none font-bold"
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
                    className="w-full px-4 py-3 bg-black text-white border-4 border-[#00ff0c] rounded-xl focus:border-white focus:outline-none font-bold resize-none"
                    placeholder="Tell me about your BMX experience, questions, or just say hi!"
                  />
                </div>

                {status === 'error' && (
                  <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-4">
                    <p className="text-[#00ff0c] font-bold flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      {errorMessage}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-4 px-6 sm:px-8 border-4 border-[#00ff0c] rounded-xl shadow-2xl transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <BoltIcon className="w-5 h-5 animate-spin" />
                      SENDING...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <EnvelopeIcon className="w-5 h-5" />
                      SEND MESSAGE
                    </span>
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

            <div className="mt-8 pt-8 border-t-4 border-[#00ff0c]">
              <h3 className="text-[#00ff0c] font-black text-2xl mb-4 text-center">
                FOLLOW US
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/bmxdenver/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-white hover:text-[#00ff0c] font-bold text-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.467.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61584792913276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-white hover:text-[#00ff0c] font-bold text-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  BMX Denver Facebook Page
                </a>
                <a
                  href="https://www.facebook.com/groups/1509675260286653"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-white hover:text-[#00ff0c] font-bold text-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Little Rippers Facebook Group
                </a>
                <a
                  href="https://www.facebook.com/groups/3657619811047605"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-white hover:text-[#00ff0c] font-bold text-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Track Volunteers Facebook Group
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubmitStatus('success');
      setEmail('');
      
      // Close modal after 2 seconds on success
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-black border-4 border-[#00ff0c] shadow-2xl transform transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#00ff0c] transition-colors z-20"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8 sm:p-10">
          {submitStatus === 'success' ? (
            <div className="text-center">
              <div className="mb-4 text-[#00ff0c] text-4xl">✓</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                YOU&apos;RE IN!
              </h2>
              <p className="text-white text-lg">
                Thanks for signing up! We&apos;ll keep you posted on all the BMX action in Denver.
              </p>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#00ff0c] p-4 border-4 border-white">
                  <EnvelopeIcon className="w-12 h-12 text-black" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-3">
                STAY IN THE LOOP
              </h2>
              
              {/* Subtitle */}
              <p className="text-white text-center mb-6 text-lg">
                Sign up for our newsletter to get updates on races and bike events happening in the Denver area.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubmitStatus('idle');
                      setErrorMessage('');
                    }}
                    placeholder="your@email.com"
                    className="w-full bg-black border-4 border-[#00ff0c] text-white placeholder-gray-500 font-bold py-4 px-6 text-lg focus:outline-none focus:border-white transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {submitStatus === 'error' && errorMessage && (
                  <div className="bg-red-900/50 border-2 border-red-500 text-white p-3 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00ff0c] hover:bg-white text-black font-black py-4 px-8 border-4 border-black transition-all transform hover:scale-105 text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'SIGNING UP...' : 'SIGN ME UP'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-white hover:text-[#00ff0c] font-bold py-2 transition-colors text-sm"
                >
                  Maybe Later
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function SignupForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md border-2 border-[#00ff0c] rounded-lg p-8 bg-black/95 backdrop-blur-sm text-center shadow-2xl">
        <h1 className="text-2xl font-black text-[#00ff0c] mb-4">Check your email</h1>
        <p className="text-gray-300 mb-6">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Link href="/login" className="text-[#00ff0c] font-bold hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md border-2 border-[#00ff0c] rounded-lg p-8 bg-black/95 backdrop-blur-sm shadow-2xl shadow-[#00ff0c]/10">
      <div className="flex justify-center mb-6">
        <Image
          src="/logos/DEN_BMX_FINAL_Green.png"
          alt="BMX Colorado"
          width={80}
          height={80}
          className="h-20 w-auto"
        />
      </div>
      <h1 className="text-2xl font-black text-[#00ff0c] text-center mb-2">JOIN BMX COLORADO</h1>
      <p className="text-gray-400 text-center text-sm mb-6">Create an account to start posting</p>

      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="displayName" className="block text-sm font-bold text-[#00ff0c] mb-1">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={2}
            maxLength={40}
            className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-[#00ff0c] mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-[#00ff0c] mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <div className="mt-4">
        <Link
          href="/forum"
          className="block w-full py-3 text-center border-2 border-[#00ff0c]/40 text-[#00ff0c] font-bold rounded hover:bg-[#00ff0c]/10 transition-colors"
        >
          Continue as Guest
        </Link>
      </div>

      <p className="text-center text-gray-400 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[#00ff0c] font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

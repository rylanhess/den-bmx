'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GoogleSignInButton, { AuthDivider } from '@/components/auth/GoogleSignInButton';
import { CO_MARK_BLUE } from '@/lib/coloradoUi';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '/forum';
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="w-full max-w-md border-2 border-[#00ff0c] rounded-lg p-8 bg-black/95 backdrop-blur-sm shadow-2xl shadow-[#00ff0c]/10">
      <div className="flex justify-center mb-6">
        <Image
          src={CO_MARK_BLUE}
          alt="BMX Colorado"
          width={160}
          height={103}
          className="h-20 w-auto"
        />
      </div>
      <h1 className="text-2xl font-black text-[#00ff0c] text-center mb-2">BMX COLORADO</h1>
      <p className="text-gray-400 text-center text-sm mb-6">Sign in to post and join the conversation</p>

      <GoogleSignInButton onError={setError} />
      <AuthDivider />

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
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
            className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'SIGN IN'}
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
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#00ff0c] font-bold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

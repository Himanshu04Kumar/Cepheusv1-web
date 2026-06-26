// @ts-nocheck
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Admin Access</h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">Ops Command Protocol</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Admin Email</label>
              <input
                required
                type="email"
                placeholder="name@cepheus.com"
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-1 ring-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Protocol Key</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-1 ring-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Authorize Session'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-slate-600 hover:text-slate-400 text-xs font-bold uppercase tracking-widest transition-colors">
            Return to Site
          </Link>
        </div>
      </div>
    </div>
  );
}

// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function TrackSearchPage() {
  const [id, setId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim()) {
      router.push(`/track/${id.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Locate Repair</h1>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              required
              type="text" 
              placeholder="Enter Booking ID (e.g. 881dcd...)"
              className="w-full p-4 pl-12 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg"
          >
            Track Status
          </button>
        </form>
      </div>
    </div>
  );
}

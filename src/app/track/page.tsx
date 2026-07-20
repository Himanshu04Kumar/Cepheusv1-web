// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Phone, Calendar, Hash, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TrackSearchPage() {
  const [searchMode, setSearchMode] = useState<'id' | 'mobile'>('id');
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleIdSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim()) {
      router.push(`/track/${id.trim()}`);
    }
  };

  const handleMobileSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // STRICT SEARCH: Both mobile number AND date must match exactly
      // We look for bookings where customer_phone matches and created_at is within that 24hr window
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('customer_phone', phone)
        .gte('created_at', `${date}T00:00:00.000Z`)
        .lte('created_at', `${date}T23:59:59.999Z`)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        router.push(`/track/${data.id}`);
      } else {
        setError('No matching repair found for this mobile number on that date.');
      }
    } catch (err: any) {
      setError('Search failed. Please ensure your details are correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Track Repair</h1>
        </div>

        {/* Toggle Switch */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl">
          <button
            onClick={() => setSearchMode('id')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${searchMode === 'id' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Hash size={14} /> ID
          </button>
          <button
            onClick={() => setSearchMode('mobile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${searchMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Phone size={14} /> Mobile
          </button>
        </div>

        {searchMode === 'id' ? (
          <form onSubmit={handleIdSearch} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                required
                type="text"
                placeholder="Enter Booking ID"
                className="w-full p-5 pl-12 bg-slate-900 border border-slate-800 rounded-3xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              Locate Repair
            </button>
          </form>
        ) : (
          <form onSubmit={handleMobileSearch} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Registered Mobile</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  required
                  type="tel"
                  placeholder="e.g. 9988776655"
                  className="w-full p-5 pl-12 bg-slate-900 border border-slate-800 rounded-3xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Booking Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  required
                  type="date"
                  className="w-full p-5 pl-12 bg-slate-900 border border-slate-800 rounded-3xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  style={{ colorScheme: 'dark' }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-2xl text-center">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Locate Repair'}
            </button>
          </form>
        )}

        <div className="text-center pt-8">
          <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] leading-relaxed">
            Authentication Protocol: Strictly matching both <br/> mobile and date for secure retrieval.
          </p>
        </div>
      </div>
    </div>
  );
}

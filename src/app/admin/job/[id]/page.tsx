// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminJobManagement() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
      setBooking(data);
      setLoading(false);
    }
    if (id) fetchJob();
  }, [id]);

  const runSecureAction = async (action, data) => {
    setStatusMsg('Communicating with Secure Backend...');
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, bookingId: id, data }),
      });
      
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Backend failed');
      
      setStatusMsg('SUCCESS! Database Updated. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatusMsg('API ERROR: ' + err.message);
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/admin" className="text-blue-500 flex items-center gap-2 hover:underline">
          <ArrowLeft size={16} /> Back to Ops Command
        </Link>
        
        <h1 className="text-3xl font-black uppercase tracking-tighter">Manage: {booking?.customer_name}</h1>
        
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div>
            <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Current Status</p>
            <p className="text-xl font-bold text-blue-400">{booking?.status}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => runSecureAction('UPDATE_STATUS', { status: 'PICKED_UP' })} className="bg-slate-800 hover:bg-blue-600 p-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all">Set Picked Up</button>
              <button onClick={() => runSecureAction('UPDATE_STATUS', { status: 'DIAGNOSING' })} className="bg-slate-800 hover:bg-blue-600 p-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all">Set Diagnosing</button>
              <button onClick={() => runSecureAction('UPDATE_STATUS', { status: 'IN_REPAIR' })} className="bg-slate-800 hover:bg-green-600 p-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all">Set In Repair</button>
              <button onClick={() => runSecureAction('UPDATE_STATUS', { status: 'DELIVERED' })} className="bg-slate-800 hover:bg-blue-600 p-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all">Set Delivered</button>
            </div>
          </div>

          {statusMsg && (
            <div className={`p-4 rounded-xl border text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
              statusMsg.includes('ERROR') ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-blue-500/10 border-blue-500/50 text-blue-400'
            }`}>
              {statusMsg}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Security: API Protocol Active</p>
        </div>
      </div>
    </div>
  );
}

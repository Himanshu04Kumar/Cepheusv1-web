// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminJobManagement() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Feature States
  const [diagnosis, setDiagnosis] = useState('');
  const [price, setPrice] = useState('');
  const [parts, setParts] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
      setBooking(data);
      setLoading(false);
    }
    if (id) fetchJob();
  }, [id]);

  const runSecureAction = async (action, data) => {
    setStatusMsg(`Action: ${action} - Processing...`);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, bookingId: id, data }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Backend failed');
      
      setStatusMsg('SUCCESS! Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatusMsg('API ERROR: ' + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/admin" className="text-blue-500 flex items-center gap-2 hover:underline">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-black uppercase tracking-tighter">Manage: {booking?.customer_name}</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Status Controls */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h2 className="font-bold flex items-center gap-2 text-slate-400">
              <RefreshCw size={18} className="text-blue-500" />
              Update Status
            </h2>
            <p className="text-sm text-slate-500">Current: <span className="font-bold text-blue-400">{booking?.status}</span></p>
            <div className="grid grid-cols-2 gap-2">
              {['PICKED_UP', 'DIAGNOSING', 'QUALITY_CHECK', 'DELIVERED'].map(s => (
                <button 
                  key={s}
                  onClick={() => runSecureAction('UPDATE_STATUS', { status: s })}
                  className="p-3 text-[10px] font-bold border border-slate-800 rounded-xl hover:bg-blue-600 transition-colors uppercase"
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h2 className="font-bold flex items-center gap-2 text-slate-400">
              <Camera size={18} className="text-blue-500" />
              Upload Evidence
            </h2>
            <input 
              type="text" 
              placeholder="Paste Photo URL (Mock)"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-1 ring-blue-500"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
            />
            <button 
              onClick={() => runSecureAction('UPLOAD_PHOTO', { url: photoUrl, stage: booking.status })}
              disabled={!photoUrl}
              className="w-full bg-slate-100 text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 hover:bg-white transition-all"
            >
              Add to Evidence Log
            </button>
          </div>

          {/* Approval Request */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 md:col-span-2 shadow-2xl">
            <h2 className="font-bold flex items-center gap-2 text-slate-400">
              <AlertCircle size={18} className="text-amber-500" />
              Create Approval Request (Transparency Gate)
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <textarea 
                placeholder="Diagnosis"
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm col-span-2 h-32 outline-none focus:ring-1 ring-amber-500"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
              />
              <div className="space-y-4">
                <input 
                  type="number" 
                  placeholder="Price (₹)"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-bold text-amber-500 outline-none"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Parts Details"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  value={parts}
                  onChange={e => setParts(e.target.value)}
                />
                <button 
                  onClick={() => runSecureAction('CREATE_APPROVAL', { diagnosis, price: parseFloat(price), parts })}
                  disabled={!diagnosis || !price}
                  className="w-full bg-amber-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-30"
                >
                  Send to Customer
                </button>
              </div>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 bg-blue-600 text-white rounded-xl font-bold text-center animate-pulse">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}

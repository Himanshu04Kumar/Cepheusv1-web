// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { sendStatusUpdateEmail } from '@/lib/notifications';

export default function AdminJobManagement() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [diagnosis, setDiagnosis] = useState('');
  const [price, setPrice] = useState('');
  const [parts, setParts] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
      if (data) {
        setBooking(data);
        setDiagnosis(data.diagnosis_text || '');
        setPrice(data.final_price?.toString() || '');
      }
      setLoading(false);
    }
    if (id) fetchJob();
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase.from('bookings').update({ status } as any).eq('id', id);
      if (error) throw error;

      // Notify customer (Mock email)
      console.log('Sending update email to:', booking.customer_name);

      window.location.reload();
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const submitApprovalRequest = async () => {
    setUpdating(true);
    try {
      // 1. Create the request
      const { error: reqError } = await supabase.from('approval_requests').insert({
        booking_id: id,
        diagnosis_text: diagnosis,
        quoted_price: parseFloat(price),
        parts_detail: parts,
        status: 'PENDING'
      } as any);

      if (reqError) throw reqError;

      // 2. Update booking status
      const { error: bError } = await supabase.from('bookings').update({
        status: 'AWAITING_APPROVAL'
      } as any).eq('id', id);

      if (bError) throw bError;

      alert('Approval request sent to customer!');
      window.location.reload();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const uploadPhoto = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase.from('repair_photos').insert({
        booking_id: id,
        stage: booking.status,
        photo_url: photoUrl
      } as any);

      if (error) throw error;

      setPhotoUrl('');
      alert('Photo added to evidence log!');
      window.location.reload();
    } catch (err) {
      alert(`Failed to upload: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold">JOB NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Repair Management</p>
            <h1 className="text-2xl font-black uppercase tracking-tighter">{booking.customer_name}</h1>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Status</p>
             <p className="text-sm font-bold text-blue-400">{booking.status.replace('_', ' ')}</p>
           </div>
           <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Hardware</p>
             <p className="text-sm font-bold text-slate-200">{booking.device_brand} {booking.device_model}</p>
           </div>
           <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-1">ID</p>
             <p className="text-sm font-mono text-slate-400">{booking.id.slice(0,8)}</p>
           </div>
           <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Logged</p>
             <p className="text-sm font-bold text-slate-200">{new Date(booking.created_at).toLocaleDateString()}</p>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Status Controls */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
            <h2 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-slate-400">
              <RefreshCw size={16} className="text-blue-500" />
              Advance Repair Stage
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {['PICKED_UP', 'DIAGNOSING', 'QUALITY_CHECK', 'DELIVERED'].map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                  className={`p-3 text-[10px] font-black border transition-all rounded-xl uppercase tracking-widest flex items-center justify-between group ${
                    booking.status === s ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.replace('_', ' ')}
                  <CheckCircle2 size={14} className={booking.status === s ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'} />
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
            <h2 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-slate-400">
              <Camera size={16} className="text-blue-500" />
              Upload Evidence
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase">Image URL (Hosted Link)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-1 ring-blue-500 transition-all font-mono text-blue-400"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                />
              </div>
              <button
                onClick={uploadPhoto}
                disabled={!photoUrl || updating}
                className="w-full bg-slate-100 text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 hover:bg-white transition-all shadow-lg"
              >
                Add to Evidence Log
              </button>
            </div>
          </div>

          {/* Approval Request */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 md:col-span-2 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-slate-400">
                <AlertCircle size={16} className="text-amber-500" />
                Transparency Gate (Create Approval)
              </h2>
              <span className="text-[9px] font-black bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-tighter">Requires Action</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase">Diagnosis & Technician Notes</label>
                <textarea
                  placeholder="Explain exactly what is wrong..."
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm h-32 outline-none focus:ring-1 ring-amber-500 transition-all text-slate-200 leading-relaxed"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase">Quoted Price (INR)</label>
                  <input
                    type="number"
                    placeholder="Total repair cost"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-bold outline-none focus:ring-1 ring-amber-500 transition-all text-amber-500"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase">Parts Detail</label>
                  <input
                    type="text"
                    placeholder="e.g. 52Wh Battery"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-1 ring-amber-500 transition-all"
                    value={parts}
                    onChange={e => setParts(e.target.value)}
                  />
                </div>
                <button
                  onClick={submitApprovalRequest}
                  disabled={!diagnosis || !price || updating}
                  className="w-full bg-amber-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-30 mt-4"
                >
                  Send to Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

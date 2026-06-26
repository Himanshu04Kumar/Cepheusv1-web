// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw, Phone, Hash, Calendar, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminJobManagement() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Feature States
  const [diagnosis, setDiagnosis] = useState('');
  const [price, setPrice] = useState('');
  const [parts, setParts] = useState('');
  const [photoStage, setPhotoUrlStage] = useState('RECEIVING');

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
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setStatusMsg('API ERROR: ' + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMsg('Compressing & Uploading Evidence...');

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${photoStage}-${Math.random()}.${fileExt}`;
      const filePath = `repairs/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('repair-evidence')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('repair-evidence')
        .getPublicUrl(filePath);

      // 3. Save to database via Secure API
      await runSecureAction('UPLOAD_PHOTO', { url: publicUrl, stage: photoStage });

    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors text-white">
      <div className="max-w-4xl mx-auto space-y-8 text-white">
        <div className="flex flex-col gap-4 text-white">
          <Link href="/admin" className="text-blue-500 flex items-center gap-2 hover:underline">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white">
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Repair Mission</p>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white">{booking?.customer_name}</h1>
            </div>
            <div className="flex flex-wrap gap-3 text-white">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <Hash size={12} className="text-slate-500"/>
                <span className="text-xs font-mono font-bold text-blue-400">{id.slice(0, 8)}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white">
                <Phone size={12} className="text-slate-500"/>
                <span className="text-xs font-bold text-white">{booking?.customer_phone}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white">
                <Calendar size={12} className="text-slate-500"/>
                <span className="text-xs font-bold text-white">{new Date(booking?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-white">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl text-white">
            <h2 className="font-bold flex items-center gap-2 text-slate-400 uppercase text-xs tracking-widest text-white">
              <RefreshCw size={18} className="text-blue-500" />
              Update Status
            </h2>
            <p className="text-sm text-slate-500">Current: <span className="font-bold text-blue-400">{booking?.status}</span></p>
            <div className="grid grid-cols-2 gap-2 text-white">
              {['PICKED_UP', 'DIAGNOSING', 'QUALITY_CHECK', 'DELIVERED'].map(s => (
                <button
                  key={s}
                  onClick={() => runSecureAction('UPDATE_STATUS', { status: s })}
                  className="p-3 text-[10px] font-bold border border-slate-800 rounded-xl hover:bg-blue-600 transition-colors uppercase text-white"
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl text-white">
            <h2 className="font-bold flex items-center gap-2 text-slate-400 uppercase text-xs tracking-widest text-white">
              <Camera size={18} className="text-blue-500" />
              Visual Evidence
            </h2>
            <div className="space-y-4 text-white">
              <div className="grid grid-cols-3 gap-2 text-white">
                {['RECEIVING', 'REPAIR', 'COMPLETED'].map(stage => (
                  <button
                    key={stage}
                    onClick={() => setPhotoUrlStage(stage)}
                    className={`py-2 text-[8px] font-black rounded-lg border transition-all ${photoStage === stage ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-800 text-slate-500'}`}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer hover:bg-slate-800/50 hover:border-blue-500/50 transition-all text-white">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-white">
                  <UploadCloud className="w-8 h-8 mb-2 text-slate-500" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {isUploading ? 'Uploading...' : `Click to Upload for ${photoStage}`}
                  </p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 md:col-span-2 shadow-2xl text-white">
            <h2 className="font-bold flex items-center gap-2 text-slate-400 uppercase text-xs tracking-widest text-white">
              <AlertCircle size={18} className="text-amber-500" />
              Transparency Gate (Create Approval)
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-white">
              <textarea
                placeholder="Diagnosis"
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm col-span-2 h-32 outline-none focus:ring-1 ring-amber-500 text-white"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
              />
              <div className="space-y-4 text-white">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-bold text-amber-500 outline-none text-white"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Parts Details"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  value={parts}
                  onChange={e => setParts(e.target.value)}
                />
                <button
                  onClick={() => runSecureAction('CREATE_APPROVAL', { diagnosis, price: parseFloat(price), parts })}
                  disabled={!diagnosis || !price}
                  className="w-full bg-amber-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-30 text-white"
                >
                  Send to Customer
                </button>
              </div>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 bg-blue-600 text-white rounded-xl font-bold text-center animate-pulse uppercase text-[10px] tracking-widest text-white">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}

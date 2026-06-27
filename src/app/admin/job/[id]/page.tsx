// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw, Phone, Hash, Calendar, UploadCloud, Plus, Trash2, ShieldCheck, Wrench, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdvancedAdminManagement() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Event 4: Options State
  const [options, setOptions] = useState([{ option_name: 'OEM Original', description: '', price: '' }]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Event 5: Part Documentation State
  const [partDoc, setPartDoc] = useState({ name: '', removed_photo: '', installed_photo: '', manufacturer: '', serial: '', condition: '' });

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
      setBooking(data);

      const { data: optData } = await supabase.from('repair_options').select('*').eq('booking_id', id);
      if (optData && optData.length > 0) {
        setOptions(optData.map(o => ({ option_name: o.option_name, description: o.description, price: o.price })));

        // Find if any option was already paid for
        const selected = optData.find(o => o.is_selected === true);
        if (selected) setSelectedOption(selected);
      }

      setLoading(false);
    }
    if (id) fetchJob();
  }, [id]);

  const runAction = async (action, data) => {
    setStatusMsg(`Syncing: ${action}...`);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, bookingId: id, data }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'API Rejection');
      setStatusMsg('Success! Registry Updated.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatusMsg(`API Error: ${err.message}`);
    }
  };

  const handleUpload = async (file, callback) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const path = `repairs/${id}-${Date.now()}.jpg`;
      const { error } = await supabase.storage.from('repair-evidence').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('repair-evidence').getPublicUrl(path);
      callback(publicUrl);
    } catch (e) { alert(`Upload Failed: ${e.message}`); }
    finally { setIsUploading(false); }
  };

  const addOption = () => {
    setOptions(prev => [...prev, { option_name: '', description: '', price: '' }]);
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  const isLocked = ['IN_REPAIR', 'QUALITY_CHECK', 'DELIVERED'].includes(booking?.status);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/admin" className="text-slate-500 hover:text-white flex items-center gap-2"><ArrowLeft size={16} /> Dashboard</Link>

        <div className="flex justify-between items-end border-b border-slate-900 pb-8">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Command Unit</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter">{booking?.customer_name}</h1>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-[10px] font-black uppercase text-slate-500">Status: <span className="text-blue-400">{booking?.status}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800/50 shadow-xl">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Hardware</p>
             <p className="text-xs font-bold text-slate-200">{booking?.device_brand} {booking?.device_model}</p>
           </div>
           <div className="bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800/50 shadow-xl">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Mobile</p>
             <p className="text-xs font-bold text-white">{booking?.customer_phone}</p>
           </div>
           <div className="bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800/50 shadow-xl">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Booking Date</p>
             <p className="text-xs font-bold text-white">{new Date(booking?.created_at).toLocaleDateString('en-IN')}</p>
           </div>
           <div className="bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800/50 shadow-xl">
             <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Registry ID</p>
             <p className="text-xs font-mono font-bold text-blue-400 uppercase">{id.slice(0,8)}</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><RefreshCw size={14}/> Logistics Stage</h2>
              <div className="grid grid-cols-1 gap-2">
                {['PICKED_UP', 'DIAGNOSING', 'QUALITY_CHECK', 'DELIVERED'].map(s => (
                  <button key={s} onClick={() => runAction('UPDATE_STATUS', { status: s })} className={`p-3 text-[10px] font-black rounded-xl border transition-all uppercase tracking-widest ${booking?.status === s ? 'bg-blue-600 border-blue-500' : 'border-slate-800 hover:bg-slate-800'}`}>{s.replace('_', ' ')}</button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-green-500 flex items-center gap-2"><ShieldCheck size={14}/> Finalize & Warranty</h2>
              <p className="text-[10px] text-slate-500">Issue warranty only after delivery is confirmed.</p>
              <div className="flex gap-2">
                <button onClick={() => runAction('ISSUE_WARRANTY', { days: 90 })} className="flex-1 bg-green-600/10 border border-green-500/20 text-green-500 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-green-600 hover:text-white transition-all">90 Day Protection</button>
                <button onClick={() => runAction('ISSUE_WARRANTY', { days: 365 })} className="flex-1 bg-green-600/10 border border-green-500/20 text-green-500 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-green-600 hover:text-white transition-all">1 Year Protection</button>
              </div>
            </div>
          </div>

          {/* COLUMN 2: OPTIONS GATE (LOCKED AFTER PAYMENT) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-widest text-amber-500 flex items-center gap-2"><AlertCircle size={16}/> Transparency Gate (Repair Options)</h2>
                {!isLocked && <button onClick={addOption} className="p-2 bg-amber-500/10 rounded-full text-amber-500 hover:bg-amber-500 hover:text-white transition-all"><Plus size={16}/></button>}
              </div>

              {selectedOption ? (
                <div className="bg-green-600/10 border border-green-500/30 p-6 rounded-3xl flex justify-between items-center animate-in zoom-in duration-500">
                  <div>
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Customer Selection Verified</p>
                    <p className="text-lg font-black text-white uppercase">{selectedOption.option_name}</p>
                    <p className="text-xs text-slate-400">{selectedOption.description}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-black text-green-400 font-mono tracking-tighter">₹{selectedOption.price}</p>
                     <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase mt-1"><CheckCircle2 size={12}/> Payment Secure</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {options.map((opt, i) => (
                    <div key={i} className="grid grid-cols-12 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 relative group">
                      <div className="col-span-4"><input placeholder="Name (e.g. OEM)" className="w-full bg-transparent text-xs font-bold uppercase outline-none text-white" value={opt.option_name} onChange={e => updateOption(i, 'option_name', e.target.value)}/></div>
                      <div className="col-span-5"><input placeholder="Details..." className="w-full bg-transparent text-[10px] outline-none text-slate-300" value={opt.description} onChange={e => updateOption(i, 'description', e.target.value)}/></div>
                      <div className="col-span-2"><input placeholder="Price" className="w-full bg-transparent text-xs font-black text-amber-500 outline-none" type="number" value={opt.price} onChange={e => updateOption(i, 'price', e.target.value)}/></div>
                      <div className="col-span-1 flex justify-end"><button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="text-slate-700 hover:text-red-500"><Trash2 size={14}/></button></div>
                    </div>
                  ))}
                  <button onClick={() => runAction('PUBLISH_OPTIONS', { options })} className="w-full bg-amber-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 transition-all shadow-lg">Publish Options to Customer</button>
                </div>
              )}
            </div>

            {/* COLUMN 3: VISUAL PROOF */}
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-purple-500 flex items-center gap-2"><Camera size={16}/> Evidence Documentation</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-500 uppercase ml-2">Condition / Before</p>
                   <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all overflow-hidden relative">
                      {partDoc.removed_photo ? <img src={partDoc.removed_photo} className="w-full h-full object-cover"/> : <UploadCloud size={24} className="text-slate-700"/>}
                      <input type="file" className="hidden" onChange={e => handleUpload(e.target.files[0], (url) => setPartDoc({...partDoc, removed_photo: url}))}/>
                   </label>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-500 uppercase ml-2">Installed / After</p>
                   <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all overflow-hidden relative">
                      {partDoc.installed_photo ? <img src={partDoc.installed_photo} className="w-full h-full object-cover"/> : <UploadCloud size={24} className="text-slate-700"/>}
                      <input type="file" className="hidden" onChange={e => handleUpload(e.target.files[0], (url) => setPartDoc({...partDoc, installed_photo: url}))}/>
                   </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <input placeholder="Part Name (e.g. Battery)" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs outline-none focus:ring-1 ring-purple-500 text-white" value={partDoc.name} onChange={e => setPartDoc({...partDoc, name: e.target.value})}/>
                 <input placeholder="Serial Number" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs outline-none focus:ring-1 ring-purple-500 text-white" value={partDoc.serial} onChange={e => setPartDoc({...partDoc, serial: e.target.value})}/>
              </div>
              <button onClick={() => runAction('DOCUMENT_PART', {
                removed_part_name: partDoc.name,
                removed_part_photo: partDoc.removed_photo,
                installed_part_name: partDoc.name,
                installed_part_photo_before: partDoc.installed_photo,
                installed_serial: partDoc.serial
              })} className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500 transition-all shadow-lg">Submit Visual Evidence</button>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className={`fixed bottom-8 right-8 p-4 rounded-2xl font-bold shadow-2xl animate-in slide-in-from-right-8 z-50 ${
            statusMsg.includes('Error') ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}

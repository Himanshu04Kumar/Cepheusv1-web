// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw, Phone, Hash, Calendar, UploadCloud, Plus, Trash2, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdvancedAdminManagement() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Event 4: Options State
  const [options, setOptions] = useState([{ option_name: 'OEM Original', description: '', price: '' }]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Event 5: Single Photo State
  const [partDoc, setPartDoc] = useState({ name: '', photo: '', serial: '' });

  useEffect(() => {
    async function fetchJob() {
      // 1. Get User Role
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: prof } = await supabase.from('admin_profiles').select('*').eq('id', session.user.id).single();
        setProfile(prof);
      }

      // 2. Get Booking Details
      const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
      setBooking(data);

      // 3. Get existing options
      const { data: optData } = await supabase.from('repair_options').select('*').eq('booking_id', id);
      if (optData && optData.length > 0) {
        setOptions(optData.map(o => ({ option_name: o.option_name, description: o.description, price: o.price })));
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

  const handleUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const path = `repairs/${id}-${Date.now()}.jpg`;
      const { error } = await supabase.storage.from('repair-evidence').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('repair-evidence').getPublicUrl(path);
      setPartDoc(prev => ({ ...prev, photo: publicUrl }));
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8 text-white">
        <Link href="/admin" className="text-slate-500 hover:text-white flex items-center gap-2"><ArrowLeft size={16} /> Dashboard</Link>

        <div className="flex justify-between items-end border-b border-slate-900 pb-8 text-white text-white">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Command Unit</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">{booking?.customer_name}</h1>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-[10px] font-black uppercase text-slate-500 text-white">Status: <span className="text-blue-400">{booking?.status}</span></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 text-white text-white">
          {/* LOGISTICS STAGE */}
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 text-white"><RefreshCw size={14}/> Logistics Stage</h2>
              <div className="grid grid-cols-1 gap-2 text-white text-white">
                {['PICKED_UP', 'DIAGNOSING', 'QUALITY_CHECK', 'DELIVERED'].map(s => (
                  <button key={s} onClick={() => runAction('UPDATE_STATUS', { status: s })} className={`p-3 text-[10px] font-black rounded-xl border transition-all uppercase tracking-widest ${booking?.status === s ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-800 hover:bg-slate-800 text-white'}`}>{s.replace(/_/g, ' ')}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8 text-white">
            {/* EVENT 4: OPTIONS GATE (RESTORED) */}
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6 text-white text-white">
              <div className="flex justify-between items-center text-white">
                <h2 className="text-sm font-black uppercase tracking-widest text-amber-500 flex items-center gap-2"><AlertCircle size={16}/> Transparency Gate</h2>
                <button onClick={addOption} className="p-2 bg-amber-500/10 rounded-full text-amber-500 hover:bg-amber-500 hover:text-white transition-all text-white"><Plus size={16}/></button>
              </div>

              {selectedOption ? (
                <div className="bg-green-600/10 border border-green-500/30 p-6 rounded-3xl flex justify-between items-center text-white text-white">
                  <div>
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Customer Selection Verified</p>
                    <p className="text-lg font-black uppercase text-white">{selectedOption.option_name}</p>
                    <p className="text-xs text-slate-400">{selectedOption.description}</p>
                  </div>
                  <div className="text-right text-white">
                     <p className="text-2xl font-black text-green-400 font-mono">₹{selectedOption.price}</p>
                     <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase mt-1 text-white"><CheckCircle2 size={12}/> Paid</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-white text-white">
                  {options.map((opt, i) => (
                    <div key={i} className={`grid grid-cols-12 gap-3 p-4 rounded-2xl border bg-slate-950 border-slate-800 relative group`}>
                      <div className="col-span-4 text-white"><input placeholder="Option Name" className="w-full bg-transparent text-xs font-bold uppercase outline-none text-white" value={opt.option_name} onChange={e => updateOption(i, 'option_name', e.target.value)}/></div>
                      <div className="col-span-5 text-white"><input placeholder="Description..." className="w-full bg-transparent text-[10px] outline-none text-slate-400" value={opt.description} onChange={e => updateOption(i, 'description', e.target.value)}/></div>
                      <div className="col-span-2 text-white"><input placeholder="Price" className="w-full bg-transparent text-xs font-black text-amber-500 outline-none text-white" type="number" value={opt.price} onChange={e => updateOption(i, 'price', e.target.value)}/></div>
                      <div className="col-span-1 flex justify-end text-white"><button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="text-slate-700 hover:text-red-500 text-white"><Trash2 size={14}/></button></div>
                    </div>
                  ))}
                  <button onClick={() => runAction('PUBLISH_OPTIONS', { options })} className="w-full bg-amber-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 transition-all shadow-lg text-white">Publish Options to Customer</button>
                </div>
              )}
            </div>

            {/* EVENT 5: EVIDENCE LOG */}
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6 text-white text-white">
              <h2 className="text-sm font-black uppercase tracking-widest text-purple-500 flex items-center gap-2"><Camera size={16}/> Evidence Documentation</h2>
              <div className="grid grid-cols-1 gap-6 text-white text-white">
                   <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-800 rounded-3xl cursor-pointer hover:bg-slate-800/50 transition-all overflow-hidden relative">
                      {partDoc.photo ? <img src={partDoc.photo} className="w-full h-full object-cover"/> : (
                        <div className="text-center space-y-2 text-white">
                           <UploadCloud size={32} className="text-slate-700 mx-auto text-white"/>
                           <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest text-white">Click to upload repair proof</p>
                        </div>
                      )}
                      <input type="file" className="hidden text-white" onChange={e => handleUpload(e.target.files[0])}/>
                   </label>
                   <div className="grid grid-cols-2 gap-4 text-white text-white">
                      <input placeholder="Part Name / Stage Name" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs outline-none focus:ring-1 ring-purple-500 text-white" value={partDoc.name} onChange={e => setPartDoc({...partDoc, name: e.target.value})}/>
                      <input placeholder="Serial / Reference Number" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs outline-none focus:ring-1 ring-purple-500 text-white" value={partDoc.serial} onChange={e => setPartDoc({...partDoc, serial: e.target.value})}/>
                   </div>
                   <button onClick={() => runAction('DOCUMENT_PART', partDoc)} className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500 transition-all shadow-lg text-white">Submit Visual Evidence</button>
              </div>
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

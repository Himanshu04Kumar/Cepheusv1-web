// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw, Phone, Hash, Calendar, UploadCloud, Plus, Trash2, ShieldCheck, Truck, CheckCircle2, MessageSquare, History, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdvancedAdminManagement() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Historical Data States
  const [existingComments, setExistingComments] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  // Technician Log States
  const [techNote, setTechNote] = useState('');
  const [noteStage, setNoteStage] = useState('PICKED_UP');

  // Event 4: Options State
  const [options, setOptions] = useState([
    { option_name: 'NOT SURE ABOUT IT, PLEASE CALL US', description: 'Request a callback from our technical lead', price: '0' }
  ]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Event 5: Single Photo State
  const [partDoc, setPartDoc] = useState({ name: '', photo: '', serial: '' });

  // Delivery State
  const [deliveryWindow, setDeliveryWindow] = useState('');

  useEffect(() => {
    async function fetchJobData() {
      // 1. Get main booking
      const { data: bData } = await supabase.from('bookings').select('*').eq('id', id).single();
      if (!bData) return setLoading(false);
      setBooking(bData);
      setNoteStage(bData.status);

      // 2. Get existing metadata (Options, Comments, Photos) using full UUID
      const [optData, commData, photoData] = await Promise.all([
        supabase.from('repair_options').select('*').eq('booking_id', id),
        supabase.from('repair_comments').select('*').eq('booking_id', id).order('created_at', { ascending: false }),
        supabase.from('part_documentation').select('*').eq('booking_id', id).order('created_at', { ascending: false })
      ]);

      if (optData.data?.length > 0) {
        setOptions(optData.data.map(o => ({ option_name: o.option_name, description: o.description, price: o.price })));
        const selected = optData.data.find(o => o.is_selected === true);
        if (selected) setSelectedOption(selected);
      }

      setExistingComments(commData.data || []);
      setExistingPhotos(photoData.data || []);

      setLoading(false);
    }
    if (id) fetchJobData();
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
      if (action === 'ADD_COMMENT') setTechNote('');
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link href="/admin" className="text-slate-500 hover:text-white flex items-center gap-2 mb-4"><ArrowLeft size={16} /> Dashboard</Link>

        <div className="flex justify-between items-end border-b border-slate-900 pb-8">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Command Unit</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter">{booking?.customer_name}</h1>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-[10px] font-black uppercase text-slate-500">Status: <span className="text-blue-400">{booking?.status.replace(/_/g, ' ')}</span></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* COLUMN 1: CONTROLS & LOGS */}
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><RefreshCw size={14}/> Set Stage</h2>
              <div className="grid grid-cols-1 gap-2">
                {['PICKED_UP', 'DIAGNOSING', 'QUALITY_CHECK'].map(s => (
                  <button key={s} onClick={() => runAction('UPDATE_STATUS', { status: s })} className={`p-3 text-[10px] font-black rounded-xl border transition-all uppercase tracking-widest ${booking?.status === s ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-800 hover:bg-slate-800 text-slate-500'}`}>{s.replace(/_/g, ' ')}</button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><MessageSquare size={14}/> Technician Note</h2>
              <select className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 outline-none" value={noteStage} onChange={e => setNoteStage(e.target.value)}>
                 <option value="PICKED_UP">PICKUP STAGE</option>
                 <option value="DIAGNOSING">DIAGNOSIS STAGE</option>
                 <option value="IN_REPAIR">REPAIR STAGE</option>
                 <option value="QUALITY_CHECK">QC STAGE</option>
               </select>
              <textarea placeholder="Type finding..." className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-[10px] h-24 outline-none text-white" value={techNote} onChange={e => setTechNote(e.target.value)} />
              <button disabled={!techNote} onClick={() => runAction('ADD_COMMENT', { stage: noteStage, text: techNote })} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30">Push Note</button>
            </div>
          </div>

          {/* COLUMN 2 & 3: MAIN OPERATIONS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-amber-500 flex items-center gap-2"><AlertCircle size={16}/> Transparency Gate</h2>
              {selectedOption ? (
                <div className="bg-green-600/10 border border-green-500/30 p-6 rounded-3xl flex justify-between items-center text-white">
                  <div><p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Customer Selection Verified</p><p className="text-lg font-black uppercase text-white">{selectedOption.option_name}</p></div>
                  <div className="text-right text-white"><p className="text-2xl font-black text-green-400 font-mono">₹{selectedOption.price}</p><div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase mt-1"><CheckCircle2 size={12}/> Paid</div></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {options.map((opt, i) => (
                    <div key={i} className={`grid grid-cols-12 gap-3 p-4 rounded-2xl border ${i === 0 ? 'bg-slate-900 border-blue-500/30' : 'bg-slate-950 border-slate-800'}`}>
                      <div className="col-span-4"><input readOnly={i===0} className="w-full bg-transparent text-xs font-bold uppercase outline-none text-white" value={opt.option_name} onChange={e => {const n=[...options]; n[i].option_name=e.target.value; setOptions(n);}}/></div>
                      <div className="col-span-5"><input readOnly={i===0} className="w-full bg-transparent text-[10px] outline-none text-slate-400" value={opt.description} onChange={e => {const n=[...options]; n[i].description=e.target.value; setOptions(n);}}/></div>
                      <div className="col-span-2 text-white"><input readOnly={i===0} className="w-full bg-transparent text-xs font-black text-amber-500 outline-none" type="number" value={opt.price} onChange={e => {const n=[...options]; n[i].price=e.target.value; setOptions(n);}}/></div>
                    </div>
                  ))}
                  <button onClick={() => runAction('PUBLISH_OPTIONS', { options })} className="w-full bg-amber-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 shadow-lg">Publish Options</button>
                </div>
              )}
            </div>

            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-purple-500 flex items-center gap-2"><Camera size={16}/> Evidence Log</h2>
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-800 rounded-3xl cursor-pointer hover:bg-slate-800/50 transition-all overflow-hidden relative">
                {partDoc.photo ? <img src={partDoc.photo} className="w-full h-full object-cover"/> : <div className="text-center space-y-2"><UploadCloud size={32} className="text-slate-700 mx-auto"/><p className="text-[10px] font-black uppercase text-slate-600">Click to upload repair proof</p></div>}
                <input type="file" className="hidden" onChange={e => handleUpload(e.target.files[0])}/>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Part / Stage Name" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs outline-none focus:ring-1 ring-purple-500 text-white" value={partDoc.name} onChange={e => setPartDoc({...partDoc, name: e.target.value})}/>
                <input placeholder="Serial / Reference" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs outline-none focus:ring-1 ring-purple-500 text-white" value={partDoc.serial} onChange={e => setPartDoc({...partDoc, serial: e.target.value})}/>
              </div>
              <button onClick={() => runAction('DOCUMENT_PART', partDoc)} className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500 shadow-lg">Push Evidence</button>
            </div>
          </div>

          {/* COLUMN 4: HISTORICAL DATA (TECH VIEW) */}
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 h-full max-h-[1000px] overflow-y-auto scrollbar-thin">
              <h2 className="text-xs font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 sticky top-0 bg-slate-900 pb-2 z-10"><History size={14}/> Historical Log</h2>

              {/* Previous Photos */}
              <div className="space-y-3">
                 <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2"><ImageIcon size={10}/> Visual Records</p>
                 <div className="grid grid-cols-1 gap-3">
                   {existingPhotos.map((p, i) => (
                     <div key={i} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <img src={p.removed_part_photo} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all"/>
                        <p className="absolute bottom-2 left-2 text-[7px] font-black uppercase bg-black/60 px-1.5 py-0.5 rounded text-white">{p.removed_part_name}</p>
                     </div>
                   ))}
                   {existingPhotos.length === 0 && <p className="text-[9px] italic text-slate-700">No photos yet.</p>}
                 </div>
              </div>

              {/* Previous Comments */}
              <div className="space-y-3 border-t border-slate-800 pt-6">
                 <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2"><MessageSquare size={10}/> Technician Notes</p>
                 <div className="space-y-3">
                   {existingComments.map((c, i) => (
                     <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[7px] font-black text-blue-500 uppercase">{c.stage.replace(/_/g, ' ')}</span>
                           <span className="text-[7px] font-bold text-slate-700">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">"{c.comment_text}"</p>
                     </div>
                   ))}
                   {existingComments.length === 0 && <p className="text-[9px] italic text-slate-700">No notes yet.</p>}
                 </div>
              </div>
            </div>
          </div>

        </div>
        {statusMsg && <div className={`fixed bottom-8 right-8 p-4 rounded-2xl font-bold shadow-2xl animate-in slide-in-from-right-8 z-50 ${statusMsg.includes('Error') ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>{statusMsg}</div>}
      </div>
    </div>
  );
}

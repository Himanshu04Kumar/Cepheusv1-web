// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw, Phone, Hash, Calendar, UploadCloud, Plus, Trash2, ShieldCheck, Truck, CheckCircle2, MessageSquare, History, Image as ImageIcon, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdvancedAdminManagement() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [profile, setProfile] = useState(null);
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
  const [options, setOptions] = useState([{ option_name: '', description: '', price: '' }]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Event 5: Single Photo State
  const [partDoc, setPartDoc] = useState({ name: '', photo: '', serial: '' });

  // Delivery State
  const [deliveryWindow, setDeliveryWindow] = useState('');

  useEffect(() => {
    async function checkAuthAndFetch() {
      // 1. SECURITY GATE: Verify Session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.error('UNAUTHORIZED ACCESS ATTEMPT');
        router.push('/login');
        return;
      }

      try {
        // 2. Fetch User Profile/Role
        const { data: prof, error: profError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profError || !prof) {
            // Even with a session, if no profile exists, they shouldn't be here
            await supabase.auth.signOut();
            router.push('/login');
            return;
        }
        setProfile(prof);

        // 3. Fetch Booking Data
        const { data: bData } = await supabase.from('bookings').select('*').eq('id', id).single();
        if (!bData) return setLoading(false);
        setBooking(bData);
        setNoteStage(bData.status);

        // 4. Fetch Sub-data
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

      } catch (err) {
        console.error('Critical Error:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) checkAuthAndFetch();
  }, [id, router]);

  const runAction = async (action, data) => {
    setStatusMsg(`Syncing: ${action}...`);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          bookingId: id,
          data,
          adminRole: profile?.role
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'API Rejection');
      setStatusMsg('Success! Registry Updated.');
      if (action === 'ADD_COMMENT') setTechNote('');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatusMsg(`API Error: ${err.message}`);
      if (err.message.includes('SECURITY PROTOCOL')) alert(err.message);
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
    setOptions([...options, { option_name: '', description: '', price: '' }]);
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // While loading auth/data, show NOTHING but the loader.
  // This prevents unauthenticated users from seeing a "flash" of the data.
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="animate-spin text-blue-500" size={64} />
        <p className="text-xs font-black uppercase tracking-[0.4em] animate-pulse">Authenticating Admin Protocol...</p>
      </div>
    </div>
  );

  const stages = ['BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentIndex = stages.indexOf(booking?.status);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link href="/admin" className="text-slate-500 hover:text-white flex items-center gap-2 mb-4 text-white"><ArrowLeft size={16} /> Dashboard</Link>

        <div className="flex justify-between items-end border-b border-slate-900 pb-8 text-white text-white">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Command Unit</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">{booking?.customer_name}</h1>
          </div>
          <div className="flex items-center gap-3 text-white">
             <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
               {profile?.role === 'SUPER_ADMIN' ? <Unlock size={12} className="text-green-500"/> : <Lock size={12} className="text-amber-500"/>}
               Role: <span className={profile?.role === 'SUPER_ADMIN' ? 'text-green-400' : 'text-amber-400'}>{profile?.role}</span>
             </div>
             <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-[10px] font-black uppercase text-slate-500 text-white">Status: <span className="text-blue-400">{booking?.status.replace(/_/g, ' ')}</span></div>
          </div>
        </div>

        {/* CONTEXT BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
           <div className="bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800/50 shadow-xl text-white text-white"><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Hardware</p><p className="text-xs font-bold text-slate-200">{booking?.device_brand} {booking?.device_model}</p></div>
           <div className="bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800/50 shadow-xl text-white text-white"><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Mobile</p><p className="text-xs font-bold">{booking?.customer_phone}</p></div>
           <div className="bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800/50 shadow-xl text-white text-white"><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Logged On</p><p className="text-xs font-bold">{new Date(booking?.created_at).toLocaleDateString('en-IN')}</p></div>
           <div className="bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800/50 shadow-xl text-white text-white"><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Registry ID</p><p className="text-xs font-mono font-bold text-blue-400 uppercase">{id.slice(0,8)}</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-white">

          {/* COLUMN 1: CONTROLS & LOGS */}
          <div className="space-y-6 text-white text-white text-white">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-white text-white">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><RefreshCw size={14}/> Set Stage</h2>
              <div className="grid grid-cols-1 gap-2 text-white">
                {['PICKED_UP', 'DIAGNOSING', 'QUALITY_CHECK'].map(s => {
                  const targetIndex = stages.indexOf(s);
                  const isLocked = targetIndex < currentIndex && profile?.role !== 'SUPER_ADMIN';
                  return (<button key={s} disabled={isLocked} onClick={() => runAction('UPDATE_STATUS', { status: s })} className={`p-3 text-[10px] font-black rounded-xl border transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${booking?.status === s ? 'bg-blue-600 border-blue-500 text-white' : isLocked ? 'border-slate-800 text-slate-700 bg-slate-950' : 'border-slate-800 hover:bg-slate-800 text-slate-500'}`}>{isLocked && <Lock size={10}/>} {s.replace(/_/g, ' ')}</button>);
                })}
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-white">
              <h2 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2 text-white"><Truck size={14}/> Dispatch</h2>
              <div className="space-y-3 text-white">
                 <input placeholder="Est. Window" className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] outline-none text-white text-white" value={deliveryWindow} onChange={e => setDeliveryWindow(e.target.value)} />
                 <button onClick={() => runAction('UPDATE_STATUS', { status: 'OUT_FOR_DELIVERY', deliveryWindow })} className="w-full p-3 text-[10px] font-black rounded-xl border border-slate-800 hover:bg-orange-900/20 text-orange-500 uppercase">Out For Delivery</button>
                 <button onClick={() => runAction('UPDATE_STATUS', { status: 'DELIVERED' })} className="w-full p-3 text-[10px] font-black rounded-xl border border-slate-800 hover:bg-green-900/20 text-green-500 uppercase">Mark Delivered</button>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-white">
              <h2 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 text-white"><MessageSquare size={14}/> Tech Log</h2>
              <select className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 outline-none text-white" value={noteStage} onChange={e => setNoteStage(e.target.value)}>{stages.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</select>
              <textarea placeholder="Finding..." className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-[10px] h-20 outline-none text-white text-white" value={techNote} onChange={e => setTechNote(e.target.value)} />
              <button disabled={!techNote} onClick={() => runAction('ADD_COMMENT', { stage: noteStage, text: techNote })} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30">Push Note</button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8 text-white">
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6 text-white text-white">
              <div className="flex justify-between items-center text-white">
                <h2 className="text-sm font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 text-white"><AlertCircle size={16}/> Transparency Gate</h2>
                {profile?.role === 'SUPER_ADMIN' && <button onClick={addOption} className="p-2 bg-amber-500/10 rounded-full text-amber-500 hover:bg-amber-500 hover:text-white transition-all text-white"><Plus size={16}/></button>}
              </div>
              {selectedOption ? (
                <div className="bg-green-600/10 border border-green-500/30 p-6 rounded-3xl flex justify-between items-center text-white text-white text-white">
                  <div><p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1 text-white">Verified Selection</p><p className="text-lg font-black uppercase text-white">{selectedOption.option_name}</p></div>
                  <div className="text-right text-white"><p className="text-2xl font-black text-green-400 font-mono">₹{selectedOption.price}</p><div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase mt-1"><CheckCircle2 size={12}/> Success</div></div>
                </div>
              ) : (
                <div className="space-y-4 text-white text-white">
                  {options.map((opt, i) => (
                    <div key={i} className={`grid grid-cols-12 gap-1 p-4 rounded-2xl border bg-slate-950 border-slate-800 text-white`}>
                      <div className="col-span-4 border-r border-white/10 pr-2 text-white"><input placeholder="Option" className="w-full bg-transparent text-xs font-bold uppercase outline-none text-white" value={opt.option_name} onChange={e => updateOption(i, 'option_name', e.target.value)}/></div>
                      <div className="col-span-5 border-r border-white/10 px-2 text-white"><input placeholder="Details..." className="w-full bg-transparent text-[10px] outline-none text-slate-400" value={opt.description} onChange={e => updateOption(i, 'description', e.target.value)}/></div>
                      <div className="col-span-2 px-2 text-white text-white"><input placeholder="₹" className="w-full bg-transparent text-xs font-black text-amber-500 outline-none" type="number" value={opt.price} onChange={e => updateOption(i, 'price', e.target.value)}/></div>
                      <div className="col-span-1 flex justify-end text-white"><button onClick={() => removeOption(i)} className="text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={14}/></button></div>
                    </div>
                  ))}
                  {profile?.role === 'SUPER_ADMIN' && (
                    <button onClick={addOption} className="w-full py-3 border-2 border-dashed border-slate-800 rounded-2xl text-[10px] font-black uppercase text-slate-600 hover:text-blue-500 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 text-white text-white text-white">
                       <Plus size={14}/> Add Another Path
                    </button>
                  )}
                  <button onClick={() => runAction('PUBLISH_OPTIONS', { options })} className="w-full bg-amber-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500">Publish Options</button>
                </div>
              )}
            </div>

            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6 text-white text-white text-white">
              <h2 className="text-sm font-black uppercase tracking-widest text-purple-500 flex items-center gap-2 text-white"><Camera size={16}/> Evidence Log</h2>
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-800 rounded-3xl cursor-pointer hover:bg-slate-800/50 transition-all overflow-hidden relative text-white">
                {partDoc.photo ? <img src={partDoc.photo} className="w-full h-full object-cover"/> : <div className="text-center space-y-2 text-white"><UploadCloud size={32} className="text-slate-700 mx-auto text-white"/><p className="text-[10px] font-black uppercase text-slate-600">Snap Photo</p></div>}
                <input type="file" className="hidden text-white" onChange={e => handleUpload(e.target.files[0])}/>
              </label>
              <div className="grid grid-cols-2 gap-4 text-white text-white text-white text-white">
                <input placeholder="Label" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs outline-none focus:ring-1 ring-purple-500 text-white text-white" value={partDoc.name} onChange={e => setPartDoc({...partDoc, name: e.target.value})}/>
                <input placeholder="S/N" className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs outline-none focus:ring-1 ring-purple-500 text-white text-white" value={partDoc.serial} onChange={e => setPartDoc({...partDoc, serial: e.target.value})}/>
              </div>
              <button onClick={() => runAction('DOCUMENT_PART', partDoc)} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500">Push to Log</button>
            </div>
          </div>

          <div className="space-y-6 text-white text-white">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 h-full max-h-[800px] overflow-y-auto scrollbar-none text-white text-white">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 sticky top-0 bg-slate-900 pb-2 z-10 text-white text-white"><History size={14}/> Records</h2>
              <div className="space-y-3 text-white text-white">{existingPhotos.map((p, i) => (<div key={i} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-white"><img src={p.removed_part_photo} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all"/><p className="absolute bottom-2 left-2 text-[7px] font-black uppercase bg-black/60 px-1.5 py-0.5 rounded text-white">{p.removed_part_name}</p></div>))}</div>
              <div className="space-y-3 border-t border-slate-800 pt-6 text-white text-white text-white">{existingComments.map((c, i) => (<div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800"><p className="text-[7px] font-black text-blue-500 uppercase mb-1">{c.stage.replace(/_/g, ' ')}</p><p className="text-[10px] text-slate-400 font-medium italic">"{c.comment_text}"</p></div>))}</div>
            </div>
          </div>

        </div>
        {statusMsg && <div className={`fixed bottom-8 right-8 p-4 rounded-2xl font-bold shadow-2xl z-50 uppercase text-[10px] tracking-widest animate-pulse ${statusMsg.includes('Error') ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>{statusMsg}</div>}
      </div>
    </div>
  );
}

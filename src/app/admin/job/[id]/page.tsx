// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw, Phone, Hash, Calendar, UploadCloud, Plus, Trash2, ShieldCheck, Truck, CheckCircle2, MessageSquare, History, Image as ImageIcon, Lock, Unlock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ThemeToggle';

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
  const [noteStage, setNoteStage] = useState('');

  // Event 4: Options State
  const [options, setOptions] = useState([{ option_name: '', description: '', price: '' }]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Event 5: Single Photo State
  const [partDoc, setPartDoc] = useState({ name: '', photo: '', serial: '' });

  // Delivery State
  const [deliveryWindow, setDeliveryWindow] = useState('');

  const stages = ['BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  useEffect(() => {
    async function checkAuthAndFetch() {
      // 1. SECURITY GATE: Get Session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      try {
        // 2. Fetch User Profile
        const { data: prof, error: profError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // 3. FIX: Only redirect if there's a TRUE error fetching the profile (like no access)
        // If profile exists, set it and continue.
        if (prof) {
            setProfile(prof);
        } else {
            console.warn("Profile not found for session, continuing as restricted.");
            // We set a fallback profile to allow viewing but prevent actions
            setProfile({ role: 'EMPLOYEE', email: session.user.email });
        }

        // 4. Fetch Booking Data
        const { data: bData, error: bError } = await supabase.from('bookings').select('*').eq('id', id).single();
        if (bError || !bData) {
            alert("Booking not found in registry.");
            router.push('/admin');
            return;
        }
        setBooking(bData);
        setNoteStage(bData.status);

        // 5. Fetch Sub-data
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
    setStatusMsg(`Syncing...`);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          bookingId: id,
          data,
          adminRole: profile?.role,
          adminEmail: profile?.email
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'API Rejection');
      setStatusMsg('Success!');
      if (action === 'ADD_COMMENT') setTechNote('');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
      if (err.message.includes('SECURITY')) alert(err.message);
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
    } catch (e) { alert(`Upload Failed`); }
    finally { setIsUploading(false); }
  };

  const addOption = () => setOptions([...options, { option_name: '', description: '', price: '' }]);
  const updateOption = (index, field, value) => {
    const n = [...options]; n[index][field] = value; setOptions(n);
  };
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa] dark:bg-slate-950 text-indigo-600">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="animate-spin" size={64} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Accessing Registry Terminal...</p>
      </div>
    </div>
  );

  const currentIndex = stages.indexOf(booking?.status);
  const nextStage = stages[currentIndex + 1];
  const prevStage = stages[currentIndex - 1];
  const isAwaitingPayment = booking?.status === 'AWAITING_APPROVAL' && !selectedOption;

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

        <div className="flex items-center justify-between">
           <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6b6c76] dark:text-slate-500 hover:text-[#09090b] dark:hover:text-white transition-colors flex items-center gap-2">
             <ArrowLeft size={14} /> Dashboard
           </Link>
           <ThemeToggle />
        </div>

        <div className="flex justify-between items-end border-b border-black/5 dark:border-white/5 pb-8">
          <div>
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-1">Command Unit</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">{booking?.customer_name}</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-black/5 dark:border-white/10 text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
               {profile?.role === 'SUPER_ADMIN' ? <Unlock size={12} className="text-emerald-500"/> : <Lock size={12} className="text-amber-500"/>}
               <span className={profile?.role === 'SUPER_ADMIN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{profile?.role}</span>
             </div>
             <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-black/5 dark:border-white/10 text-[10px] font-black uppercase text-slate-500">Status: <span className="text-indigo-600 dark:text-indigo-400">{booking?.status.replace(/_/g, ' ')}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <Card label="Hardware" value={`${booking?.device_brand} ${booking?.device_model}`} />
           <Card label="Mobile" value={booking?.customer_phone} />
           <Card label="Logged On" value={new Date(booking?.created_at).toLocaleDateString('en-IN')} />
           <Card label="Registry ID" value={id.slice(0,8)} isMono />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <Section icon={<RefreshCw size={14}/>} title="Operational Protocol">
              <div className="space-y-4 pt-2">
                {nextStage && !isAwaitingPayment && (
                  <button onClick={() => runAction('UPDATE_STATUS', { status: nextStage })} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-bold uppercase text-[11px] tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">Proceed to {nextStage.replace(/_/g, ' ')} <ChevronRight size={16}/></button>
                )}
                {isAwaitingPayment && (
                   <div className="bg-amber-600/5 dark:bg-amber-500/5 border border-amber-500/20 p-6 rounded-[2rem] text-center space-y-2">
                      <Lock size={20} className="text-amber-600 dark:text-amber-500 mx-auto" /><p className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-relaxed">Locked: Awaiting Payment</p>
                   </div>
                )}
                {profile?.role === 'SUPER_ADMIN' && prevStage && (
                  <button onClick={() => runAction('UPDATE_STATUS', { status: prevStage })} className="w-full border border-black/5 dark:border-white/10 text-slate-400 py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:text-red-500 hover:border-red-500/20 transition-all flex items-center justify-center gap-2"><ArrowLeft size={14}/> Reverse Stage</button>
                )}
              </div>
            </Section>
            {['QUALITY_CHECK', 'OUT_FOR_DELIVERY'].includes(booking?.status) && (
              <Section icon={<Truck size={14}/>} title="Dispatch Hub" color="orange">
                <div className="space-y-3 pt-2">
                   <input placeholder="Est. Window" className="w-full bg-[#f8f8f7] dark:bg-slate-950 p-3 rounded-xl border border-black/5 dark:border-white/10 text-xs text-[#09090b] dark:text-white outline-none" value={deliveryWindow} onChange={e => setDeliveryWindow(e.target.value)} />
                   <button onClick={() => runAction('UPDATE_STATUS', { status: 'OUT_FOR_DELIVERY', deliveryWindow })} className="w-full p-3 text-[10px] font-black rounded-xl border border-black/5 dark:border-white/10 text-orange-600 uppercase hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all">Out For Delivery</button>
                   <button onClick={() => runAction('UPDATE_STATUS', { status: 'DELIVERED' })} className="w-full p-3 text-[10px] font-black rounded-xl border border-black/5 dark:border-white/10 text-emerald-600 uppercase hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-all">Mark Delivered</button>
                </div>
              </Section>
            )}
            <Section icon={<MessageSquare size={14}/>} title="Tech Log" color="blue">
              <div className="space-y-3 pt-2">
                <select className="w-full bg-[#f8f8f7] dark:bg-slate-950 p-3 rounded-xl border border-black/5 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 outline-none" value={noteStage} onChange={e => setNoteStage(e.target.value)}>{stages.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</select>
                <textarea placeholder="Finding..." className="w-full bg-[#f8f8f7] dark:bg-slate-950 p-4 rounded-xl border border-black/5 dark:border-white/10 text-xs h-20 outline-none text-[#09090b] dark:text-white" value={techNote} onChange={e => setTechNote(e.target.value)} />
                <button disabled={!techNote} onClick={() => runAction('ADD_COMMENT', { stage: noteStage, text: techNote })} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30">Push Note</button>
              </div>
            </Section>
          </div>
          <div className="lg:col-span-2 space-y-8">
            {['DIAGNOSING', 'AWAITING_APPROVAL'].includes(booking?.status) && (
              <Section icon={<AlertCircle size={16}/>} title="Transparency Gate" color="amber">
                {selectedOption ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl flex justify-between items-center text-emerald-600 dark:text-emerald-400 mt-4">
                    <div><p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Verified Selection</p><p className="text-lg font-black uppercase">{selectedOption.option_name}</p></div>
                    <div className="text-right"><p className="text-2xl font-black font-mono text-[#09090b] dark:text-white">₹{selectedOption.price}</p><div className="flex items-center gap-1 text-[10px] font-black uppercase mt-1"><CheckCircle2 size={12}/> Success</div></div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4">
                    {options.map((opt, i) => (
                      <div key={i} className="grid grid-cols-12 gap-1 p-4 rounded-2xl border border-black/5 dark:border-white/10 bg-[#f8f8f7] dark:bg-slate-950">
                        <div className="col-span-4 border-r border-black/5 dark:border-white/10 pr-2"><input placeholder="Option" className="w-full bg-transparent text-xs font-bold uppercase outline-none text-[#09090b] dark:text-white" value={opt.option_name} onChange={e => updateOption(i, 'option_name', e.target.value)}/></div>
                        <div className="col-span-5 border-r border-black/5 dark:border-white/10 px-2"><input placeholder="Details" className="w-full bg-transparent text-[10px] outline-none text-slate-500 dark:text-slate-400" value={opt.description} onChange={e => updateOption(i, 'description', e.target.value)}/></div>
                        <div className="col-span-2 px-2"><input placeholder="₹" className="w-full bg-transparent text-xs font-black text-amber-600 outline-none" type="number" value={opt.price} onChange={e => updateOption(i, 'price', e.target.value)}/></div>
                        <div className="col-span-1 flex justify-end"><button onClick={() => removeOption(i)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button></div>
                      </div>
                    ))}
                    <button onClick={addOption} className="w-full py-4 border-2 border-dashed border-black/5 dark:border-white/10 rounded-3xl text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 hover:border-indigo-600/30 transition-all flex items-center justify-center gap-2"><Plus size={14}/> Add Another Path</button>
                    <button onClick={() => runAction('PUBLISH_OPTIONS', { options })} className="w-full bg-amber-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 shadow-xl shadow-amber-600/10 transition-all">Publish to Customer</button>
                  </div>
                )}
              </Section>
            )}
            <Section icon={<Camera size={16}/>} title="Evidence Log" color="purple">
              <div className="space-y-6 pt-4">
                <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-black/5 dark:border-white/10 rounded-[2rem] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all overflow-hidden relative">
                  {partDoc.photo ? <img src={partDoc.photo} className="w-full h-full object-cover"/> : <div className="text-center space-y-2"><UploadCloud size={32} className="text-slate-300 mx-auto"/><p className="text-[10px] font-black uppercase text-slate-400">Click to snap photo</p></div>}
                  <input type="file" className="hidden" onChange={e => handleUpload(e.target.files[0])}/>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Label" className="bg-[#f8f8f7] dark:bg-slate-950 p-4 rounded-xl border border-black/5 dark:border-white/10 text-xs font-bold outline-none focus:border-indigo-500 text-[#09090b] dark:text-white" value={partDoc.name} onChange={e => setPartDoc({...partDoc, name: e.target.value})}/>
                  <input placeholder="S/N" className="bg-[#f8f8f7] dark:bg-slate-950 p-4 rounded-xl border border-black/5 dark:border-white/10 text-xs font-bold outline-none focus:border-indigo-500 text-[#09090b] dark:text-white" value={partDoc.serial} onChange={e => setPartDoc({...partDoc, serial: e.target.value})}/>
                </div>
                <button onClick={() => runAction('DOCUMENT_PART', partDoc)} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/10">Push to Log</button>
              </div>
            </Section>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm space-y-8 h-full max-h-[900px] overflow-y-auto scrollbar-none">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2 sticky top-0 bg-white dark:bg-slate-900 pb-2 z-10"><History size={14}/> Records</h2>
              <div className="space-y-4">
                 {existingPhotos.map((p, i) => (<div key={i} className="group relative aspect-video rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-slate-100 dark:bg-slate-950"><img src={p.removed_part_photo} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all"/><p className="absolute bottom-3 left-3 text-[8px] font-black uppercase bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-[#09090b] dark:text-white">{p.removed_part_name}</p></div>))}
                 {existingComments.map((c, i) => (<div key={i} className="bg-[#f8f8f7] dark:bg-slate-950 p-4 rounded-2xl border border-black/5 dark:border-white/10"><p className="text-[8px] font-black text-indigo-600 uppercase mb-1">{c.stage.replace(/_/g, ' ')}</p><p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed">"{c.comment_text}"</p></div>))}
              </div>
            </div>
          </div>
        </div>
        {statusMsg && <div className="fixed bottom-8 right-8 p-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl z-[100] animate-in slide-in-from-right-8">{statusMsg}</div>}
      </div>
    </div>
  );
}

function Card({ label, value, isMono }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-sm">
      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black mb-1 tracking-widest">{label}</p>
      <p className={`text-xs font-bold text-[#09090b] dark:text-white ${isMono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function Section({ icon, title, children, color = "slate" }) {
  const colors = { slate: "text-slate-400", amber: "text-amber-500", purple: "text-indigo-600 dark:text-indigo-400", orange: "text-orange-500", blue: "text-blue-500" };
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm space-y-4">
      <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${colors[color]}`}>{icon} {title}</h2>
      {children}
    </div>
  );
}

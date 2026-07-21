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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      try {
        const { data: prof } = await supabase.from('admin_profiles').select('*').eq('id', session.user.id).single();
        if (prof) { setProfile(prof); } else { setProfile({ role: 'EMPLOYEE', email: session.user.email }); }

        const { data: bData } = await supabase.from('bookings').select('*').eq('id', id).single();
        if (!bData) { router.push('/admin'); return; }
        setBooking(bData);
        setNoteStage(bData.status);

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
      } catch (err) { console.error('Error:', err); } finally { setLoading(false); }
    }
    if (id) checkAuthAndFetch();
  }, [id, router]);

  const runAction = async (action, data) => {
    setStatusMsg(`Syncing...`);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, bookingId: id, data, adminRole: profile?.role, adminEmail: profile?.email }),
      });
      if (!res.ok) throw new Error('Sync Rejection');
      setStatusMsg('Success!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) { setStatusMsg(`Error: ${err.message}`); }
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa] dark:bg-slate-950 text-indigo-600"><Loader2 className="animate-spin" size={64} /></div>;

  const currentIndex = stages.indexOf(booking?.status);
  const nextStage = stages[currentIndex + 1];
  const prevStage = stages[currentIndex - 1];
  const isAwaitingPayment = booking?.status === 'AWAITING_APPROVAL' && !selectedOption;

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans transition-colors duration-500 pb-20">
      <div className="max-w-7xl mx-auto p-5 md:p-8 space-y-10">

        {/* Navigation */}
        <div className="flex items-center justify-between">
           <Link href="/admin" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 flex items-center gap-2">
             <ArrowLeft size={14} /> Dashboard
           </Link>
           <ThemeToggle />
        </div>

        {/* Identity Header - Responsive */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 dark:border-white/5 pb-8">
          <div>
            <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-1">Command Unit</p>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white leading-tight">{booking?.customer_name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
             <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-black/5 dark:border-white/10 text-[9px] font-black uppercase text-slate-500 flex items-center gap-2">
               {profile?.role === 'SUPER_ADMIN' ? <Unlock size={12} className="text-emerald-500"/> : <Lock size={12} className="text-amber-500"/>}
               <span className="text-slate-700 dark:text-slate-300">{profile?.role}</span>
             </div>
             <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-black/5 dark:border-white/10 text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400">Status: {booking?.status.replace(/_/g, ' ')}</div>
          </div>
        </div>

        {/* Info Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
           <AdminCard label="Hardware" value={`${booking?.device_brand} ${booking?.device_model}`} />
           <AdminCard label="Mobile" value={booking?.customer_phone} />
           <AdminCard label="Logged On" value={new Date(booking?.created_at).toLocaleDateString('en-IN')} />
           <AdminCard label="Registry ID" value={id.slice(0,8)} isMono />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Workflow Column */}
          <div className="space-y-6">
            <AdminSection icon={<RefreshCw size={14}/>} title="Protocol">
              {nextStage && !isAwaitingPayment && (
                <button onClick={() => runAction('UPDATE_STATUS', { status: nextStage })} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all">Proceed to {nextStage.replace(/_/g, ' ')} <ChevronRight size={16}/></button>
              )}
              {isAwaitingPayment && (
                 <div className="bg-amber-600/5 border border-amber-500/20 p-6 rounded-[1.5rem] text-center space-y-2">
                    <Lock size={20} className="text-amber-600 mx-auto" /><p className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-relaxed">Locked: Awaiting Payment</p>
                 </div>
              )}
              {profile?.role === 'SUPER_ADMIN' && prevStage && (
                <button onClick={() => runAction('UPDATE_STATUS', { status: prevStage })} className="w-full border border-black/5 dark:border-white/10 text-slate-400 py-3 rounded-[1rem] font-black uppercase text-[8px] tracking-widest hover:text-red-500 transition-all">Reverse Stage</button>
              )}
            </AdminSection>

            {['QUALITY_CHECK', 'OUT_FOR_DELIVERY'].includes(booking?.status) && (
              <AdminSection icon={<Truck size={14}/>} title="Dispatch" color="orange">
                 <input placeholder="Est. Window" className="w-full bg-[#f8f8f7] dark:bg-slate-950 p-3 rounded-xl border border-black/5 text-xs text-[#09090b] dark:text-white outline-none" value={deliveryWindow} onChange={e => setDeliveryWindow(e.target.value)} />
                 <button onClick={() => runAction('UPDATE_STATUS', { status: 'OUT_FOR_DELIVERY', deliveryWindow })} className="w-full p-3 text-[9px] font-black rounded-xl border border-black/5 text-orange-600 uppercase transition-all mt-3">Out For Delivery</button>
              </AdminSection>
            )}

            <AdminSection icon={<MessageSquare size={14}/>} title="Tech Log" color="blue">
              <select className="w-full bg-[#f8f8f7] dark:bg-slate-950 p-3 rounded-xl border border-black/5 text-[9px] font-bold text-slate-500 outline-none" value={noteStage} onChange={e => setNoteStage(e.target.value)}>{stages.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</select>
              <textarea placeholder="Finding..." className="w-full bg-[#f8f8f7] dark:bg-slate-950 p-4 rounded-xl border border-black/5 text-xs h-20 outline-none text-[#09090b] dark:text-white mt-3" value={techNote} onChange={e => setTechNote(e.target.value)} />
              <button disabled={!techNote} onClick={() => runAction('ADD_COMMENT', { stage: noteStage, text: techNote })} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black uppercase text-[9px] tracking-widest mt-3">Push Note</button>
            </AdminSection>
          </div>

          {/* Evidence & Quotes */}
          <div className="lg:col-span-2 space-y-8">
            {['DIAGNOSING', 'AWAITING_APPROVAL'].includes(booking?.status) && (
              <AdminSection icon={<AlertCircle size={16}/>} title="Transparency Gate" color="amber">
                {selectedOption ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl flex justify-between items-center text-emerald-600 mt-2">
                    <div><p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Verified Selection</p><p className="text-base font-black uppercase">{selectedOption.option_name}</p></div>
                    <div className="text-right"><p className="text-xl font-black font-mono text-[#09090b] dark:text-white">₹{selectedOption.price}</p></div>
                  </div>
                ) : (
                  <div className="space-y-3 mt-2">
                    {options.map((opt, i) => (
                      <div key={i} className="grid grid-cols-12 gap-1 p-3 rounded-xl border border-black/5 bg-[#f8f8f7] dark:bg-slate-950">
                        <input placeholder="Option" className="col-span-4 bg-transparent text-[10px] font-bold uppercase outline-none" value={opt.option_name} onChange={e => { const n=[...options]; n[i].option_name=e.target.value; setOptions(n); }}/>
                        <input placeholder="Details" className="col-span-5 bg-transparent text-[9px] outline-none" value={opt.description} onChange={e => { const n=[...options]; n[i].description=e.target.value; setOptions(n); }}/>
                        <input placeholder="₹" className="col-span-2 bg-transparent text-[10px] font-black text-amber-600 outline-none" type="number" value={opt.price} onChange={e => { const n=[...options]; n[i].price=e.target.value; setOptions(n); }}/>
                        <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="col-span-1 text-slate-300"><Trash2 size={12}/></button>
                      </div>
                    ))}
                    <button onClick={() => setOptions([...options, {option_name:'', description:'', price:''}])} className="w-full py-3 border-2 border-dashed border-black/5 rounded-xl text-[9px] font-black uppercase text-slate-400 transition-all">+ Add Path</button>
                    <button onClick={() => runAction('PUBLISH_OPTIONS', { options })} className="w-full bg-amber-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest mt-2">Publish Quotes</button>
                  </div>
                )}
              </AdminSection>
            )}

            <AdminSection icon={<Camera size={16}/>} title="Evidence Log" color="purple">
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-black/5 rounded-[1.5rem] cursor-pointer hover:bg-black/5 transition-all overflow-hidden relative">
                {partDoc.photo ? <img src={partDoc.photo} className="w-full h-full object-cover"/> : <div className="text-center space-y-2"><UploadCloud size={24} className="text-slate-300 mx-auto"/><p className="text-[9px] font-black uppercase text-slate-400">Snap Photo</p></div>}
                <input type="file" className="hidden" onChange={e => handleUpload(e.target.files[0])}/>
              </label>
              <div className="grid grid-cols-2 gap-3 mt-4 text-[#09090b] dark:text-white text-white">
                <input placeholder="Label" className="bg-[#f8f8f7] dark:bg-slate-950 p-3 rounded-xl border border-black/5 text-[10px] outline-none text-[#09090b] dark:text-white" value={partDoc.name} onChange={e => setPartDoc({...partDoc, name: e.target.value})}/>
                <input placeholder="S/N" className="bg-[#f8f8f7] dark:bg-slate-950 p-3 rounded-xl border border-black/5 text-[10px] outline-none text-[#09090b] dark:text-white" value={partDoc.serial} onChange={e => setPartDoc({...partDoc, serial: e.target.value})}/>
              </div>
              <button onClick={() => runAction('DOCUMENT_PART', partDoc)} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest mt-4">Push to Log</button>
            </AdminSection>
          </div>

          {/* History */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-black/5 shadow-sm space-y-6 max-h-[600px] overflow-y-auto">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2"><History size={14}/> Records</h2>
              <div className="space-y-4">
                 {existingPhotos.map((p, i) => (<div key={i} className="rounded-xl overflow-hidden border border-black/5 bg-slate-50"><img src={p.removed_part_photo} className="w-full aspect-video object-cover"/></div>))}
                 {existingComments.map((c, i) => (<div key={i} className="bg-[#f8f8f7] dark:bg-slate-950 p-3 rounded-xl border border-black/5"><p className="text-[8px] font-black text-indigo-600 uppercase">{c.stage}</p><p className="text-[10px] text-slate-600 italic">"{c.comment_text}"</p></div>))}
              </div>
            </div>
          </div>
        </div>
        {statusMsg && <div className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[9px] shadow-2xl z-[100] animate-in slide-in-from-right-4">{statusMsg}</div>}
      </div>
    </div>
  );
}

function AdminCard({ label, value, isMono }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-[1.2rem] border border-black/5 shadow-sm">
      <p className="text-[8px] text-slate-400 uppercase font-black mb-1 tracking-widest">{label}</p>
      <p className={`text-[10px] md:text-[11px] font-bold text-[#09090b] dark:text-white truncate ${isMono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function AdminSection({ icon, title, children, color = "slate" }) {
  const colors = { slate: "text-slate-400", amber: "text-amber-500", purple: "text-indigo-600", orange: "text-orange-500", blue: "text-blue-500" };
  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.8rem] md:rounded-[2rem] border border-black/5 shadow-sm space-y-4">
      <h2 className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${colors[color]}`}>{icon} {title}</h2>
      {children}
    </div>
  );
}

// @ts-nocheck
'use client';

import { ArrowLeft, Plus, Loader2, LogOut, Users, X, Shield, Key, Copy, Check, Trash2, ChevronRight, LayoutGrid, List, History, UserCog, Activity, PhoneCall, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [callbackRequests, setCallbackRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const router = useRouter();

  // Audit Filter States
  const [filterType, setFilterType] = useState<'ALL' | 'EMPLOYEE' | 'REGISTRY'>('ALL');
  const [filterValue, setFilterValue] = useState('');

  // Management States
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [creatingStaff, setCreatingStaff] = useState(false);

  const columns = [
    { id: 'BOOKED', title: 'New Bookings' },
    { id: 'PICKED_UP', title: 'Picked Up' },
    { id: 'DIAGNOSING', title: 'Diagnosing' },
    { id: 'AWAITING_APPROVAL', title: 'Awaiting Approval' },
    { id: 'IN_REPAIR', title: 'In Repair' },
    { id: 'QUALITY_CHECK', title: 'Quality Check' },
    { id: 'OUT_FOR_DELIVERY', title: 'Out For Delivery' },
    { id: 'DELIVERED', title: 'Completed' },
  ];

  const fetchStaff = async () => {
    const { data } = await supabase.from('admin_profiles').select('*').order('created_at', { ascending: false });
    if (data) setStaffList(data);
  };

  const fetchLogs = async () => {
    let query = supabase.from('staff_activity_logs').select('*').order('created_at', { ascending: false });
    if (filterType === 'EMPLOYEE' && filterValue) {
      const lastWeek = new Date(); lastWeek.setDate(lastWeek.getDate() - 7);
      query = query.eq('admin_email', filterValue).gte('created_at', lastWeek.toISOString());
    } else if (filterType === 'REGISTRY' && filterValue) {
      query = query.ilike('target_id', `${filterValue}%`);
    } else { query = query.limit(30); }
    const { data } = await query;
    if (data) setActivityLogs(data);
  };

  useEffect(() => {
    if (profile?.role === 'SUPER_ADMIN') fetchLogs();
  }, [filterType, filterValue, profile]);

  const fetchCallbacks = async () => {
    const { data } = await supabase.from('repair_comments').select('*, bookings(customer_name, customer_phone, device_model)').ilike('comment_text', '%CUSTOMER REQUESTED A CALLBACK%').order('created_at', { ascending: false });
    if (data) setCallbackRequests(data);
  };

  const handleResolveCallback = async (e, commentId, bookingId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESOLVE_CALLBACK',
          bookingId,
          data: { commentId },
          adminEmail: profile?.email
        }),
      });
      if (res.ok) { await fetchCallbacks(); }
    } catch (err) { alert("Error resolving callback"); }
  };

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (data) setBookings(data);
  };

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data: prof } = await supabase.from('admin_profiles').select('*').eq('id', session.user.id).single();
      if (!prof) { router.push('/login'); return; }
      setProfile(prof);
      await Promise.all([fetchBookings(), fetchCallbacks()]);
      if (prof?.role === 'SUPER_ADMIN') { await fetchStaff(); await fetchLogs(); }
      setLoading(false);
    }
    init();
    const channel = supabase.channel('dashboard_updates').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchBookings()).subscribe();
    return () => supabase.removeChannel(channel);
  }, [router]);

  const handleResetPassword = async (userId: string, email: string) => {
    const newPass = prompt(`New protocol key for ${email}:`);
    if (!newPass || newPass.length < 6) return;
    const res = await fetch('/api/admin/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'RESET_PASSWORD', userId, password: newPass }) });
    if (res.ok) alert("Security Reset Successful.");
  };

  const handleDeleteStaff = async (userId: string, email: string) => {
    if (!confirm(`Revoke access for ${email}?`)) return;
    const res = await fetch('/api/admin/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'DELETE_EMPLOYEE', userId }) });
    if (res.ok) { alert("Access Revoked."); await fetchStaff(); }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingStaff(true);
    const res = await fetch('/api/admin/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'CREATE_EMPLOYEE', email: staffEmail, password: staffPass }) });
    if (res.ok) { alert('Agent Deployed!'); await fetchStaff(); setStaffEmail(''); setStaffPass(''); }
    setCreatingStaff(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login'); };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfbfa] dark:bg-slate-950 text-indigo-600 transition-colors">
      <Loader2 className="animate-spin" size={48} />
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse text-indigo-600">Syncing Ops Command...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 flex flex-col font-sans text-[#09090b] dark:text-white transition-colors duration-500 relative selection:bg-indigo-500/30">

      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-6 md:p-10 rounded-[2rem] w-full max-w-7xl shadow-2xl space-y-10 my-8 text-[#09090b] dark:text-white">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-6">
              <div className="flex items-center gap-3">
                 <Shield className="text-indigo-600" size={32} />
                 <div><h2 className="text-2xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">Oversight Command</h2><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-[#6b6c76]">Intelligent Personnel Audit</p></div>
              </div>
              <button onClick={() => setShowStaffModal(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-slate-500">&times;</button>
            </div>

            <div className="grid lg:grid-cols-4 gap-10">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><Plus size={14}/> Deploy Agent</h3>
                  <form onSubmit={handleCreateStaff} className="space-y-4 bg-[#f8f8f7] dark:bg-slate-950 p-6 rounded-3xl border border-black/5 dark:border-white/5">
                    <input required type="email" placeholder="Email" className="w-full p-4 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-xl outline-none text-xs text-[#09090b] dark:text-white" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} />
                    <input required type="text" placeholder="Key" className="w-full p-4 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-xl outline-none text-xs font-mono text-[#09090b] dark:text-white" value={staffPass} onChange={e => setStaffPass(e.target.value)} />
                    <button disabled={creatingStaff} type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-600/10">Deploy Agent</button>
                  </form>
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Directory</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                    {staffList.map((s) => (
                      <div key={s.id} className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-black/5 dark:border-white/10 flex items-center justify-between group text-[#09090b] dark:text-white">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-10 h-10 rounded-full bg-[#f8f8f7] dark:bg-slate-900 border border-black/5 dark:border-white/5 flex items-center justify-center text-xs font-black text-slate-500">{s.email.substring(0,1).toUpperCase()}</div>
                          <div className="max-w-[120px]"><p className="text-[11px] font-bold truncate text-[#09090b] dark:text-slate-300">{s.email}</p><p className="text-[8px] font-black uppercase text-slate-500">{s.role}</p></div>
                        </div>
                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {s.role !== 'SUPER_ADMIN' && (
                            <>
                                <button onClick={() => handleResetPassword(s.id, s.email)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Key size={14}/></button>
                                <button onClick={() => handleDeleteStaff(s.id, s.email)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Live Audit Trail</h3>
                  <div className="bg-[#f8f8f7] dark:bg-slate-950 p-6 rounded-[2.5rem] border border-black/5 dark:border-white/10 max-h-[500px] overflow-y-auto scrollbar-thin">
                    {activityLogs.map((log) => (
                        <div key={log.id} className="flex gap-5 items-start border-l-2 border-black/5 dark:border-white/10 pl-8 pb-6 relative before:absolute before:left-[-5px] before:top-1.5 before:w-2 before:h-2 before:bg-indigo-600 before:rounded-full">
                           <div className="flex-1">
                             <div className="flex justify-between items-center text-[#09090b] dark:text-white">
                               <p className="text-[11px] font-black text-indigo-600 uppercase">{log.admin_email}</p>
                               <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(log.created_at).toLocaleTimeString()}</span>
                             </div>
                             <p className="text-[13px] font-medium text-[#4b5563] dark:text-slate-300 mt-1">
                               <span className="text-[#09090b] dark:text-white font-black uppercase">{log.action_type.replace(/_/g, ' ')}</span> on unit <span className="text-indigo-600 font-mono">#{log.target_id.slice(0,8)}</span>
                             </p>
                           </div>
                        </div>
                      ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#fbfbfa]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm text-[#09090b] dark:text-white">
        <div className="flex items-center gap-4 text-[#09090b] dark:text-white">
          <Link href="/" className="text-slate-500 hover:text-indigo-600 transition-colors"><ArrowLeft size={20} /></Link>
          <div className="h-8 w-px bg-black/5 dark:bg-white/5" />
          <h1 className="text-xl font-extrabold tracking-tighter uppercase italic text-indigo-600 dark:text-indigo-400">Ops Command</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {profile?.role === 'SUPER_ADMIN' && (
            <button onClick={() => setShowStaffModal(true)} className="p-2.5 rounded-xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <History size={18} />
            </button>
          )}
          <button onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-red-500 transition-all"><LogOut size={18} /></button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-12">

        {callbackRequests.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
             <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-xs font-black uppercase text-red-500 tracking-widest">Support Priority ({callbackRequests.length})</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {callbackRequests.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-slate-900 border border-red-500/20 p-6 rounded-[2.5rem] hover:shadow-2xl transition-all group relative overflow-hidden shadow-sm">
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-red-500/10 rounded-2xl text-red-600"><PhoneCall size={22}/></div>
                          <span className="text-[9px] font-black text-red-500/50 uppercase tracking-widest text-slate-500">{new Date(req.created_at).toLocaleTimeString()}</span>
                       </div>
                       <h4 className="text-xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">{req.bookings.customer_name}</h4>
                       <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{req.bookings.customer_phone}</span>
                             <Link href={`/admin/job/${req.booking_id}`} className="text-[8px] font-black text-indigo-600 hover:underline uppercase mt-1">Open Unit</Link>
                          </div>
                          <button
                            onClick={(e) => handleResolveCallback(e, req.id, req.booking_id)}
                            className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 group/btn"
                          >
                             <CheckCircle size={16} />
                             <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 max-w-0 group-hover/btn:max-w-[100px] transition-all overflow-hidden whitespace-nowrap">Mark Resolved</span>
                          </button>
                       </div>
                    </div>
                ))}
             </div>
          </div>
        )}

        <div className="space-y-8 text-[#09090b] dark:text-white">
          <div className="space-y-1 px-1">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">Navigator</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sector Overview</p>
          </div>

          {!selectedStage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {columns.map(col => {
                const count = bookings.filter(b => b.status === col.id).length;
                return (
                  <button key={col.id} onClick={() => setSelectedStage(col.id)} className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col items-start gap-6 hover:shadow-2xl hover:-translate-y-1.5 transition-all text-left group relative overflow-hidden shadow-sm min-h-[220px]">
                    <div className="w-12 h-12 rounded-2xl bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-sm"><LayoutGrid size={22} /></div>
                    <div className="space-y-1">
                      <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors uppercase">{col.title}</h3>
                      <p className="text-5xl font-black text-[#09090b] dark:text-white">{count}</p>
                    </div>
                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-indigo-600"><ChevronRight size={28}/></div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-[#09090b] dark:text-white">
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-xl font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-4 text-[#09090b] dark:text-white"><div className="w-3 h-3 rounded-full bg-current animate-pulse" /> {columns.find(c => c.id === selectedStage)?.title}</h3>
                 <button onClick={() => setSelectedStage(null)} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">← Hub</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-[#09090b] dark:text-white">
                {bookings.filter(b => b.status === selectedStage).map(booking => (
                  <Link key={booking.id} href={`/admin/job/${booking.id}`}>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 flex flex-col gap-6 group hover:border-indigo-600/30 transition-all shadow-sm">
                       <div className="flex justify-between items-start text-[#09090b] dark:text-white">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-tighter bg-[#f8f8f7] dark:bg-slate-950 px-3 py-1 rounded-xl border border-black/5 dark:border-white/5">{booking.id.slice(0, 8)}</span>
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{new Date(booking.created_at).toLocaleDateString('en-IN')}</span>
                       </div>
                       <div>
                          <h4 className="text-2xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white group-hover:text-indigo-600 transition-colors">{booking.customer_name}</h4>
                          <p className="text-[12px] text-[#4b5563] dark:text-slate-400 font-bold uppercase tracking-widest mt-2">{booking.device_brand} {booking.device_model}</p>
                       </div>
                       <div className="pt-6 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Unit Terminal</span>
                          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                       </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-12 text-center border-t border-black/5 dark:border-white/5">
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Cepheus Technology Protocol · Verified security link active</p>
      </footer>
    </div>
  );
}

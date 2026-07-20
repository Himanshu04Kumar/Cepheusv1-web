// @ts-nocheck
'use client';

import { ArrowLeft, Plus, Loader2, LogOut, Users, X, Shield, Key, Copy, Check, Trash2, ChevronRight, LayoutGrid, List, History, UserCog, Activity, PhoneCall } from 'lucide-react';
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
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query = query.eq('admin_email', filterValue).gte('created_at', lastWeek.toISOString());
    } else if (filterType === 'REGISTRY' && filterValue) {
      query = query.ilike('target_id', `${filterValue}%`);
    } else {
      query = query.limit(30);
    }

    const { data } = await query;
    if (data) setActivityLogs(data);
  };

  useEffect(() => {
    if (profile?.role === 'SUPER_ADMIN') fetchLogs();
  }, [filterType, filterValue, profile]);

  const fetchCallbacks = async () => {
    const { data } = await supabase
      .from('repair_comments')
      .select('*, bookings(customer_name, customer_phone, device_model)')
      .ilike('comment_text', '%CUSTOMER REQUESTED A CALLBACK%')
      .order('created_at', { ascending: false });
    if (data) setCallbackRequests(data);
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
    const newPass = prompt(`Enter new password for ${email}:`);
    if (!newPass || newPass.length < 6) return alert("Min 6 chars.");
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET_PASSWORD', userId, password: newPass }),
      });
      if (res.ok) alert("Success.");
    } catch (err) { alert("Error."); }
  };

  const handleDeleteStaff = async (userId: string, email: string) => {
    if (!confirm(`Permanently remove ${email}?`)) return;
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_EMPLOYEE', userId }),
      });
      if (res.ok) { alert("Staff Removed."); await fetchStaff(); }
    } catch (err) { alert("Error."); }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingStaff(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_EMPLOYEE', email: staffEmail, password: staffPass }),
      });
      if (res.ok) { alert('Agent Deployed!'); await fetchStaff(); setStaffEmail(''); setStaffPass(''); }
    } catch (err) { alert(err.message); }
    finally { setCreatingStaff(false); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login'); };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-indigo-600">
      <Loader2 className="animate-spin" size={48} />
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Ops Command...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 flex flex-col font-sans text-[#09090b] dark:text-white transition-colors duration-500 relative selection:bg-indigo-500/30">

      {/* Oversight Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-6 md:p-8 rounded-[2rem] w-full max-w-7xl shadow-2xl space-y-8 my-8">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3">
                 <Shield className="text-indigo-600" size={24} />
                 <h2 className="text-xl font-black uppercase tracking-tighter">Oversight Command</h2>
              </div>
              <button onClick={() => setShowStaffModal(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500 dark:text-slate-400"><X size={24}/></button>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">Deploy Agent</h3>
                  <form onSubmit={handleCreateStaff} className="space-y-3 bg-[#f8f8f7] dark:bg-slate-950 p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <input required type="email" placeholder="Email" className="w-full p-3 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-xl outline-none text-xs" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} />
                    <input required type="text" placeholder="Key" className="w-full p-3 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-xl outline-none text-xs font-mono" value={staffPass} onChange={e => setStaffPass(e.target.value)} />
                    <button disabled={creatingStaff} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black uppercase text-[10px] hover:bg-indigo-700 shadow-md shadow-indigo-600/20">Deploy</button>
                  </form>
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Agent Directory</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {staffList.map((s) => (
                      <div key={s.id} className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-black/5 dark:border-white/10 flex items-center justify-between group">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-8 h-8 rounded-full bg-[#f8f8f7] dark:bg-slate-900 border border-black/5 dark:border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">{s.email.substring(0,1).toUpperCase()}</div>
                          <p className="text-[10px] font-bold truncate text-[#09090b] dark:text-slate-300">{s.email}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {s.role !== 'SUPER_ADMIN' && (
                            <>
                                <button onClick={() => handleResetPassword(s.id, s.email)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"><Key size={14}/></button>
                                <button onClick={() => handleDeleteStaff(s.id, s.email)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Operational Audit</h3>
                  <div className="bg-[#f8f8f7] dark:bg-slate-950 p-4 rounded-3xl border border-black/5 dark:border-white/5 max-h-[400px] overflow-y-auto scrollbar-thin">
                    {activityLogs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start border-l-2 border-black/5 dark:border-white/10 pl-6 pb-4 relative before:absolute before:left-[-5px] before:top-2 before:w-2 before:h-2 before:bg-indigo-600 before:rounded-full">
                           <div className="flex-1">
                             <div className="flex justify-between items-center">
                               <p className="text-[10px] font-black text-indigo-600 uppercase">{log.admin_email}</p>
                               <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(log.created_at).toLocaleTimeString()}</span>
                             </div>
                             <p className="text-[11px] font-medium text-[#4b5563] dark:text-slate-300 mt-1">
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
      <header className="bg-[#fbfbfa]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-[#09090b] dark:hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <div className="h-8 w-px bg-black/5 dark:bg-white/5" />
          <h1 className="text-xl font-extrabold tracking-tighter uppercase italic text-indigo-600 dark:text-indigo-400">Ops Command</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {profile?.role === 'SUPER_ADMIN' && (
            <button onClick={() => setShowStaffModal(true)} className="p-2.5 rounded-xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all">
              <History size={18} />
            </button>
          )}
          <button onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#4b5563] dark:text-slate-400 hover:text-[#09090b] dark:hover:text-white transition-all"><LogOut size={18} /></button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-10">

        {/* Ops Navigator - Mobile First Grid RESTORED */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">Navigator</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operational Sector Overview</p>
            </div>
            {selectedStage && (
              <button onClick={() => setSelectedStage(null)} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
                View All Sectors <ChevronRight size={12} className="inline ml-1" />
              </button>
            )}
          </div>

          {!selectedStage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {columns.map(col => {
                const count = bookings.filter(b => b.status === col.id).length;
                return (
                  <button
                    key={col.id}
                    onClick={() => setSelectedStage(col.id)}
                    className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-6 rounded-[2rem] flex flex-col items-start gap-4 hover:shadow-xl hover:-translate-y-1 transition-all text-left group relative overflow-hidden shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <LayoutGrid size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{col.title}</h3>
                      <p className="text-3xl font-black mt-1 text-[#09090b] dark:text-white">{count}</p>
                    </div>
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 gap-4">
                {bookings.filter(b => b.status === selectedStage).map(booking => (
                  <Link key={booking.id} href={`/admin/job/${booking.id}`}>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 flex items-center justify-between group hover:border-indigo-600/30 transition-all shadow-sm">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-tighter bg-[#f8f8f7] dark:bg-slate-950 px-2 py-0.5 rounded border border-black/5 dark:border-white/5">{booking.id.slice(0, 8)}</span>
                             <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{new Date(booking.created_at).toLocaleDateString('en-IN')}</span>
                          </div>
                          <h4 className="text-lg font-black uppercase tracking-tighter text-[#09090b] dark:text-white">{booking.customer_name}</h4>
                          <p className="text-[10px] text-[#4b5563] dark:text-slate-400 font-bold uppercase tracking-widest">{booking.device_brand} {booking.device_model}</p>
                       </div>
                       <div className="w-12 h-12 rounded-2xl bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all shadow-sm">
                          <ChevronRight size={24}/>
                       </div>
                    </div>
                  </Link>
                ))}

                {bookings.filter(b => b.status === selectedStage).length === 0 && (
                  <div className="h-60 flex flex-col items-center justify-center bg-[#f8f8f7] dark:bg-slate-900/50 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[2rem] space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sector Empty</p>
                    <button onClick={() => setSelectedStage(null)} className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Return to Hub</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-8 text-center border-t border-black/5 dark:border-white/5">
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 italic">Cepheus Technology Protocol · Verified Security Session</p>
      </footer>
    </div>
  );
}

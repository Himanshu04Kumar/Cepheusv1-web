// @ts-nocheck
'use client';

import { ArrowLeft, Plus, Loader2, LogOut, Users, X, Shield, Key, Copy, Check, Trash2, ChevronRight, LayoutGrid, List, History, UserCog, Activity, PhoneCall, Filter, Calendar, Search } from 'lucide-react';
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
      // Past week logic
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

  // Re-fetch logs whenever filters change
  useEffect(() => {
    if (profile?.role === 'SUPER_ADMIN') fetchLogs();
  }, [filterType, filterValue]);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white transition-colors relative selection:bg-blue-500/30">

      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto text-white">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-7xl shadow-2xl space-y-12 my-8 text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                 <Shield className="text-blue-500" size={32} />
                 <div><h2 className="text-2xl font-black uppercase tracking-tighter text-white">Oversight Command</h2><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Intelligent Audit & Control</p></div>
              </div>
              <button onClick={() => setShowStaffModal(false)} className="p-3 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white"><X size={28}/></button>
            </div>

            <div className="grid lg:grid-cols-4 gap-12 text-white">
               {/* AGENT MGMT */}
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest flex items-center gap-2"><Plus size={14}/> Deploy Agent</h3>
                  <form onSubmit={handleCreateStaff} className="space-y-3 bg-slate-950 p-6 rounded-3xl border border-slate-800/50">
                    <input required type="email" placeholder="Email" className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl outline-none text-xs" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} />
                    <input required type="text" placeholder="Key" className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl outline-none text-xs font-mono" value={staffPass} onChange={e => setStaffPass(e.target.value)} />
                    <button disabled={creatingStaff} type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-blue-500">Deploy</button>
                  </form>

                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 pt-4"><UserCog size={14}/> Directory</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                    {staffList.map((s) => (
                      <div key={s.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between group">
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">{s.email.substring(0,1).toUpperCase()}</div>
                          <p className="text-[10px] font-bold text-slate-300 truncate">{s.email}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {s.role !== 'SUPER_ADMIN' && (
                            <>
                              <button onClick={() => { setFilterType('EMPLOYEE'); setFilterValue(s.email); }} className="p-1.5 text-slate-700 hover:text-blue-400" title="Filter Audits"><Filter size={12}/></button>
                              <button onClick={() => handleDeleteStaff(s.id, s.email)} className="p-1.5 text-slate-700 hover:text-red-500"><Trash2 size={12}/></button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* INTELLIGENT AUDIT TRAIL */}
               <div className="lg:col-span-3 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest flex items-center gap-2"><Activity size={14}/> Audit Intelligence</h3>

                    {/* FILTERS */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
                       <button onClick={() => { setFilterType('ALL'); setFilterValue(''); }} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterType === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>All</button>
                       <div className="flex-1 flex items-center px-3 gap-2 border-l border-white/5">
                          <Search size={12} className="text-slate-600"/>
                          <input
                            placeholder={filterType === 'EMPLOYEE' ? "Filtering by Email..." : "Enter Registry ID..."}
                            className="bg-transparent outline-none text-[10px] w-full font-bold placeholder:text-slate-700"
                            value={filterType === 'ALL' ? '' : filterValue}
                            onChange={(e) => {
                               if (filterType === 'ALL') setFilterType('REGISTRY');
                               setFilterValue(e.target.value);
                            }}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-3xl border border-slate-800/50 p-4 shadow-inner">
                    <div className="max-h-[500px] overflow-y-auto space-y-4 scrollbar-thin px-2">
                      {activityLogs.length === 0 && <p className="text-[10px] text-slate-700 uppercase font-black text-center py-20 italic">No logs found for this criteria.</p>}
                      {activityLogs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start border-l-2 border-slate-800 pl-6 pb-2 relative before:absolute before:left-[-5px] before:top-2 before:w-2 before:h-2 before:bg-blue-600 before:rounded-full">
                           <div className="flex-1">
                             <div className="flex justify-between items-center">
                               <p className="text-[10px] font-black text-blue-400 uppercase">{log.admin_email}</p>
                               <span className="text-[8px] font-bold text-slate-600 uppercase flex items-center gap-1"><Calendar size={10}/> {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}</span>
                             </div>
                             <p className="text-[11px] font-medium text-slate-300 mt-1">
                               <span className="text-white font-black uppercase">{log.action_type.replace(/_/g, ' ')}</span> on unit <button onClick={() => { setFilterType('REGISTRY'); setFilterValue(log.target_id.slice(0,8)); }} className="text-blue-500 font-mono hover:underline">#{log.target_id.slice(0,8)}</button>
                             </p>
                             {log.details && <p className="text-[9px] text-slate-500 mt-1 italic leading-relaxed">{log.details}</p>}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <div className="h-8 w-px bg-slate-800" />
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Ops Command</h1>
        </div>
        <div className="flex items-center gap-2">
          {profile?.role === 'SUPER_ADMIN' && (
            <button onClick={() => setShowStaffModal(true)} className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 px-3 text-white">
              <History size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Oversight</span>
            </button>
          )}
          <button onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-white"><LogOut size={18} /></button>
        </div>
      </header>

      {/* NAVIGATOR */}
      <main className="flex-1 p-6 space-y-12 max-w-7xl mx-auto w-full text-white">
        {callbackRequests.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700 text-white">
             <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-xs font-black uppercase text-red-500 tracking-widest">Support Alerts ({callbackRequests.length})</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-white">
                {callbackRequests.map((req) => (
                  <Link key={req.id} href={`/admin/job/${req.booking_id}`}>
                    <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-[2rem] hover:bg-red-500/10 transition-all group relative overflow-hidden text-white">
                       <div className="flex justify-between items-start mb-4 text-white">
                          <div className="p-2.5 bg-red-500/20 rounded-xl text-red-500"><PhoneCall size={20}/></div>
                          <span className="text-[8px] font-black text-red-500/50 uppercase tracking-widest">{new Date(req.created_at).toLocaleTimeString()}</span>
                       </div>
                       <h4 className="text-lg font-black uppercase tracking-tighter text-white">{req.bookings.customer_name}</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-white">{req.bookings.device_model}</p>
                       <div className="mt-6 pt-4 border-t border-red-500/10 flex justify-between items-center text-white">
                          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest text-white">Call: {req.bookings.customer_phone}</span>
                          <ChevronRight size={16} className="text-red-500 group-hover:translate-x-1 transition-transform text-white"/>
                       </div>
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        )}

        <div className="space-y-4 text-white">
          <div className="flex items-center justify-between px-1 text-white">
            <div><h2 className="text-2xl font-black uppercase tracking-tighter text-white">Navigator</h2><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Select sector to view units</p></div>
            {selectedStage && <button onClick={() => setSelectedStage(null)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1 hover:underline text-white">View All Sectors <ChevronRight size={12}/></button>}
          </div>

          {!selectedStage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
              {columns.map(col => {
                const count = bookings.filter(b => b.status === col.id).length;
                return (
                  <button key={col.id} onClick={() => setSelectedStage(col.id)} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col items-start gap-4 hover:bg-blue-600/5 hover:border-blue-500/20 transition-all text-left group relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-2xl rounded-full -mr-12 -mt-12 transition-colors text-white" />
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-blue-500 shadow-xl group-hover:scale-110 transition-transform text-white"><LayoutGrid size={18} /></div>
                    <div><h3 className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors text-white uppercase">{col.title}</h3><p className="text-2xl font-black mt-1 text-white">{count} <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest ml-1">Units</span></p></div>
                    <ChevronRight className="absolute bottom-6 right-6 text-slate-700 group-hover:text-blue-500 transition-colors text-white" size={20}/>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 text-white">
              {bookings.filter(b => b.status === selectedStage).map(booking => (
                <Link key={booking.id} href={`/admin/job/${booking.id}`}>
                  <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all shadow-xl text-white text-white">
                     <div className="space-y-1 text-white text-white text-white">
                        <div className="flex items-center gap-2"><span className="text-[9px] font-mono text-slate-600 uppercase font-black tracking-tighter bg-slate-950 px-2 py-0.5 rounded border border-white/5 text-white">{booking.id.slice(0, 8)}</span><span className="text-[9px] font-black text-blue-500 uppercase tracking-widest text-white">{new Date(booking.created_at).toLocaleDateString('en-IN')}</span></div>
                        <h4 className="text-lg font-black uppercase tracking-tighter text-white">{booking.customer_name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white">{booking.device_brand} {booking.device_model}</p>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-blue-500 transition-all text-white"><ChevronRight size={24}/></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

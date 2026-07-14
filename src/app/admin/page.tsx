// @ts-nocheck
'use client';

import { ArrowLeft, Plus, Loader2, LogOut, Users, X, Shield, Key, Copy, Check, Trash2, ChevronRight, LayoutGrid, List, History, UserCog, Activity } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const router = useRouter();

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
    const { data } = await supabase.from('staff_activity_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setActivityLogs(data);
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
      await fetchBookings();
      if (prof?.role === 'SUPER_ADMIN') {
        await fetchStaff();
        await fetchLogs();
      }
      setLoading(false);
    }
    init();
    const channel = supabase.channel('admin_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchBookings()).subscribe();
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
      else alert("Failed.");
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
            <div className="flex justify-between items-center border-b border-slate-800 pb-6 text-white">
              <div className="flex items-center gap-3">
                 <Shield className="text-blue-500" size={32} />
                 <div><h2 className="text-2xl font-black uppercase tracking-tighter text-white">Oversight Command</h2><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Personnel & Audit Logs</p></div>
              </div>
              <button onClick={() => setShowStaffModal(false)} className="p-3 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white"><X size={28}/></button>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 text-white">
               {/* 1. INITIALIZE AGENT (ADD) */}
               <div className="space-y-6 bg-slate-950 p-8 rounded-[2rem] border border-slate-800/50">
                  <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest flex items-center gap-2"><Plus size={14}/> Deploy New Agent</h3>
                  <form onSubmit={handleCreateStaff} className="space-y-4">
                    <input required type="email" placeholder="Work Email" className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:ring-1 ring-blue-500 text-sm text-white" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} />
                    <input required type="text" placeholder="Protocol Key" className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:ring-1 ring-blue-500 text-sm font-mono text-white" value={staffPass} onChange={e => setStaffPass(e.target.value)} />
                    <button disabled={creatingStaff} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">{creatingStaff ? <Loader2 className="animate-spin mx-auto"/> : 'Deploy Account'}</button>
                  </form>
               </div>

               {/* 2. ACTIVE AGENTS (LIST/DELETE/RESET) */}
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><UserCog size={14}/> Agent Directory</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                    {staffList.map((s) => (
                      <div key={s.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-400 group-hover:text-blue-400">{s.email.substring(0,1).toUpperCase()}</div>
                          <div className="max-w-[120px]"><p className="text-xs font-bold text-slate-300 truncate">{s.email}</p><p className={`text-[8px] font-black uppercase ${s.role === 'SUPER_ADMIN' ? 'text-blue-500' : 'text-slate-600'}`}>{s.role}</p></div>
                        </div>
                        <div className="flex gap-1">
                          {s.role !== 'SUPER_ADMIN' && (
                            <>
                              <button onClick={() => handleResetPassword(s.id, s.email)} className="p-2 text-slate-700 hover:text-blue-500 transition-colors" title="Reset Password"><Key size={14}/></button>
                              <button onClick={() => handleDeleteStaff(s.id, s.email)} className="p-2 text-slate-700 hover:text-red-500 transition-colors" title="Delete Staff"><Trash2 size={14}/></button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* 3. AUDIT LOG */}
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Activity size={14}/> Audit Trail</h3>
                  <div className="bg-slate-950/50 rounded-3xl border border-slate-800/50 p-4 overflow-hidden shadow-inner">
                    <div className="max-h-[500px] overflow-y-auto space-y-4 scrollbar-thin">
                      {activityLogs.map((log) => (
                        <div key={log.id} className="border-l-2 border-slate-800 pl-4 pb-2 relative before:absolute before:left-[-5px] before:top-1 before:w-2 before:h-2 before:bg-blue-600 before:rounded-full">
                           <p className="text-[8px] font-black text-blue-400 uppercase">{log.admin_email}</p>
                           <p className="text-[10px] font-medium text-slate-300 mt-1 uppercase"><span className="text-white font-black">{log.action_type}</span>: UNIT {log.target_id.slice(0,4)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <div className="h-8 w-px bg-slate-800" />
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">Ops Command</h1>
        </div>
        <div className="flex items-center gap-2">
          {profile?.role === 'SUPER_ADMIN' && (
            <button onClick={() => setShowStaffModal(true)} className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 px-3">
              <History size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Oversight</span>
            </button>
          )}
          <button onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><LogOut size={18} /></button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 max-w-6xl mx-auto w-full text-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><h2 className="text-2xl font-black uppercase tracking-tighter text-white">Navigator</h2><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Select sector to view units</p></div>
            {selectedStage && <button onClick={() => setSelectedStage(null)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1 hover:underline text-white">View All Sectors <ChevronRight size={12}/></button>}
          </div>

          {!selectedStage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
              {columns.map(col => {
                const count = bookings.filter(b => b.status === col.id).length;
                return (
                  <button key={col.id} onClick={() => setSelectedStage(col.id)} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col items-start gap-4 hover:bg-blue-600/5 hover:border-blue-500/20 transition-all text-left group relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-2xl rounded-full -mr-12 -mt-12 transition-colors" />
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-blue-500 shadow-xl group-hover:scale-110 transition-transform"><LayoutGrid size={18} /></div>
                    <div><h3 className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors uppercase">{col.title}</h3><p className="text-2xl font-black mt-1 text-white">{count} <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest ml-1">Units</span></p></div>
                    <ChevronRight className="absolute bottom-6 right-6 text-slate-700 group-hover:text-blue-500 transition-colors" size={20}/>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
              <div className="grid grid-cols-1 gap-4 text-white">
                {bookings.filter(b => b.status === selectedStage).map(booking => (
                  <Link key={booking.id} href={`/admin/job/${booking.id}`}>
                    <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all shadow-xl text-white">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2"><span className="text-[9px] font-mono text-slate-600 uppercase font-black tracking-tighter bg-slate-950 px-2 py-0.5 rounded border border-white/5">{booking.id.slice(0, 8)}</span><span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{new Date(booking.created_at).toLocaleDateString('en-IN')}</span></div>
                          <h4 className="text-lg font-black uppercase tracking-tighter text-white">{booking.customer_name}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{booking.device_brand} {booking.device_model}</p>
                       </div>
                       <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-blue-500 transition-all text-white"><ChevronRight size={24}/></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

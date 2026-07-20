// @ts-nocheck
'use client';

import { ArrowLeft, Plus, Loader2, LogOut, Users, X, Shield, Key, Copy, Check, Trash2, ChevronRight, LayoutGrid, List, History } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const router = useRouter();

  // Staff creation form
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [creatingStaff, setCreatingStaff] = useState(false);

  const columns = [
    { id: 'BOOKED', title: 'New Bookings', color: 'blue' },
    { id: 'PICKED_UP', title: 'Picked Up', color: 'indigo' },
    { id: 'DIAGNOSING', title: 'Diagnosing', color: 'purple' },
    { id: 'AWAITING_APPROVAL', title: 'Awaiting Approval', color: 'amber' },
    { id: 'IN_REPAIR', title: 'In Repair', color: 'blue' },
    { id: 'QUALITY_CHECK', color: 'cyan', title: 'Quality Check' },
    { id: 'DELIVERED', title: 'Completed', color: 'green' },
  ];

  const fetchStaff = async () => {
    const { data } = await supabase.from('admin_profiles').select('*').order('created_at', { ascending: false });
    if (data) setStaffList(data);
  };

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (data) setBookings(data);
  };

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: prof } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(prof);
      await fetchBookings();
      if (prof?.role === 'SUPER_ADMIN') {
        await fetchStaff();
      }
      setLoading(false);
    }

    init();

    const channel = supabase.channel('admin_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingStaff(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_EMPLOYEE',
          email: staffEmail,
          password: staffPass
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Account Deployed!');
      await fetchStaff();
      setShowStaffModal(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setCreatingStaff(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white transition-colors relative selection:bg-blue-500/30">

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black uppercase tracking-tighter">Staff Directory</h2>
              <button onClick={() => setShowStaffModal(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500"><X size={24}/></button>
            </div>
            <form onSubmit={handleCreateStaff} className="space-y-4">
               <input required type="email" placeholder="Work Email" className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:ring-1 ring-blue-500" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} />
               <input required type="text" placeholder="Protocol Key" className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:ring-1 ring-blue-500" value={staffPass} onChange={e => setStaffPass(e.target.value)} />
               <button disabled={creatingStaff} type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all">Deploy Account</button>
            </form>
          </div>
        </div>
      )}

      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-8 w-px bg-slate-800" />
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Ops Command</h1>
        </div>

        <div className="flex items-center gap-2">
          {profile?.role === 'SUPER_ADMIN' && (
            <button onClick={() => setShowStaffModal(true)} className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
              <Users size={18} />
            </button>
          )}
          <button onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6 flex gap-6 scrollbar-hide">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full bg-${column.color}-500 shadow-[0_0_8px] shadow-${column.color}-500/50`} />
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">{column.title}</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-900/50 px-2 py-0.5 rounded-full border border-white/5">
                {bookings.filter(b => b.status === column.id).length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-3 min-h-[200px]">
              {bookings
                .filter((booking) => booking.status === column.id)
                .map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/job/${booking.id}`}
                    className="bg-slate-900 border border-white/5 p-5 rounded-3xl hover:border-blue-500/30 hover:bg-slate-800/50 transition-all group shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-slate-600 uppercase font-black tracking-tighter bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                          {booking.id.slice(0, 8)}
                        </span>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                          {new Date(booking.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
                          {booking.customer_name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                          {booking.device_brand} {booking.device_model}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                         <div className="flex items-center gap-1.5 text-slate-600">
                            <History size={10} />
                            <span className="text-[8px] font-black uppercase tracking-tighter">In Queue</span>
                         </div>
                         <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}

              {bookings.filter(b => b.status === column.id).length === 0 && (
                <div className="h-32 border border-dashed border-white/5 rounded-3xl flex items-center justify-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-800">Clear Sector</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      <div className="p-6 text-center">
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-800 italic">Cepheus Operations Protocol · v1.0.4</p>
      </div>
    </div>
  );
}

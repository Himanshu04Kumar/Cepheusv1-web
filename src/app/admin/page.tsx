// @ts-nocheck
'use client';

import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'BOOKED', title: 'New Bookings' },
    { id: 'PICKED_UP', title: 'Picked Up' },
    { id: 'DIAGNOSING', title: 'Diagnosing' },
    { id: 'AWAITING_APPROVAL', title: 'Awaiting Approval' },
    { id: 'IN_REPAIR', title: 'In Repair' },
    { id: 'QUALITY_CHECK', title: 'Quality Check' },
    { id: 'DELIVERED', title: 'Completed' },
  ];

  useEffect(() => {
    async function fetchBookings() {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setBookings(data);
      setLoading(false);
    }
    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase.channel('admin_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white transition-colors">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-8 w-px bg-slate-800" />
          <h1 className="text-xl font-black tracking-tighter uppercase">Ops Command</h1>
          <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6 scrollbar-thin">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map(col => (
            <div key={col.id} className="w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-[10px] text-slate-500 uppercase tracking-[0.2em]">{col.title}</h3>
                  <span className="bg-slate-800 text-blue-400 text-[11px] font-black px-2 py-0.5 rounded-full border border-slate-700">
                    {bookings.filter(b => b.status === col.id).length}
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex-1 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/50 overflow-y-auto min-h-[500px]">
                {bookings.filter(b => b.status === col.id).map(booking => (
                  <Link key={booking.id} href={`/admin/job/${booking.id}`}>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-blue-400 transition-colors uppercase tracking-tighter font-bold">
                          {booking.id.slice(0, 8)}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-200 mb-1">{booking.customer_name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{booking.device_brand} {booking.device_model}</p>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
                          Manage Job →
                        </span>
                        <span className="text-[9px] font-bold text-slate-600 italic">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                {bookings.filter(b => b.status === col.id).length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-700 text-[10px] font-black uppercase tracking-widest italic">
                    Empty Stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

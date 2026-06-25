'use client';

import { ArrowLeft, Search, Plus, Filter, MoreVertical, LayoutGrid, List, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'BOOKED', title: 'New Bookings' },
    { id: 'PICKED_UP', title: 'Picked Up' },
    { id: 'DIAGNOSING', title: 'Diagnosing' },
    { id: 'AWAITING_APPROVAL', title: 'Awaiting Approval' },
    { id: 'IN_REPAIR', title: 'In Repair' },
    { id: 'DELIVERED', title: 'Completed' },
  ];

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setBookings(data);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground transition-colors">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-8 w-px bg-border" />
          <h1 className="text-xl font-bold tracking-tight">Ops Command</h1>
          <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 shadow-sm transition-all active:scale-95">
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-auto p-6 bg-background transition-colors">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map(col => (
            <div key={col.id} className="w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">{col.title}</h3>
                  <span className="bg-muted text-muted-foreground text-[11px] font-bold px-2 py-0.5 rounded-full border border-border/50">
                    {bookings.filter(b => b.status === col.id).length}
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex-1 bg-muted/30 p-3 rounded-xl border border-border/50 overflow-y-auto">
                {bookings.filter(b => b.status === col.id).map(booking => (
                  <Link key={booking.id} href={`/admin/job/${booking.id}`}>
                    <div className="bg-card p-4 rounded-lg shadow-sm border border-border group hover:border-primary/50 hover:shadow-md transition-all cursor-pointer mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-primary/60 font-mono tracking-tighter uppercase">{booking.id.slice(0, 8)}</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{booking.customer_name}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{booking.device_brand} {booking.device_model}</p>

                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-colors">
                          Manage →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                {bookings.filter(b => b.status === col.id).length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground/30 text-xs font-medium italic">
                    No active jobs
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

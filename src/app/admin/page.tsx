'use client';

import { ArrowLeft, Search, Plus, Filter, MoreVertical, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminDashboard() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  // Mock data for Admin MVP
  const columns = [
    { id: 'BOOKED', title: 'New Bookings', count: 3 },
    { id: 'PICKED_UP', title: 'Picked Up', count: 2 },
    { id: 'DIAGNOSING', title: 'Diagnosing', count: 4 },
    { id: 'AWAITING_APPROVAL', title: 'Awaiting Approval', count: 1 },
    { id: 'IN_REPAIR', title: 'In Repair', count: 5 },
    { id: 'DELIVERED', title: 'Completed', count: 12 },
  ];

  const bookings = [
    { id: 'CEP-1234', customer: 'Anxious Owner', device: 'Dell XPS 13', status: 'AWAITING_APPROVAL', priority: 'high' },
    { id: 'CEP-5678', customer: 'Himanshu Kumar', device: 'MacBook Pro', status: 'DIAGNOSING', priority: 'medium' },
    { id: 'CEP-9012', customer: 'Rahul Sharma', device: 'HP Spectre', status: 'BOOKED', priority: 'low' },
  ];

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
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-full text-sm focus:ring-2 focus:ring-primary outline-none w-64 transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <ThemeToggle />
          <button className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 shadow-sm transition-all active:scale-95">
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between shadow-xs transition-colors">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
            <Filter size={16} />
            Filter
          </button>
          <div className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground font-bold">24</span> active repairs
          </div>
        </div>

        <div className="flex bg-muted p-1 rounded-lg border border-border">
          <button
            onClick={() => setView('kanban')}
            className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-auto p-6 bg-background transition-colors">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map(col => (
            <div key={col.id} className="w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">{col.title}</h3>
                  <span className="bg-muted text-muted-foreground text-[11px] font-bold px-2 py-0.5 rounded-full border border-border/50">{col.count}</span>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="space-y-4 flex-1 bg-muted/30 p-3 rounded-xl border border-border/50 overflow-y-auto">
                {bookings.filter(b => b.status === col.id).map(booking => (
                  <div key={booking.id} className="bg-card p-4 rounded-lg shadow-sm border border-border group hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-primary/60 font-mono tracking-tighter">{booking.id}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        booking.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse' :
                        booking.priority === 'medium' ? 'bg-amber-500' : 'bg-muted-foreground/30'
                      }`} />
                    </div>
                    <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{booking.customer}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{booking.device}</p>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary">HK</div>
                      </div>
                      <Link href={`/admin/job/${booking.id}`} className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}

                {bookings.filter(b => b.status === col.id).length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground/50 text-xs font-medium italic">
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

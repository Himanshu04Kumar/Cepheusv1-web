'use client';

import { ArrowLeft, Search, Plus, Filter, MoreVertical, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-8 w-px bg-gray-200" />
          <h1 className="text-xl font-bold tracking-tight">Ops Command</h1>
          <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
            />
          </div>
          <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-sm transition-all active:scale-95">
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <Filter size={16} />
            Filter
          </button>
          <div className="text-sm text-gray-400 font-medium">
            Showing <span className="text-gray-900 font-bold">24</span> active repairs
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setView('kanban')}
            className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map(col => (
            <div key={col.id} className="w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wide">{col.title}</h3>
                  <span className="bg-gray-200 text-gray-600 text-[11px] font-bold px-2 py-0.5 rounded-full">{col.count}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="space-y-4 flex-1 bg-gray-200/50 p-3 rounded-xl border border-gray-200/60 overflow-y-auto">
                {bookings.filter(b => b.status === col.id).map(booking => (
                  <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 group hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-blue-600/60 font-mono tracking-tighter">{booking.id}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        booking.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse' :
                        booking.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'
                      }`} />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{booking.customer}</h4>
                    <p className="text-xs text-gray-500 font-medium">{booking.device}</p>

                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">HK</div>
                      </div>
                      <Link href={`/admin/job/${booking.id}`} className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}

                {bookings.filter(b => b.status === col.id).length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-xs font-medium italic italic">
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

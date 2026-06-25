'use client';

import { ArrowLeft, Clock, Camera } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Timeline } from '@/components/Timeline';
import { ApprovalGate } from '@/components/ApprovalGate';

export default function TrackingPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data for MVP
  const booking = {
    id: id,
    status: 'AWAITING_APPROVAL',
    device: 'Dell XPS 13',
    issue: 'Screen flickering and battery drain',
    createdAt: '25 June 2026'
  };

  const timelineItems = [
    { status: 'Booked', date: '25 Jun, 10:00 AM', completed: true },
    { status: 'Picked Up', date: '25 Jun, 02:00 PM', completed: true },
    { status: 'Diagnosing', date: '25 Jun, 04:00 PM', completed: true },
    { status: 'Awaiting Approval', date: 'Pending', completed: false, active: true },
    { status: 'In Repair', date: '-', completed: false },
    { status: 'Quality Check', date: '-', completed: false },
    { status: 'Delivered', date: '-', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Repair Status</h1>
        </div>

        {/* Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Booking ID</p>
              <h2 className="text-xl font-mono font-bold text-blue-600">{id}</h2>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
              <Clock size={16} />
              {booking.status.replace('_', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Device</p>
              <p className="font-medium">{booking.device}</p>
            </div>
            <div>
              <p className="text-gray-500">Booked On</p>
              <p className="font-medium">{booking.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Approval Gate */}
        {booking.status === 'AWAITING_APPROVAL' && (
          <ApprovalGate
            diagnosis="Battery swelling causing pressure on display cables. Screen replacement not needed, just battery replacement and cable reseating."
            parts="Genuine 52Wh Dell Battery"
            price={4850}
            onApprove={() => alert('Approved!')}
            onDecline={() => alert('Declined!')}
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Timeline items={timelineItems} />

          {/* Photo Log */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <Camera size={18} className="text-blue-600" />
              Repair Photo Log
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="aspect-video bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs text-center p-2">
                  [PICKUP PHOTO: External Condition]
                </div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Picked Up</p>
              </div>
              <div className="space-y-2 opacity-50">
                <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed flex items-center justify-center text-gray-400 text-xs">
                  Awaiting...
                </div>
                <p className="text-[10px] font-bold uppercase text-gray-400 font-mono">In Repair</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
              Photographic documentation is provided at every stage to ensure 100% transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

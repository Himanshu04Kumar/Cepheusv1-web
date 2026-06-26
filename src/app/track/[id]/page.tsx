// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Camera, Loader2, AlertCircle, Phone, Calendar, Hash } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Timeline } from '@/components/Timeline';
import { ApprovalGate } from '@/components/ApprovalGate';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function TrackingPage() {
  const params = useParams();
  const idString = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [approvalRequest, setApprovalRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!idString) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch Booking - Flexible search to handle both full UUID and short 8-char codes
        // We cast the UUID column to text to allow partial matching
        const { data: bData, error: bError } = await supabase
          .from('bookings')
          .select('*')
          .or(`id.eq.${idString},id.ilike.${idString}%`)
          .maybeSingle();

        if (bError) throw bError;

        if (!bData) {
          setBooking(null);
          setLoading(false);
          return;
        }

        const realId = bData.id;
        setBooking(bData);

        // Fetch Photos using the REAL ID
        const { data: pData } = await supabase
          .from('repair_photos')
          .select('*')
          .eq('booking_id', realId)
          .order('created_at', { ascending: true });

        if (pData) setPhotos(pData);

        // Fetch Pending Approval
        const { data: aData } = await supabase
          .from('approval_requests')
          .select('*')
          .eq('booking_id', realId)
          .eq('status', 'PENDING')
          .maybeSingle();

        if (aData) setApprovalRequest(aData);

      } catch (err: any) {
        console.error('Error fetching tracking data:', err);
        setError(err.message || 'Failed to load tracking data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [idString]);

  const handleApprove = async () => {
    if (!approvalRequest || !booking) return;
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({ status: 'APPROVED', responded_at: new Date().toISOString() } as any)
        .eq('id', approvalRequest.id);

      if (error) throw error;

      await supabase
        .from('bookings')
        .update({ status: 'IN_REPAIR' } as any)
        .eq('id', booking.id);

      window.location.reload();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleDecline = async () => {
    if (!approvalRequest || !booking) return;
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({ status: 'DECLINED', responded_at: new Date().toISOString() } as any)
        .eq('id', approvalRequest.id);

      if (error) throw error;

      await supabase
        .from('bookings')
        .update({ status: 'DECLINED' } as any)
        .eq('id', booking.id);

      window.location.reload();
    } catch (err: any) {
      alert(`Decline failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-sm font-medium animate-pulse uppercase tracking-widest text-white">Locating Repair Record...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center text-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">Sync Error</h1>
        <p className="text-slate-400 mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition text-white">
          Retry Sync
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center text-white">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white">Booking Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          We couldn't find a record for ID: <span className="text-blue-400 font-mono">{idString}</span>.
        </p>
        <Link href="/" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const statuses = [
    'PENDING_PAYMENT', 'BOOKED', 'PICKED_UP', 'DIAGNOSING',
    'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'DELIVERED'
  ];

  const currentStatus = booking.status || 'BOOKED';
  const currentIdx = statuses.indexOf(currentStatus);

  const timelineItems = statuses.map((s, i) => ({
    status: s.replace('_', ' '),
    date: i <= currentIdx ? (i === currentIdx ? 'Active' : 'Completed') : '-',
    completed: i < currentIdx,
    active: i === currentIdx
  })).filter(item => item.status !== 'PENDING PAYMENT');

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-white transition-colors">
      <div className="max-w-3xl mx-auto space-y-6 text-white">
        <div className="flex flex-col gap-4 text-white">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={20} /> <span className="text-xs uppercase font-bold tracking-widest text-white">Home</span>
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Repair Status</h1>
            <div className="flex flex-wrap gap-3 text-white">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl text-white">
                <Hash size={12} className="text-slate-500"/>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-tighter">{booking.id.slice(0, 8)}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl text-white">
                <Phone size={12} className="text-slate-500"/>
                <span className="text-[10px] font-bold text-white">{booking?.customer_phone}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl text-white">
                <Calendar size={12} className="text-slate-500"/>
                <span className="text-[10px] font-bold text-white">{new Date(booking?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative group text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-white">
            <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-blue-500/20 uppercase">
              {currentStatus.replace('_', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-6 border-t border-slate-800/50 text-white">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1 text-white">Hardware Instance</p>
              <p className="text-lg font-bold text-slate-200">{booking.device_brand} {booking.device_model}</p>
            </div>
            <div className="text-right md:text-left text-white">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1 text-white">Ownership</p>
              <p className="text-lg font-bold text-slate-200">{booking.customer_name}</p>
            </div>
          </div>
        </div>

        {/* Approval Gate */}
        {approvalRequest && (
          <div className="animate-in fade-in zoom-in duration-500 text-white">
            <ApprovalGate
              diagnosis={approvalRequest.diagnosis_text}
              parts={approvalRequest.parts_detail}
              price={approvalRequest.quoted_price}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 text-white">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl text-white">
            <Timeline items={timelineItems} />
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 space-y-6 text-white">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <Camera size={18} className="text-blue-500" />
              <span className="uppercase text-xs tracking-[0.2em] font-black text-white">Visual Proof Log</span>
            </h3>

            {photos.length === 0 ? (
              <div className="bg-slate-950/50 p-12 rounded-2xl border border-dashed border-slate-800 text-center text-white">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-white">Technician evidence pending</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 text-white">
                {photos.map((photo, i) => (
                  <div key={i} className="space-y-2 group text-white">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white">
                      <img src={photo.photo_url} alt={photo.stage} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      <p className="absolute bottom-3 left-4 text-[9px] font-black uppercase text-white tracking-widest">{photo.stage.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 text-white">
              <p className="text-[11px] text-blue-400/80 italic leading-relaxed font-medium text-white">
                <strong className="text-white">Protocol:</strong> All parts removed and installed are documented via photographic evidence to ensure 100% transparency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

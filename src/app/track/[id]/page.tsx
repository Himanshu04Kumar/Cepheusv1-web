// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Camera, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Timeline } from '@/components/Timeline';
import { ApprovalGate } from '@/components/ApprovalGate';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function TrackingPage() {
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [approvalRequest, setApprovalRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch Booking
        const { data: bData, error: bError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (bError) throw bError;
        if (!bData) {
          setBooking(null);
          setLoading(false);
          return;
        }
        setBooking(bData);

        // Fetch Photos
        const { data: pData } = await supabase
          .from('repair_photos')
          .select('*')
          .eq('booking_id', id)
          .order('created_at', { ascending: true });

        if (pData) setPhotos(pData);

        // Fetch Pending Approval
        const { data: aData } = await supabase
          .from('approval_requests')
          .select('*')
          .eq('booking_id', id)
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
  }, [id]);

  const handleApprove = async () => {
    if (!approvalRequest) return;
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({ status: 'APPROVED', responded_at: new Date().toISOString() } as any)
        .eq('id', approvalRequest.id);

      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleDecline = async () => {
    if (!approvalRequest) return;
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({ status: 'DECLINED', responded_at: new Date().toISOString() } as any)
        .eq('id', approvalRequest.id);

      if (error) throw error;
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
          <p className="text-sm font-medium animate-pulse">Fetching your repair status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center text-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-slate-400 mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
          Try Again
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-slate-400 mb-8">We couldn't find a repair order with ID: {id}</p>
        <Link href="/" className="text-blue-500 hover:underline font-bold">Return to Homepage</Link>
      </div>
    );
  }

  // Generate timeline based on status
  const statuses = [
    'PENDING_PAYMENT', 'BOOKED', 'PICKED_UP', 'DIAGNOSING',
    'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'DELIVERED'
  ];

  const currentStatus = booking.status || 'BOOKED';
  const currentIdx = statuses.indexOf(currentStatus);

  const timelineItems = statuses.map((s, i) => ({
    status: s.replace('_', ' '),
    date: i <= currentIdx ? (i === currentIdx ? 'In Progress' : 'Completed') : '-',
    completed: i < currentIdx,
    active: i === currentIdx
  })).filter(item => item.status !== 'PENDING PAYMENT');

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-white transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Repair Status</h1>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black mb-1">Booking ID</p>
              <h2 className="text-2xl font-mono font-bold text-blue-400 uppercase tracking-tighter">{id.slice(0, 8)}</h2>
            </div>
            <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border border-blue-500/20 uppercase">
              {currentStatus.replace('_', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-6 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Device</p>
              <p className="font-semibold text-slate-200">{booking.device_brand} {booking.device_model}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Booked On</p>
              <p className="font-semibold text-slate-200">{new Date(booking.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Approval Gate */}
        {approvalRequest && (
          <div className="animate-in fade-in zoom-in duration-500">
            <ApprovalGate
              diagnosis={approvalRequest.diagnosis_text}
              parts={approvalRequest.parts_detail}
              price={approvalRequest.quoted_price}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <Timeline items={timelineItems} />
          </div>

          {/* Photo Log */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <Camera size={18} className="text-blue-500" />
              Repair Photo Log
            </h3>

            {photos.length === 0 ? (
              <div className="bg-slate-950/50 p-12 rounded-xl border border-dashed border-slate-800 text-center">
                <p className="text-sm text-slate-500 font-medium">No photos uploaded yet. Your technician will add proof at each stage.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, i) => (
                  <div key={i} className="space-y-2 group">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                      <img src={photo.photo_url} alt={photo.stage} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{photo.stage.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
              <p className="text-[11px] text-blue-400 italic leading-relaxed">
                <strong>Radical Transparency:</strong> We provide photographic evidence of parts removed and installed to ensure your total peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

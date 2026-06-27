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

  // Utility to format date to Indian Standard (DD/MM/YYYY)
  const formatToIndianDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    async function fetchData() {
      if (!idString) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        // Fetch Booking using the new secure function (handles short and long IDs)
        const { data: bData, error: bError } = await supabase
          .rpc('get_booking_by_id', { search_id: idString });

        if (bError) throw bError;
        
        // rpc returns an array
        const result = bData && bData.length > 0 ? bData[0] : null;

        if (!result) {
          setBooking(null);
          setLoading(false);
          return;
        }

        const realId = result.id;
        setBooking(result);

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

  // Handlers for Approve/Decline remain same but use booking.id...
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center text-white">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Sync Error</h1>
      <p className="text-slate-400 mb-8">{error}</p>
      <button onClick={() => window.location.reload()} className="bg-blue-600 px-6 py-2 rounded-lg font-bold">Retry Sync</button>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center text-white">
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Booking Not Found</h1>
      <p className="text-slate-400 mb-8">We couldn't find a record for ID: <span className="text-blue-400 font-mono">{idString}</span></p>
      <Link href="/" className="bg-white text-black px-8 py-3 rounded-xl font-bold">Return Home</Link>
    </div>
  );

  const statuses = ['PENDING_PAYMENT', 'BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'DELIVERED'];
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
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2"><ArrowLeft size={20} /> <span className="text-xs uppercase font-bold tracking-widest">Home</span></Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Repair Status</h1>
            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                <Hash size={12} className="text-slate-500"/><span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-tighter">{booking.id.slice(0, 8)}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                <Phone size={12} className="text-slate-500"/><span className="text-[10px] font-bold">{booking?.customer_phone}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                <Calendar size={12} className="text-slate-500"/><span className="text-[10px] font-bold">{formatToIndianDate(booking?.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-blue-500/20 uppercase">{currentStatus.replace('_', ' ')}</div>
          </div>
          <div className="grid grid-cols-2 gap-8 py-6 border-t border-slate-800/50">
            <div><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Hardware</p><p className="text-lg font-bold text-slate-200">{booking.device_brand} {booking.device_model}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Ownership</p><p className="text-lg font-bold text-slate-200">{booking.customer_name}</p></div>
          </div>
        </div>

        {approvalRequest && <div className="animate-in fade-in zoom-in duration-500"><ApprovalGate diagnosis={approvalRequest.diagnosis_text} parts={approvalRequest.parts_detail} price={approvalRequest.quoted_price} onApprove={handleApprove} onDecline={handleDecline} /></div>}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl"><Timeline items={timelineItems} /></div>
          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-white"><Camera size={18} className="text-blue-500" /><span className="uppercase text-xs tracking-[0.2em] font-black">Visual Proof</span></h3>
            {photos.length === 0 ? <div className="bg-slate-950/50 p-12 rounded-2xl border border-dashed border-slate-800 text-center"><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Evidence pending</p></div> : 
              <div className="grid grid-cols-1 gap-4">
                {photos.map((photo, i) => (
                  <div key={i} className="space-y-2 group"><div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"><img src={photo.photo_url} alt={photo.stage} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" /><p className="absolute bottom-3 left-4 text-[9px] font-black uppercase text-white tracking-widest">{photo.stage.replace('_', ' ')}</p></div></div>
                ))}
              </div>
            }
            <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10"><p className="text-[10px] text-blue-400/80 italic leading-relaxed font-medium"><strong>Protocol:</strong> All evidence is documented to ensure 100% transparency.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

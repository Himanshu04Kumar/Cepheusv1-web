// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Camera, Loader2, AlertCircle, Phone, Calendar, Hash } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Timeline } from '@/components/Timeline';
import { ApprovalGate } from '@/components/ApprovalGate';
import { supabase } from '@/lib/supabase';

declare var Razorpay: any;

export const dynamic = 'force-dynamic';

export default function TrackingPage() {
  const params = useParams();
  const idString = params.id as string;
  const router = useRouter();

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

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!idString) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch Booking using the secure RPC function
        const { data: bData, error: bError } = await supabase
          .rpc('get_booking_by_id', { search_id: idString });

        if (bError) throw bError;
        const result = bData && bData.length > 0 ? bData[0] : null;

        if (!result) {
          setBooking(null);
          setLoading(false);
          return;
        }

        const realId = result.id;
        setBooking(result);

        // Fetch Photos
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
      // 1. Create a Razorpay Order for the Quoted Price via our new API
      const res = await fetch('/api/checkout/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: approvalRequest.quoted_price
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.error || 'Payment initialization failed');

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Cepheus Repair',
        description: 'Approval & Final Payment',
        order_id: order.order_id,
        handler: async function (response: any) {
          // 3. On success, update status in database
          await supabase
            .from('approval_requests')
            .update({ status: 'APPROVED', responded_at: new Date().toISOString() } as any)
            .eq('id', approvalRequest.id);

          await supabase
            .from('bookings')
            .update({ status: 'IN_REPAIR' } as any)
            .eq('id', booking.id);

          window.location.reload();
        },
        prefill: {
          name: booking.customer_name,
          contact: booking.customer_phone
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDecline = async () => {
    if (!approvalRequest || !booking) return;
    try {
      await supabase
        .from('approval_requests')
        .update({ status: 'DECLINED', responded_at: new Date().toISOString() } as any)
        .eq('id', approvalRequest.id);

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
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Booking Not Found</h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        We couldn't find a record matching your criteria.
      </p>
      <Link href="/" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
        Return to Homepage
      </Link>
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
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={20} /> <span className="text-xs uppercase font-bold tracking-widest">Home</span>
          </Link>

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-white">
            <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-blue-500/20 uppercase">
              {currentStatus.replace('_', ' ')}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 py-6 border-t border-slate-800/50">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Hardware Instance</p>
              <p className="text-lg font-bold text-slate-200">{booking.device_brand} {booking.device_model}</p>
            </div>
            <div className="text-right md:text-left">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Ownership</p>
              <p className="text-lg font-bold text-slate-200">{booking.customer_name}</p>
            </div>
          </div>
        </div>

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
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl"><Timeline items={timelineItems} /></div>
          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <Camera size={18} className="text-blue-500" />
              <span className="uppercase text-xs tracking-[0.2em] font-black">Visual Proof Log</span>
            </h3>
            {photos.length === 0 ? (
              <div className="bg-slate-950/50 p-12 rounded-2xl border border-dashed border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-white">Technician evidence pending</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {photos.map((photo, i) => (
                  <div key={i} className="space-y-2 group">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                      <img src={photo.photo_url} alt={photo.stage} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      <p className="absolute bottom-3 left-4 text-[9px] font-black uppercase text-white tracking-widest">{photo.stage.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10"><p className="text-[10px] text-blue-400/80 italic leading-relaxed font-medium"><strong>Protocol:</strong> All parts removed and installed are documented via photographic evidence to ensure 100% transparency.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

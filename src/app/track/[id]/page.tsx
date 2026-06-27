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

  const formatToIndianDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!idString) { setLoading(false); return; }
      try {
        setLoading(true);
        const { data: bData } = await supabase.rpc('get_booking_by_id', { search_id: idString });
        const result = bData?.[0];
        if (!result) { setBooking(null); setLoading(false); return; }
        setBooking(result);

        const { data: pData } = await supabase.from('repair_photos').select('*').eq('booking_id', result.id).order('created_at', { ascending: true });
        setPhotos(pData || []);

        const { data: aData } = await supabase.from('approval_requests').select('*').eq('booking_id', result.id).eq('status', 'PENDING').maybeSingle();
        setApprovalRequest(aData);
      } catch (err: any) {
        setError(err.message);
      } finally { setLoading(false); }
    }
    fetchData();
  }, [idString]);

  const handleApprove = async () => {
    if (!approvalRequest || !booking) return;
    try {
      // 1. Create order
      const res = await fetch('/api/checkout/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_ORDER',
          bookingId: booking.id,
          amount: approvalRequest.quoted_price
        }),
      });
      const order = await res.json();

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        name: 'Cepheus Repair',
        description: 'Approval & Final Payment',
        order_id: order.order_id,
        handler: async function () {
          // 3. SECURE BACKEND UPDATE (Move status forward)
          await fetch('/api/checkout/final', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'CONFIRM_PAYMENT',
              bookingId: booking.id,
              approvalId: approvalRequest.id
            }),
          });
          window.location.reload();
        }
      };
      new Razorpay(options).open();
    } catch (err) {
      alert('Payment initialization failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!booking) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center text-white"><h1 className="text-2xl font-black uppercase mb-2">Not Found</h1><Link href="/" className="bg-white text-black px-8 py-3 rounded-xl font-bold">Home</Link></div>;

  const statuses = ['PENDING_PAYMENT', 'BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'DELIVERED'];
  const currentIdx = statuses.indexOf(booking.status);
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
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"><ArrowLeft size={20} /> <span className="text-xs uppercase font-bold tracking-widest">Home</span></Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Repair Status</h1>
            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Hash size={12} className="text-slate-500"/><span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-tighter">{booking.id.slice(0, 8)}</span></div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Phone size={12} className="text-slate-500"/><span className="text-[10px] font-bold">{booking?.customer_phone}</span></div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Calendar size={12} className="text-slate-500"/><span className="text-[10px] font-bold">{formatToIndianDate(booking?.created_at)}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800">
          <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-blue-500/20 uppercase inline-block mb-8">{booking.status.replace('_', ' ')}</div>
          <div className="grid grid-cols-2 gap-8 py-6 border-t border-slate-800/50">
            <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Hardware</p><p className="text-lg font-bold text-slate-200">{booking.device_brand} {booking.device_model}</p></div>
            <div className="text-right md:text-left"><p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Ownership</p><p className="text-lg font-bold text-slate-200">{booking.customer_name}</p></div>
          </div>
        </div>

        {approvalRequest && (
          <div className="animate-in fade-in zoom-in duration-500">
            <ApprovalGate diagnosis={approvalRequest.diagnosis_text} parts={approvalRequest.parts_detail} price={approvalRequest.quoted_price} onApprove={handleApprove} onDecline={() => alert('Declined')} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl"><Timeline items={timelineItems} /></div>
          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-white"><Camera size={18} className="text-blue-500" /><span className="uppercase text-xs tracking-[0.2em] font-black text-white">Visual Proof</span></h3>
            {photos.length === 0 ? <div className="bg-slate-950/50 p-12 rounded-2xl border border-dashed border-slate-800 text-center"><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Evidence pending</p></div> :
              <div className="grid grid-cols-1 gap-4">
                {photos.map((photo, i) => (
                  <div key={i} className="space-y-2 group"><div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white"><img src={photo.photo_url} alt={photo.stage} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" /><p className="absolute bottom-3 left-4 text-[9px] font-black uppercase text-white tracking-widest">{photo.stage.replace('_', ' ')}</p></div></div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

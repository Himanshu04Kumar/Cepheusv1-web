// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Package, Camera, AlertCircle, Phone, Calendar, Hash, Wrench, ShieldCheck, Loader2, Truck, MessageSquare, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

declare var Razorpay: any;
export const dynamic = 'force-dynamic';

export default function AdvancedTrackingPage() {
  const params = useParams();
  const idString = params.id as string;
  const [booking, setBooking] = useState(null);
  const [options, setOptions] = useState([]);
  const [parts, setParts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!idString) return;
      try {
        setLoading(true);
        const { data: bData } = await supabase.rpc('get_booking_by_id', { search_id: idString });
        const res = bData && bData.length > 0 ? bData[0] : null;
        if (!res) { setBooking(null); setLoading(false); return; }
        setBooking(res);
        const realId = res.id;
        const [opt, prt, war, com] = await Promise.all([
          supabase.from('repair_options').select('*').eq('booking_id', realId).order('created_at', { ascending: true }),
          supabase.from('part_documentation').select('*').eq('booking_id', realId).order('created_at', { ascending: true }),
          supabase.from('warranty_details').select('*').eq('booking_id', realId).maybeSingle(),
          supabase.from('repair_comments').select('*').eq('booking_id', realId).order('created_at', { ascending: true })
        ]);
        setOptions(opt.data || []);
        setParts(prt.data || []);
        setComments(com.data || []);
      } finally { setLoading(false); }
    }
    loadData();
  }, [idString]);

  const handleApprove = async (option) => {
    try {
      const res = await fetch('/api/checkout/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_ORDER', bookingId: booking.id, amount: option.price }),
      });
      const order = await res.json();
      new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        name: 'Cepheus Repair',
        description: `Approval: ${option.option_name}`,
        order_id: order.order_id,
        handler: async function () {
          await fetch('/api/checkout/final', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'CONFIRM_PAYMENT', bookingId: booking.id, approvalId: option.id }),
          });
          window.location.reload();
        }
      }).open();
    } catch (e) { alert('Payment Error'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!booking) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-8"><h1>Booking Not Found</h1><Link href="/">Home</Link></div>;

  const getNotes = (stage) => comments.filter(c => c.stage === stage);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2"><ArrowLeft size={16}/> Home</Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-900 pb-8 text-white">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-blue-500">Repair Status</h1>
          <div className="flex flex-wrap gap-3">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Hash size={12} className="text-slate-500"/><span className="text-[10px] font-mono font-bold text-blue-400 uppercase">{booking.id.slice(0, 8)}</span></div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Phone size={12} className="text-slate-500"/><span className="text-[10px] font-bold text-white">{booking?.customer_phone}</span></div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Calendar size={12} className="text-slate-500"/><span className="text-[10px] font-bold text-white">{formatDate(booking?.created_at)}</span></div>
          </div>
        </div>

        <div className="space-y-12 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-900 text-white">

          {/* RENDER DYNAMIC TIMELINE CARDS */}
          {['BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((stage) => {
            const stageActive = booking.status === stage;
            const stagePassed = ['BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'].indexOf(booking.status) >= ['BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'].indexOf(stage);

            if (!stagePassed) return null;

            return (
              <div key={stage} className="relative pl-12">
                 <div className={`absolute left-0 top-0 p-2 rounded-full border border-slate-900 ${stageActive ? 'bg-blue-600 text-white' : 'bg-slate-950 text-blue-500'}`}>
                    {stage === 'BOOKED' && <CheckCircle size={20}/>}
                    {stage === 'PICKED_UP' && <Package size={20}/>}
                    {stage === 'DIAGNOSING' && <Wrench size={20}/>}
                    {stage === 'AWAITING_APPROVAL' && <AlertCircle size={20}/>}
                    {stage === 'IN_REPAIR' && <Camera size={20}/>}
                    {stage === 'QUALITY_CHECK' && <ShieldCheck size={20}/>}
                    {stage === 'OUT_FOR_DELIVERY' && <Truck size={20}/>}
                    {stage === 'DELIVERED' && <CheckCircle2 size={20}/>}
                 </div>
                 <div className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4">{stage.replace(/_/g, ' ')}</h3>

                    {getNotes(stage).map(n => (
                      <div key={n.id} className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl mb-3 flex gap-3">
                         <MessageSquare size={14} className="text-blue-400 mt-1"/>
                         <p className="text-xs text-blue-100 italic">"{n.comment_text}"</p>
                      </div>
                    ))}

                    {/* SPECIAL RENDER FOR EVENT 4: OPTIONS */}
                    {stage === 'AWAITING_APPROVAL' && options.length > 0 && booking.status === 'AWAITING_APPROVAL' && (
                       <div className="space-y-4 pt-4 border-t border-white/5">
                          <div className="space-y-3">
                             {options.filter(o => !o.option_name.includes('CALL US')).map((opt) => (
                                <div key={opt.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center group transition-all">
                                   <div><p className="text-sm font-black uppercase text-white">{opt.option_name}</p><p className="text-[10px] text-slate-500">{opt.description}</p></div>
                                   <div className="text-right"><p className="text-lg font-black text-white">₹{opt.price}</p><button onClick={() => handleApprove(opt)} className="mt-2 bg-blue-600 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl text-white">Approve & Pay</button></div>
                                </div>
                             ))}
                          </div>
                          <button onClick={() => alert('Request Sent!')} className="w-full bg-slate-900 border border-blue-500/30 text-blue-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                             Not Sure? Request Technical Callback
                          </button>
                       </div>
                    )}

                    {/* SPECIAL RENDER FOR EVENT 5: EVIDENCE */}
                    {stage === 'IN_REPAIR' && parts.length > 0 && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {parts.map((p, i) => (
                             <div key={i} className="aspect-video relative overflow-hidden rounded-2xl border border-slate-800 group">
                                <img src={p.removed_part_photo} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent text-white p-4 flex flex-col justify-end">
                                   <p className="text-[9px] font-black uppercase text-blue-400">{p.removed_part_name}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

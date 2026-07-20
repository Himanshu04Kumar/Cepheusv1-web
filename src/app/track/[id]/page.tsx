// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Package, Camera, AlertCircle, Phone, Calendar, Hash, Wrench, ShieldCheck, Loader2, Truck, MessageSquare, ChevronDown, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ThemeToggle';

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
  const [expandedStage, setExpandedStage] = useState('BOOKED');

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
        setExpandedStage(res.status);
        const realId = res.id;
        const [opt, prt, com] = await Promise.all([
          supabase.from('repair_options').select('*').eq('booking_id', realId).order('created_at', { ascending: true }),
          supabase.from('part_documentation').select('*').eq('booking_id', realId).order('created_at', { ascending: true }),
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

  const handleRequestCallback = async () => {
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CALLBACK_REQUEST',
          bookingId: booking.id
        }),
      });
      if (res.ok) {
        alert('CALLBACK LOGGED: Our technical lead will call you on your registered number shortly.');
        window.location.reload();
      }
    } catch (e) {
      alert('Sync Failed. Please try again.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa] dark:bg-slate-950 text-indigo-600"><Loader2 className="animate-spin" size={48} /></div>;
  if (!booking) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white p-8"><h1>Booking Not Found</h1><Link href="/">Home</Link></div>;

  const stages = [
    { id: 'BOOKED', title: 'Booking Confirmed', icon: CheckCircle2, desc: 'Slot allocated securely.' },
    { id: 'PICKED_UP', title: 'Device Collected', icon: Package, desc: 'Machine picked up by logistical agents.' },
    { id: 'DIAGNOSING', title: 'Diagnosis In Progress', icon: Wrench, desc: 'Technician bench validation tests live.' },
    { id: 'AWAITING_APPROVAL', title: 'Awaiting Your Approval', icon: AlertCircle, desc: 'Quotation matrix issued.' },
    { id: 'IN_REPAIR', title: 'Repair In Progress', icon: Camera, desc: 'Teardown and installation sequence.' },
    { id: 'QUALITY_CHECK', title: 'Quality Check Evaluation', icon: ShieldCheck, desc: 'Automated hardware stress cycles.' },
    { id: 'OUT_FOR_DELIVERY', title: 'Out For Delivery', icon: Truck, desc: 'Logistics router dispatching system.' },
    { id: 'DELIVERED', title: 'System Delivered', icon: CheckCircle2, desc: 'Hardware returned successfully.' },
  ];

  const currentStageIdx = stages.findIndex(s => s.id === booking.status);

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500">
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6b6c76] dark:text-slate-500 hover:text-[#09090b] dark:hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 dark:border-white/5 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-indigo-600 dark:text-indigo-400 italic">Registry Status</h1>
          <div className="flex flex-wrap gap-3">
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm"><Hash size={12} className="text-slate-400"/><span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">{booking.id.slice(0, 8)}</span></div>
              <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm"><Phone size={12} className="text-slate-400"/><span className="text-[10px] font-bold">{booking?.customer_phone}</span></div>
          </div>
        </div>

        <div className="space-y-4 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-black/5 dark:before:bg-white/5">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStageIdx || booking.status === 'DELIVERED';
            const isActive = stage.id === booking.status;
            const isFuture = index > currentStageIdx && booking.status !== 'DELIVERED';
            const isExpanded = expandedStage === stage.id;

            return (
              <div key={stage.id} className={`relative pl-12 transition-all duration-500 ${isFuture ? 'opacity-30' : 'opacity-100'}`}>
                <div className={`absolute left-0 top-1 p-2 rounded-full border transition-all duration-500 z-10 ${
                  isCompleted ? 'bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                  isActive ? 'bg-amber-500 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse' :
                  'bg-[#fbfbfa] dark:bg-slate-950 border-black/5 dark:border-white/10 text-slate-300 dark:text-slate-700'
                }`}>
                  <stage.icon size={18} />
                </div>

                <div className={`bg-white dark:bg-slate-900/40 border transition-all duration-500 rounded-3xl overflow-hidden ${
                  isExpanded ? (isActive ? 'border-amber-500/50 shadow-xl' : 'border-green-500/30 shadow-xl') : 'border-black/5 dark:border-white/5'
                }`}>
                  <button
                    onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                    disabled={isFuture}
                    className="w-full p-5 text-left flex justify-between items-center group"
                  >
                    <div>
                      <h3 className={`text-xs font-black uppercase tracking-widest transition-colors ${
                        isCompleted ? 'text-green-600' : isActive ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'
                      }`}>
                        {stage.title}
                      </h3>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-1 uppercase tracking-tighter">{stage.desc}</p>
                    </div>
                    {!isFuture && (
                      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18} className="text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-4 duration-500">

                      {comments.filter(c => c.stage === stage.id).map(n => (
                        <div key={n.id} className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-2xl flex gap-3 shadow-sm">
                           <MessageSquare size={14} className="text-indigo-600 dark:text-indigo-400 mt-1 shrink-0"/>
                           <p className="text-xs text-indigo-900 dark:text-indigo-100 italic leading-relaxed font-medium">"{n.comment_text}"</p>
                        </div>
                      ))}

                      {stage.id === 'BOOKED' && (
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5 dark:border-white/5">
                           <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Hardware</p><p className="text-xs font-bold">{booking.device_brand} {booking.device_model}</p></div>
                           <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p><p className="text-xs font-bold text-green-600">₹99 Verified</p></div>
                        </div>
                      )}

                      {stage.id === 'AWAITING_APPROVAL' && options.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                           <div className="space-y-3">
                              {options.filter(o => !o.option_name.includes('CALL US')).map((opt) => (
                                 <div key={opt.id} className="bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/10 p-5 rounded-2xl flex justify-between items-center group hover:border-amber-500/50 transition-all shadow-sm">
                                    <div><p className="text-sm font-black uppercase text-[#09090b] dark:text-white">{opt.option_name}</p><p className="text-[10px] text-slate-500">{opt.description}</p></div>
                                    <div className="text-right">
                                       <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{opt.price}</p>
                                       {booking.status === 'AWAITING_APPROVAL' && (
                                         <button onClick={(e) => { e.stopPropagation(); handleApprove(opt); }} className="mt-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all">Approve & Pay</button>
                                       )}
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <button onClick={(e) => { e.stopPropagation(); handleRequestCallback(); }} className="w-full bg-white dark:bg-slate-900 border border-indigo-600/30 text-indigo-600 dark:text-indigo-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                              Request Technical Callback
                           </button>
                        </div>
                      )}

                      {parts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                           {parts.filter(p => (stage.id === 'IN_REPAIR') || (stage.id === 'PICKED_UP' && index === 1)).map((p, i) => (
                             <div key={i} className="aspect-video relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 shadow-md group">
                                <img src={p.removed_part_photo} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent text-white p-4 flex flex-col justify-end">
                                   <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em]">{p.removed_part_name || 'Visual Proof'}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                      )}

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

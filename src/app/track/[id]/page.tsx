// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Package, Camera, AlertCircle, Phone, Calendar, Hash, Wrench, ShieldCheck, Loader2, Truck, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!booking) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-8"><h1>Booking Not Found</h1><Link href="/">Home</Link></div>;

  const stages = [
    { id: 'BOOKED', title: 'Booking Confirmed', icon: CheckCircle, desc: 'Slot allocated securely under transaction hash.' },
    { id: 'PICKED_UP', title: 'Device Collected', icon: Package, desc: 'Machine picked up by logistical intake agents.' },
    { id: 'DIAGNOSING', title: 'Diagnosis In Progress', icon: Wrench, desc: 'Technician bench hardware validation tests live.' },
    { id: 'AWAITING_APPROVAL', title: 'Awaiting Your Approval', icon: AlertCircle, desc: 'Quotation matrix issued. Awaiting client token.' },
    { id: 'IN_REPAIR', title: 'Repair In Progress', icon: Camera, desc: 'Component teardown and module installation.' },
    { id: 'QUALITY_CHECK', title: 'Quality Check Evaluation', icon: ShieldCheck, desc: 'Automated hardware stress cycles live.' },
    { id: 'OUT_FOR_DELIVERY', title: 'Out For Delivery', icon: Truck, desc: 'Logistics router dispatching system back.' },
    { id: 'DELIVERED', title: 'System Delivered', icon: CheckCircle2, desc: 'Hardware returned. Warranty duration active.' },
  ];

  const currentStageIdx = stages.findIndex(s => s.id === booking.status);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors selection:bg-blue-500/30">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2"><ArrowLeft size={16}/> Home</Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-900 pb-8 text-white">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-blue-500">Repair Status</h1>
          <div className="flex flex-wrap gap-3">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Hash size={12} className="text-slate-500"/><span className="text-[10px] font-mono font-bold text-blue-400 uppercase">{booking.id.slice(0, 8)}</span></div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Phone size={12} className="text-slate-500"/><span className="text-[10px] font-bold text-white">{booking?.customer_phone}</span></div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl"><Calendar size={12} className="text-slate-500"/><span className="text-[10px] font-bold text-white">{formatDate(booking?.created_at)}</span></div>
          </div>
        </div>

        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-900">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStageIdx || booking.status === 'DELIVERED';
            const isActive = stage.id === booking.status;
            const isFuture = index > currentStageIdx && booking.status !== 'DELIVERED';
            const isExpanded = expandedStage === stage.id;

            return (
              <div key={stage.id} className={`relative pl-12 transition-all duration-500 ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
                {/* Timeline Icon */}
                <div className={`absolute left-0 top-1 p-2 rounded-full border transition-all duration-500 z-10 ${
                  isCompleted ? 'bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' :
                  isActive ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-pulse' :
                  'bg-slate-950 border-slate-800 text-slate-700'
                }`}>
                  <stage.icon size={18} />
                </div>

                {/* Stage Card */}
                <div className={`bg-slate-900/40 border transition-all duration-500 rounded-3xl overflow-hidden ${
                  isExpanded ? 'border-blue-500/30 bg-slate-900/60 shadow-2xl' : 'border-slate-800'
                }`}>
                  <button
                    onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                    disabled={isFuture}
                    className="w-full p-6 text-left flex justify-between items-center group"
                  >
                    <div>
                      <h3 className={`text-sm font-black uppercase tracking-widest transition-colors ${
                        isCompleted ? 'text-green-500' : isActive ? 'text-blue-500' : 'text-slate-500'
                      }`}>
                        {stage.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tighter">{stage.desc}</p>
                    </div>
                    {!isFuture && (
                      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-slate-600 group-hover:text-blue-500" />
                      </div>
                    )}
                  </button>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-4 duration-500">

                      {/* Comments for this stage */}
                      {comments.filter(c => c.stage === stage.id).map(n => (
                        <div key={n.id} className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 shadow-inner">
                           <MessageSquare size={14} className="text-blue-400 mt-1 shrink-0"/>
                           <p className="text-xs text-blue-100 italic leading-relaxed font-medium">"{n.comment_text}"</p>
                        </div>
                      ))}

                      {/* Stage-Specific Specialized Renders */}

                      {stage.id === 'BOOKED' && (
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                           <div><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Hardware Instance</p><p className="text-xs font-bold">{booking.device_brand} {booking.device_model}</p></div>
                           <div><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Entry Protocol</p><p className="text-xs font-bold text-green-500">₹99 Verified</p></div>
                           <div className="col-span-2"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">User Reported Conflict</p><p className="text-xs text-slate-300 leading-relaxed italic">"{booking.issue_description}"</p></div>
                        </div>
                      )}

                      {stage.id === 'AWAITING_APPROVAL' && options.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-white/5">
                           <div className="space-y-3">
                              {options.filter(o => !o.option_name.includes('CALL US')).map((opt) => (
                                 <div key={opt.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex justify-between items-center group hover:border-blue-500/50 transition-all shadow-xl">
                                    <div><p className="text-sm font-black uppercase text-white">{opt.option_name}</p><p className="text-[10px] text-slate-500">{opt.description}</p></div>
                                    <div className="text-right">
                                       <p className="text-lg font-black text-white">₹{opt.price}</p>
                                       {booking.status === 'AWAITING_APPROVAL' && (
                                         <button onClick={(e) => { e.stopPropagation(); handleApprove(opt); }} className="mt-2 bg-blue-600 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all">Approve & Pay</button>
                                       )}
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <button onClick={(e) => { e.stopPropagation(); alert('Request Received! Our tech lead will call you.'); }} className="w-full bg-slate-900 border border-blue-500/30 text-blue-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                              Request Technical Callback
                           </button>
                        </div>
                      )}

                      {/* Visual Evidence Log (Specific to the stage the admin tagged it in) */}
                      {parts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                           {parts.filter(p => {
                             // Logic to show proof in the correct accordion
                             // If admin tagged part during IN_REPAIR, show it here
                             // For simplicity in MVP, we show all photos in IN_REPAIR or PICKED_UP based on stage
                             return (stage.id === 'IN_REPAIR') || (stage.id === 'PICKED_UP' && index === 1);
                           }).map((p, i) => (
                             <div key={i} className="aspect-video relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl group">
                                <img src={p.removed_part_photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent text-white p-4 flex flex-col justify-end">
                                   <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.2em]">{p.removed_part_name || 'Visual Proof'}</p>
                                   {p.installed_serial && <p className="text-[7px] font-mono text-slate-500 uppercase tracking-tighter mt-0.5">S/N: {p.installed_serial}</p>}
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

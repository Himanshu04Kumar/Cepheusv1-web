// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Package, Camera, AlertCircle, Phone, Calendar, Hash, Wrench, ShieldCheck, Loader2, Truck, CheckCircle } from 'lucide-react';
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
  const [warranty, setWarranty] = useState(null);
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

        if (!res) {
          setBooking(null);
          setLoading(false);
          return;
        }
        setBooking(res);

        const realId = res.id;
        const [opt, prt, war] = await Promise.all([
          supabase.from('repair_options').select('*').eq('booking_id', realId).order('created_at', { ascending: true }),
          supabase.from('part_documentation').select('*').eq('booking_id', realId).order('created_at', { ascending: true }),
          supabase.from('warranty_details').select('*').eq('booking_id', realId).maybeSingle()
        ]);

        setOptions(opt.data || []);
        setParts(prt.data || []);
        setWarranty(war.data);
      } catch (err) {
        console.error('Timeline Sync Error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [idString]);

  const handleApprove = async (option) => {
    if (option.option_name.includes('CALL US')) {
      return alert('Request Received! Our technical lead will call your registered number shortly.');
    }
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
        },
        theme: { color: '#2563eb' }
      }).open();
    } catch (e) { alert('Payment Initialization Failed.'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">Syncing Event Logs...</p>
      </div>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-8">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-black uppercase">Booking Not Found</h1>
      <Link href="/" className="mt-8 bg-white text-black px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Return Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"><ArrowLeft size={16}/> Home</Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-900 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-blue-500">Repair Status</h1>
          <div className="flex flex-wrap gap-3">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                <Hash size={12} className="text-slate-500"/><span className="text-[10px] font-mono font-bold text-blue-400 uppercase">{booking.id.slice(0, 8)}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                <Phone size={12} className="text-slate-500"/><span className="text-[10px] font-bold text-slate-200">{booking?.customer_phone}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                <Calendar size={12} className="text-slate-500"/><span className="text-[10px] font-bold text-slate-200">{formatDate(booking?.created_at)}</span>
              </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />
           <div className="flex justify-between items-start mb-8">
              <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${booking.status === 'DELIVERED' ? 'bg-green-600' : 'bg-blue-600'}`}>{booking.status.replace(/_/g, ' ')}</div>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Hardware</p><p className="text-xl font-bold text-slate-200 uppercase">{booking.device_brand} {booking.device_model}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Ownership</p><p className="text-xl font-bold text-slate-200 uppercase">{booking.customer_name}</p></div>
           </div>
        </div>

        <div className="space-y-12 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-900 text-white">

          <EventCard icon={<CheckCircle2 className="text-green-500" />} title="Booking Confirmed" date={formatDate(booking.created_at)}>
            <p className="text-xs text-slate-400">Order successfully logged into Cepheus Registry. Booking fee of ₹99 verified.</p>
          </EventCard>

          {['PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(booking.status) && (
            <EventCard icon={<Package className="text-blue-500" />} title="Device Picked Up" date="Verified">
               <p className="text-xs text-slate-400">Hardware has been retrieved and is en route to our specialized partner facility.</p>
            </EventCard>
          )}

          {['DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(booking.status) && (
            <EventCard icon={<Wrench className="text-blue-500" />} title="Diagnosis Complete" date="Verified">
               <p className="text-xs text-slate-400">Technician has completed the internal assessment. Repair options are available.</p>
            </EventCard>
          )}

          {options.length > 0 && booking.status === 'AWAITING_APPROVAL' && (
            <EventCard icon={<AlertCircle className="text-amber-500 animate-pulse" />} title="Action Required: Approval Gate" date="Awaiting">
               <div className="bg-slate-950 border border-amber-500/20 p-6 rounded-3xl space-y-6 shadow-2xl">
                 <div className="space-y-3">
                   {options.map((opt, i) => (
                     <div key={opt.id} className={`bg-slate-900 border p-5 rounded-2xl flex justify-between items-center group transition-all ${i === 0 ? 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-slate-800 hover:border-blue-500/50'}`}>
                       <div>
                         <p className={`text-sm font-black uppercase tracking-tighter ${i === 0 ? 'text-blue-400' : 'text-white'}`}>{opt.option_name}</p>
                         <p className="text-[10px] text-slate-500">{opt.description}</p>
                       </div>
                       <div className="text-right">
                         {opt.price > 0 && <p className="text-lg font-black text-white">₹{opt.price}</p>}
                         <button onClick={() => handleApprove(opt)} className={`mt-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${i === 0 ? 'bg-blue-600/10 border border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>{i === 0 ? 'Request Call' : 'Approve & Pay'}</button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </EventCard>
          )}

          {/* OUT FOR DELIVERY: Shows only during the actual delivery journey */}
          {booking.status === 'OUT_FOR_DELIVERY' && (
            <EventCard icon={<Truck className="text-orange-500 animate-bounce" />} title="Out For Delivery" date="Live Logistics">
               <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-3xl space-y-3 shadow-xl">
                 <p className="text-xs text-orange-400 font-bold uppercase tracking-widest flex items-center gap-2">
                   Estimated Window: <span>{booking.pickup_slot}</span>
                 </p>
                 <p className="text-[11px] text-slate-400">Our delivery partner is navigating to your address. Please ensure someone is available to receive the hardware.</p>
               </div>
            </EventCard>
          )}

          {/* DELIVERED: The final event when the truck reaches the bottom */}
          {booking.status === 'DELIVERED' && (
            <EventCard icon={<CheckCircle className="text-green-500" />} title="Hardware Delivered" date="Success">
               <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-3xl space-y-3 shadow-xl">
                 <p className="text-xs text-green-400 font-bold uppercase tracking-widest">Handover Confirmed</p>
                 <p className="text-[11px] text-slate-400">Repair mission complete. Your hardware has been successfully returned and verified at your doorstep.</p>
               </div>
            </EventCard>
          )}

          {parts.length > 0 && (
            <EventCard icon={<Camera className="text-purple-500" />} title="Visual Proof Log" date="Verified Evidence">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parts.map((p, i) => (
                   <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={p.removed_part_photo} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-3 left-4 space-y-1">
                          <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest">{p.removed_part_name || 'Repair Proof'}</p>
                          {p.installed_serial && <p className="text-[7px] font-mono text-slate-400 uppercase tracking-tighter">S/N: {p.installed_serial}</p>}
                        </div>
                      </div>
                   </div>
                ))}
              </div>
            </EventCard>
          )}

          {warranty && (
            <EventCard icon={<ShieldCheck className="text-green-500" />} title="Verifiable Warranty Certificate" date={formatDate(warranty.expiry_date)}>
              <div className="bg-green-500/5 border border-green-500/20 p-8 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-start">
                   <div>
                     <p className="text-[10px] font-black text-green-500/50 uppercase tracking-widest">Certificate Number</p>
                     <p className="text-2xl font-black uppercase text-white tracking-tighter">{warranty.warranty_id}</p>
                   </div>
                   <div className="bg-green-600 text-white text-[8px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-green-500/20">Active</div>
                </div>
                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-green-500/10">
                   <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Coverage</p><p className="text-sm font-bold">{warranty.period_days} Days</p></div>
                   <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Expires On</p><p className="text-sm font-bold text-slate-200">{formatDate(warranty.expiry_date)}</p></div>
                </div>
              </div>
            </EventCard>
          )}

        </div>
      </div>
    </div>
  );
}

function EventCard({ icon, title, date, children }) {
  return (
    <div className="relative pl-12 animate-in fade-in slide-in-from-left-4 duration-1000">
      <div className="absolute left-0 top-0 z-10 bg-slate-950 p-2 rounded-full border border-slate-900 shadow-[0_0_30px_rgba(59,130,246,0.2)] text-blue-500">
        {icon}
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{title}</h3>
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter font-mono">{date}</span>
        </div>
        <div className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800/50 shadow-xl backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

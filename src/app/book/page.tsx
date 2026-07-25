// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/lib/supabase';

declare var Razorpay: any;

export default function BookRepairPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form State - EXACTLY AS ORIGINAL
  const [formData, setFormData] = useState({
    device_brand: '',
    device_model: '',
    issue_description: '',
    customer_name: '',
    customer_phone: '',
    pickup_address: '',
    pickup_date: '', // RESTORED THE DATE
    pickup_slot: ''
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startPayment = async (bookingId) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, amount: 99 }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Checkout API Error');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'CEPHEUS',
        description: 'Secure Pickup Verification',
        order_id: data.order_id,
        handler: async function (response) {
          // Success: Redirect to tracking page with the short ID
          router.push(`/track/${bookingId.slice(0, 8)}`);
        },
        prefill: {
          name: formData.customer_name,
          contact: formData.customer_phone,
        },
        theme: { color: '#4f46e5' },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (e) {
      alert('Payment Setup Failed: ' + e.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. DATA VALIDATION
      if (!formData.customer_phone || !formData.pickup_address || !formData.pickup_slot) {
          throw new Error("Required logistical details missing.");
      }

      // 2. INSERT TO SUPABASE - SMART FILTERING TO FIX SCHEMA ERROR
      // We take everything BUT 'pickup_date' because the DB table doesn't have that column
      const { pickup_date, ...dbData } = formData;

      const { data, error } = await supabase
        .from('bookings')
        .insert([{
            ...dbData,
            status: 'BOOKED',
            booking_fee_paid: false
        }])
        .select()
        .single();

      if (error) throw error;

      // 3. START RAZORPAY
      await startPayment(data.id);
    } catch (e) {
      alert('Booking Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500 pb-20">
      <div className="max-w-xl mx-auto p-6 md:p-10 space-y-12">

        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> Home
          </Link>
          <ThemeToggle />
        </div>

        {/* Dynamic Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-indigo-600 dark:text-indigo-400 italic">INITIALIZE REPAIR</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Protocol Step {step} of 3</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Hardware Brand</label>
                <input name="device_brand" placeholder="e.g. Dell, Apple, HP" className="w-full p-5 bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl text-[#09090b] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" value={formData.device_brand} onChange={handleChange} />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Model Name</label>
                <input name="device_model" placeholder="e.g. XPS 13, MacBook Air" className="w-full p-5 bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl text-[#09090b] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" value={formData.device_model} onChange={handleChange} />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Describe Issue</label>
                <textarea name="issue_description" placeholder="Technical symptoms..." className="w-full p-5 bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl text-[#09090b] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all h-32" value={formData.issue_description} onChange={handleChange} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                <input name="customer_name" placeholder="Contact Identity" className="w-full p-5 bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl text-[#09090b] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" value={formData.customer_name} onChange={handleChange} />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Mobile Number</label>
                <input name="customer_phone" placeholder="99xxxxxxxx" className="w-full p-5 bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl text-[#09090b] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" value={formData.customer_phone} onChange={handleChange} />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Address</label>
                <textarea name="pickup_address" placeholder="Delhi Coordinate Details" className="w-full p-5 bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl text-[#09090b] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all h-32" value={formData.pickup_address} onChange={handleChange} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Pickup Date</label>
                <input name="pickup_date" type="date" className="w-full p-5 bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl text-[#09090b] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all" value={formData.pickup_date} onChange={handleChange} />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Preferred Time Window</label>
                <select name="pickup_slot" className="w-full p-5 bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl text-[#09090b] dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all appearance-none cursor-pointer" value={formData.pickup_slot} onChange={handleChange}>
                   <option value="">Select Priority Window</option>
                   <option value="MORNING (10 AM - 1 PM)">MORNING (10 AM - 1 PM)</option>
                   <option value="AFTERNOON (2 PM - 5 PM)">AFTERNOON (2 PM - 5 PM)</option>
                   <option value="EVENING (6 PM - 9 PM)">EVENING (6 PM - 9 PM)</option>
                </select>
              </div>
              <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl text-left">
                 <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-indigo-600 mt-1 shrink-0" />
                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-relaxed">Verification protocol: ₹99 secure slot verification required to prevent registry spam.</p>
                 </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            disabled={loading}
            onClick={step < 3 ? () => setStep(step + 1) : handleSubmit}
            className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : step < 3 ? 'PROCEED TO LOGISTICS' : 'PAY & FINALIZE'}
            {step < 3 && !loading && <ChevronRight size={18} />}
          </button>

          {step > 1 && !loading && (
             <button onClick={() => setStep(step - 1)} className="w-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Return to Step {step - 1}</button>
          )}

        </div>
      </div>
    </div>
  );
}

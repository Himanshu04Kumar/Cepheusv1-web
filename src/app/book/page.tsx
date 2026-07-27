// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

declare var Razorpay: any;

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    issue: '',
    name: '',
    phone: '',
    address: '',
    slot: 'Tomorrow, 10 AM - 12 PM'
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          device_brand: formData.brand,
          device_model: formData.model,
          issue_description: formData.issue,
          pickup_address: formData.address,
          pickup_slot: formData.slot
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        name: 'Cepheus Repair',
        description: 'Booking Fee',
        order_id: data.order_id,
        handler: function () {
          router.push(`/track/${data.booking_id}`);
        },
        modal: { ondismiss: () => setLoading(false) },
        prefill: { name: formData.name, contact: formData.phone },
        theme: { color: '#4f46e5' }
      }).open();

    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500">
      <div className="max-w-xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6b6c76] dark:text-slate-500 hover:text-[#09090b] dark:hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-indigo-600 dark:text-indigo-400">Initialize Repair</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76] dark:text-slate-500">Booking Protocol Step {step} of 3</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-black/[0.02] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-black/5 dark:bg-white/5">
             <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${(step/3)*100}%` }} />
          </div>

          <form onSubmit={handleBooking} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FormGroup label="Hardware Brand" placeholder="e.g. Dell, HP, Apple" value={formData.brand} onChange={v => setFormData({...formData, brand: v})} />
                <FormGroup label="Model Name" placeholder="e.g. XPS 13, MacBook Air" value={formData.model} onChange={v => setFormData({...formData, model: v})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76] ml-1">Describe Issue</label>
                  <textarea required className="w-full bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-xl p-4 text-xs font-medium outline-none focus:border-indigo-500 transition-colors min-h-[100px] text-white" placeholder="What's wrong with your device?" value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FormGroup label="Customer Full Name" placeholder="Enter your name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                <FormGroup label="Primary Mobile" placeholder="10-digit number" type="tel" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2 text-white">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76] ml-1 text-white">Full Pickup Address</label>
                  <textarea required className="w-full bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-xl p-4 text-xs font-medium outline-none focus:border-indigo-500 transition-colors min-h-[100px] text-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76] ml-1 text-white">Select Slot</label>
                  <select className="w-full bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-xl p-4 text-xs font-medium outline-none focus:border-indigo-500 transition-colors text-white" value={formData.slot} onChange={e => setFormData({...formData, slot: e.target.value})}>
                    <option>Tomorrow, 10 AM - 12 PM</option>
                    <option>Tomorrow, 2 PM - 4 PM</option>
                    <option>Day after, 10 AM - 12 PM</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-black/5 dark:border-white/5 text-white">
              {step > 1 && (
                <button disabled={loading} type="button" onClick={prevStep} className="flex-1 py-4 border border-black/10 dark:border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-white">
                  Back
                </button>
              )}
              <button disabled={loading} type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : (step === 3 ? 'Pay ₹99 Booking Fee' : 'Proceed')}
                {step < 3 && !loading && <ChevronRight size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormGroup({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2 text-white">
      <label className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76] dark:text-slate-500 ml-1">{label}</label>
      <input type={type} className="w-full bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-xl p-4 text-xs font-medium outline-none focus:border-indigo-500 transition-colors text-[#09090b] dark:text-white text-white" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} required />
    </div>
  );
}

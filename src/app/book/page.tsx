'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
      // 1. Create Order via our API
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

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Cepheus Repair',
        description: 'Booking Fee',
        order_id: data.order_id,
        handler: function (response: any) {
          // Success! Redirect using the REAL booking_id from Supabase
          router.push(`/track/${data.booking_id}`);
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-foreground transition-colors">
      <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-md overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Book a Repair</h1>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-primary">Step {step} of 3</span>
              <span className="text-sm text-muted-foreground">{Math.round((step/3)*100)}% Complete</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(step/3)*100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleBooking} className="space-y-6">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Device Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Brand</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dell, HP, Apple"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Model Name/Number</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. XPS 13, MacBook Air M2"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
                      value={formData.model}
                      onChange={e => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Describe the Issue</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="What's wrong with your device?"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
                      value={formData.issue}
                      onChange={e => setFormData({...formData, issue: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Contact Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="10-digit mobile number"
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Pickup Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Full Pickup Address</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Pickup Slot</label>
                    <select
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground"
                      value={formData.slot}
                      onChange={e => setFormData({...formData, slot: e.target.value})}
                    >
                      <option>Tomorrow, 10 AM - 12 PM</option>
                      <option>Tomorrow, 2 PM - 4 PM</option>
                      <option>Day after, 10 AM - 12 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 mt-8 border-t border-border">
              {step > 1 && (
                <button
                  disabled={loading}
                  type="button"
                  onClick={prevStep}
                  className="flex-1 p-4 border border-border rounded-lg font-bold hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              )}
              <button
                disabled={loading}
                type="submit"
                className="flex-1 bg-primary text-primary-foreground p-4 rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : (step === 3 ? 'Confirm & Pay ₹99' : 'Next')}
                {step < 3 && !loading && <ChevronRight size={20} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

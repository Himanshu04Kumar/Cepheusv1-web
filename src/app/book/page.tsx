'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function BookingPage() {
  const [step, setStep] = useState(1);
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

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
    } else {
      // In a real app, this would save to Supabase
      console.log('Submitting:', formData);
      const mockId = Math.random().toString(36).substr(2, 9).toUpperCase();
      alert(`Booking Successful! Your ID: ${mockId}`);
      router.push(`/track/${mockId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Book a Repair</h1>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Step {step} of 3</span>
              <span className="text-sm text-gray-400">{Math.round((step/3)*100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${(step/3)*100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold mb-4">Device Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dell, HP, Apple"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Name/Number</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. XPS 13, MacBook Air M2"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.model}
                      onChange={e => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Describe the Issue</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="What's wrong with your device?"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.issue}
                      onChange={e => setFormData({...formData, issue: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="10-digit mobile number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-semibold mb-4">Pickup Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Pickup Address</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Slot</label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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

            <div className="flex gap-4 pt-6 mt-8 border-t">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 p-4 border-2 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {step === 3 ? 'Confirm & Pay ₹99' : 'Next'}
                {step < 3 && <ChevronRight size={20} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

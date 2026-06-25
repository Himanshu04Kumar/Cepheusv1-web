'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminJobManagement() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [diagnosis, setDiagnosis] = useState('');
  const [price, setPrice] = useState('');
  const [parts, setParts] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
      if (data) setBooking(data);
      setLoading(false);
    }
    if (id) fetchJob();
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await supabase.from('bookings').update({ status } as any).eq('id', id);
    window.location.reload();
  };

  const submitApprovalRequest = async () => {
    setUpdating(true);
    await supabase.from('approval_requests').insert({
      booking_id: id,
      diagnosis_text: diagnosis,
      quoted_price: parseFloat(price),
      parts_detail: parts,
      status: 'PENDING'
    } as any);

    await supabase.from('bookings').update({ status: 'AWAITING_APPROVAL' } as any).eq('id', id);
    window.location.reload();
  };

  const uploadPhoto = async () => {
    setUpdating(true);
    await supabase.from('repair_photos').insert({
      booking_id: id,
      stage: booking.status,
      photo_url: photoUrl
    } as any);
    setPhotoUrl('');
    setUpdating(false);
    alert('Photo uploaded (Mock)');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin" /></div>;
  if (!booking) return <div className="p-8">Job not found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Manage Job: {booking.customer_name}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Status Controls */}
          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <RefreshCw size={18} className="text-primary" />
              Update Status
            </h2>
            <p className="text-sm text-muted-foreground">Current: <span className="font-bold text-primary">{booking.status}</span></p>
            <div className="grid grid-cols-2 gap-2">
              {['PICKED_UP', 'DIAGNOSING', 'IN_REPAIR', 'QUALITY_CHECK', 'DELIVERED'].map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                  className="p-2 text-xs font-bold border border-border rounded hover:bg-primary hover:text-white transition-colors uppercase"
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <Camera size={18} className="text-primary" />
              Upload Stage Photo
            </h2>
            <input
              type="text"
              placeholder="Paste Photo URL (Mock)"
              className="w-full p-2 bg-background border border-border rounded text-sm outline-none focus:ring-1 ring-primary"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
            />
            <button
              onClick={uploadPhoto}
              disabled={!photoUrl || updating}
              className="w-full bg-primary text-white py-2 rounded font-bold text-sm disabled:opacity-50"
            >
              Upload Photo
            </button>
          </div>

          {/* Approval Request */}
          <div className="bg-card p-6 rounded-xl border border-border space-y-4 md:col-span-2">
            <h2 className="font-bold flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" />
              Create Approval Request (Transparency Gate)
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <textarea
                placeholder="Diagnosis"
                className="p-2 bg-background border border-border rounded text-sm col-span-2 h-24 outline-none focus:ring-1 ring-primary"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
              />
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  className="w-full p-2 bg-background border border-border rounded text-sm outline-none focus:ring-1 ring-primary"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Parts Details"
                  className="w-full p-2 bg-background border border-border rounded text-sm outline-none focus:ring-1 ring-primary"
                  value={parts}
                  onChange={e => setParts(e.target.value)}
                />
                <button
                  onClick={submitApprovalRequest}
                  disabled={!diagnosis || !price || updating}
                  className="w-full bg-amber-600 text-white py-2 rounded font-bold text-sm hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  Send to Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

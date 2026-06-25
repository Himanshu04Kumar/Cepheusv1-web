// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Timeline } from '@/components/Timeline';
import { ApprovalGate } from '@/components/ApprovalGate';
import { supabase } from '@/lib/supabase';

export default function TrackingPage() {
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [approvalRequest, setApprovalRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Booking
        const { data: bData } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();

        if (bData) setBooking(bData);

        // Fetch Photos
        const { data: pData } = await supabase
          .from('repair_photos')
          .select('*')
          .eq('booking_id', id)
          .order('created_at', { ascending: true });

        if (pData) setPhotos(pData);

        // Fetch Pending Approval
        const { data: aData } = await supabase
          .from('approval_requests')
          .select('*')
          .eq('booking_id', id)
          .eq('status', 'PENDING')
          .single();

        if (aData) setApprovalRequest(aData);

      } catch (err) {
        console.error('Error fetching tracking data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  const handleApprove = async () => {
    if (!approvalRequest) return;
    const { error } = await supabase
      .from('approval_requests')
      .update({ status: 'APPROVED', responded_at: new Date().toISOString() } as any)
      .eq('id', approvalRequest.id);

    if (!error) {
      // Refresh page to show updated status
      window.location.reload();
    }
  };

  const handleDecline = async () => {
    if (!approvalRequest) return;
    const { error } = await supabase
      .from('approval_requests')
      .update({ status: 'DECLINED', responded_at: new Date().toISOString() } as any)
      .eq('id', approvalRequest.id);

    if (!error) {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find a repair order with ID: {id}</p>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  // Generate timeline based on status
  const statuses = [
    'PENDING_PAYMENT', 'BOOKED', 'PICKED_UP', 'DIAGNOSING',
    'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'DELIVERED'
  ];

  const currentIdx = statuses.indexOf(booking.status);

  const timelineItems = statuses.map((s, i) => ({
    status: s.replace('_', ' '),
    date: i <= currentIdx ? (i === currentIdx ? 'In Progress' : 'Completed') : '-',
    completed: i < currentIdx,
    active: i === currentIdx
  })).filter(item => item.status !== 'PENDING PAYMENT'); // Filter out internal status for customer

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-foreground transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Repair Status</h1>
        </div>

        {/* Status Card */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Booking ID</p>
              <h2 className="text-xl font-mono font-bold text-primary uppercase">{id.slice(0, 8)}</h2>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 border border-primary/20">
              <Clock size={16} />
              {booking.status.replace('_', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Device</p>
              <p className="font-medium text-foreground">{booking.device_brand} {booking.device_model}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Booked On</p>
              <p className="font-medium text-foreground">{new Date(booking.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Approval Gate */}
        {approvalRequest && (
          <ApprovalGate
            diagnosis={approvalRequest.diagnosis_text}
            parts={approvalRequest.parts_detail}
            price={approvalRequest.quoted_price}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Timeline items={timelineItems} />

          {/* Photo Log */}
          <div className="bg-card p-6 rounded-xl shadow-sm space-y-6 border border-border">
            <h3 className="font-bold flex items-center gap-2 text-foreground">
              <Camera size={18} className="text-primary" />
              Repair Photo Log
            </h3>

            {photos.length === 0 ? (
              <div className="bg-muted/30 p-8 rounded-lg border border-dashed border-border text-center">
                <p className="text-sm text-muted-foreground">No photos uploaded yet. Your technician will add photos at each stage of the repair.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, i) => (
                  <div key={i} className="space-y-2">
                    <img src={photo.photo_url} alt={photo.stage} className="aspect-video object-cover rounded-lg border border-border bg-muted" />
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{photo.stage.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground italic bg-muted/30 p-3 rounded-lg border border-border/50 leading-relaxed">
              Radical Transparency: We provide photographic evidence of parts removed and installed to ensure your peace of mind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

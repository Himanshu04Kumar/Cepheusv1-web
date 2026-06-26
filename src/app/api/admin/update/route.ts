// @ts-nocheck
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { action, bookingId, data } = await req.json();

    if (action === 'UPDATE_STATUS') {
      const { error } = await (supabaseAdmin as any)
        .from('bookings')
        .update({ status: data.status })
        .eq('id', bookingId);
      if (error) throw error;
    }

    if (action === 'CREATE_APPROVAL') {
      const { error: reqError } = await (supabaseAdmin as any)
        .from('approval_requests')
        .insert({
          booking_id: bookingId,
          diagnosis_text: data.diagnosis,
          quoted_price: data.price,
          parts_detail: data.parts,
          status: 'PENDING'
        });
      if (reqError) throw reqError;

      await (supabaseAdmin as any)
        .from('bookings')
        .update({ status: 'AWAITING_APPROVAL' })
        .eq('id', bookingId);
    }

    if (action === 'UPLOAD_PHOTO') {
      const { error } = await (supabaseAdmin as any)
        .from('repair_photos')
        .insert({
          booking_id: bookingId,
          stage: data.stage,
          photo_url: data.url
        });
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

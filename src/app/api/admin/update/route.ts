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

    if (action === 'PUBLISH_OPTIONS') {
      // 1. Clear existing options
      await (supabaseAdmin as any).from('repair_options').delete().eq('booking_id', bookingId);

      // 2. Insert new options
      const { error } = await (supabaseAdmin as any)
        .from('repair_options')
        .insert(data.options.map(opt => ({ ...opt, booking_id: bookingId })));

      if (error) throw error;

      // 3. Move status
      await (supabaseAdmin as any).from('bookings').update({ status: 'AWAITING_APPROVAL' }).eq('id', bookingId);
    }

    if (action === 'DOCUMENT_PART') {
      const { error } = await (supabaseAdmin as any)
        .from('part_documentation')
        .insert({
          booking_id: bookingId,
          ...data
        });
      if (error) throw error;
    }

    if (action === 'ISSUE_WARRANTY') {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(data.days));

      const { error } = await (supabaseAdmin as any)
        .from('warranty_details')
        .upsert({
          booking_id: bookingId,
          warranty_id: `W-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          period_days: parseInt(data.days),
          expiry_date: expiryDate.toISOString().split('T')[0],
          status: 'ACTIVE'
        });
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

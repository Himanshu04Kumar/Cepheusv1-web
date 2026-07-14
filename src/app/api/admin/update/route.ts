// @ts-nocheck
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { action, bookingId, data, adminRole } = await req.json();

    if (action === 'UPDATE_STATUS') {
      // 1. Fetch current status to check for reversal
      const { data: current } = await (supabaseAdmin as any)
        .from('bookings')
        .select('status')
        .eq('id', bookingId)
        .single();

      const stages = ['BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      const currentIndex = stages.indexOf(current.status);
      const newIndex = stages.indexOf(data.status);

      // 2. SECURITY LOCK: If trying to go backwards and NOT a SUPER_ADMIN -> BLOCK
      if (newIndex < currentIndex && adminRole !== 'SUPER_ADMIN') {
        return NextResponse.json({
          error: 'SECURITY PROTOCOL: Only Super Admin can reverse a repair stage.'
        }, { status: 403 });
      }

      const updateData = { status: data.status };
      if (data.status === 'OUT_FOR_DELIVERY' && data.deliveryWindow) {
        updateData.pickup_slot = data.deliveryWindow;
      }

      const { error } = await (supabaseAdmin as any)
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'PUBLISH_OPTIONS') {
      await (supabaseAdmin as any).from('repair_options').delete().eq('booking_id', bookingId);
      const { error } = await (supabaseAdmin as any)
        .from('repair_options')
        .insert(data.options.map(opt => ({
          booking_id: bookingId,
          option_name: opt.option_name,
          description: opt.description,
          price: parseFloat(opt.price) || 0
        })));
      if (error) throw error;
      await (supabaseAdmin as any).from('bookings').update({ status: 'AWAITING_APPROVAL' }).eq('id', bookingId);
      return NextResponse.json({ success: true });
    }

    if (action === 'DOCUMENT_PART') {
      const { error } = await (supabaseAdmin as any)
        .from('part_documentation')
        .insert({
          booking_id: bookingId,
          removed_part_name: data.name,
          removed_part_photo: data.photo,
          installed_serial: data.serial
        });
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'ADD_COMMENT') {
      const { error } = await (supabaseAdmin as any)
        .from('repair_comments')
        .insert({
          booking_id: bookingId,
          stage: data.stage,
          comment_text: data.text
        });
      if (error) throw error;
      return NextResponse.json({ success: true });
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
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

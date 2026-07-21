// @ts-nocheck
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function logActivity(bookingId, actionType, details, adminEmail) {
  try {
    await (supabaseAdmin as any).from('staff_activity_logs').insert({
      admin_email: adminEmail || 'SYSTEM',
      action_type: actionType,
      target_id: bookingId,
      details: details
    });
  } catch (e) { console.error('Log Error:', e); }
}

export async function POST(req: Request) {
  try {
    const { action, bookingId, data, adminRole, adminEmail } = await req.json();

    if (action === 'UPDATE_STATUS') {
      const { status, deliveryWindow } = data;

      // 1. STAGE REVERSAL SECURITY
      const { data: current } = await supabaseAdmin.from('bookings').select('status').eq('id', bookingId).single();
      const stages = ['BOOKED', 'PICKED_UP', 'DIAGNOSING', 'AWAITING_APPROVAL', 'IN_REPAIR', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      const currentIndex = stages.indexOf(current.status);
      const targetIndex = stages.indexOf(status);

      if (targetIndex < currentIndex && adminRole !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'SECURITY: Stage reversal requires Super Admin authorization.' }, { status: 403 });
      }

      // 2. EXECUTE UPDATE
      const updateData = { status };
      if (deliveryWindow) updateData.delivery_window = deliveryWindow;

      const { error } = await supabaseAdmin.from('bookings').update(updateData).eq('id', bookingId);
      if (error) throw error;

      await logActivity(bookingId, 'STATUS_CHANGE', `Moved to ${status}`, adminEmail);
      return NextResponse.json({ success: true });
    }

    if (action === 'PUBLISH_OPTIONS') {
      await supabaseAdmin.from('repair_options').delete().eq('booking_id', bookingId);
      const optionsToInsert = data.options.map(o => ({
        booking_id: bookingId,
        option_name: o.option_name,
        description: o.description,
        price: parseFloat(o.price),
        is_selected: false
      }));
      await supabaseAdmin.from('repair_options').insert(optionsToInsert);
      await supabaseAdmin.from('bookings').update({ status: 'AWAITING_APPROVAL' }).eq('id', bookingId);

      await logActivity(bookingId, 'PUBLISH_QUOTES', `Published ${optionsToInsert.length} options`, adminEmail);
      return NextResponse.json({ success: true });
    }

    if (action === 'ADD_COMMENT') {
      const { error } = await supabaseAdmin.from('repair_comments').insert({
        booking_id: bookingId,
        stage: data.stage,
        comment_text: data.text
      });
      if (error) throw error;
      await logActivity(bookingId, 'TECH_NOTE', `Added note for ${data.stage}`, adminEmail);
      return NextResponse.json({ success: true });
    }

    if (action === 'DOCUMENT_PART') {
      // FIX: Ensure labels are optional and map to correct DB columns
      const { error } = await supabaseAdmin.from('part_documentation').insert({
        booking_id: bookingId,
        removed_part_name: data.name || 'Visual Evidence',
        removed_part_photo: data.photo,
        serial_number: data.serial || 'N/A'
      });
      if (error) throw error;
      await logActivity(bookingId, 'EVIDENCE_LOG', `Uploaded proof for ${data.name || 'Unlabeled Part'}`, adminEmail);
      return NextResponse.json({ success: true });
    }

    if (action === 'CALLBACK_REQUEST') {
      await supabaseAdmin.from('repair_comments').insert({
        booking_id: bookingId,
        stage: 'AWAITING_APPROVAL',
        comment_text: '🚨 CUSTOMER REQUESTED A CALLBACK REGARDING REPAIR OPTIONS.'
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'RESOLVE_CALLBACK') {
      const { commentId } = data;
      const { error } = await supabaseAdmin.from('repair_comments').delete().eq('id', commentId);
      if (error) throw error;
      await logActivity(bookingId, 'CALLBACK_RESOLVED', 'Cleared support ticket', adminEmail);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

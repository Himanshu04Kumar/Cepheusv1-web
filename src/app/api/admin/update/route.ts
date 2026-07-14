// @ts-nocheck
import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function logActivity(bookingId, actionType, details, req) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const adminEmail = session?.user?.email || 'SYSTEM';

    await (supabaseAdmin as any).from('staff_activity_logs').insert({
      admin_email: adminEmail,
      action_type: actionType,
      target_id: bookingId,
      details: details
    });
  } catch (e) {
    console.error('Audit Log Error:', e);
  }
}

export async function POST(req: Request) {
  try {
    const { action, bookingId, data } = await req.json();

    if (action === 'UPDATE_STATUS') {
      const { error } = await (supabaseAdmin as any)
        .from('bookings')
        .update({ status: data.status })
        .eq('id', bookingId);
      if (error) throw error;

      await logActivity(bookingId, 'STATUS_UPDATE', `Moved to ${data.status}`);
    }

    if (action === 'PUBLISH_OPTIONS') {
      await (supabaseAdmin as any).from('repair_options').delete().eq('booking_id', bookingId);
      const { error } = await (supabaseAdmin as any)
        .from('repair_options')
        .insert(data.options.map(opt => ({ ...opt, booking_id: bookingId })));
      if (error) throw error;

      await (supabaseAdmin as any).from('bookings').update({ status: 'AWAITING_APPROVAL' }).eq('id', bookingId);
      await logActivity(bookingId, 'PUBLISH_OPTIONS', `Generated ${data.options.length} quotes`);
    }

    if (action === 'DOCUMENT_PART') {
      const { error } = await (supabaseAdmin as any)
        .from('part_documentation').insert({ booking_id: bookingId, ...data });
      if (error) throw error;

      await logActivity(bookingId, 'PHOTO_UPLOAD', `Uploaded evidence for ${data.name}`);
    }

    // (Other actions follow same pattern...)
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

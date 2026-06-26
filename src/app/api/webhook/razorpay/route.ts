// @ts-nocheck
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { logToSheets } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'order.paid') {
      const order = event.payload.order.entity;
      const bookingId = order.receipt;

      // Update booking status
      const { data: booking, error } = await (supabaseAdmin as any)
        .from('bookings')
        .update({
          status: 'BOOKED',
          booking_fee_paid: true
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Log to Google Sheets
      await logToSheets(booking);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

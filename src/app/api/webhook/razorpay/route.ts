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
      const amount = order.amount; // In paise

      // Logic: If amount is 9900 (₹99), it's a booking fee -> status = BOOKED
      // If amount is higher, it's a repair payment -> status = IN_REPAIR
      const isBookingFee = amount === 9900;
      const newStatus = isBookingFee ? 'BOOKED' : 'IN_REPAIR';

      const { data: booking, error } = await (supabaseAdmin as any)
        .from('bookings')
        .update({
          status: newStatus,
          booking_fee_paid: true
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Only log to sheets for the initial booking fee to avoid duplicates
      if (isBookingFee) {
        await logToSheets(booking);
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

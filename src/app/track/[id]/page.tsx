// @ts-nocheck
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// This API now handles both creating the order AND confirming the update
export async function POST(req: Request) {
  try {
    const { action, bookingId, amount, approvalId } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (action === 'CREATE_ORDER') {
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: bookingId,
      });
      return NextResponse.json({ order_id: order.id, amount: order.amount });
    }

    if (action === 'CONFIRM_PAYMENT') {
      // SECURE BACKEND UPDATE: Bypasses RLS and ensures status moves forward
      // 1. Mark approval as APPROVED
      await (supabaseAdmin as any)
        .from('approval_requests')
        .update({ status: 'APPROVED', responded_at: new Date().toISOString() })
        .eq('id', approvalId);

      // 2. Move booking to IN_REPAIR
      await (supabaseAdmin as any)
        .from('bookings')
        .update({ status: 'IN_REPAIR' })
        .eq('id', bookingId);

      return NextResponse.json({ success: true });
    }

  } catch (error: any) {
    console.error('Final Payment API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

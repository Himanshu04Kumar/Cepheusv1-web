import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseAdmin } from '@/lib/supabase';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer_name, customer_phone, device_brand, device_model, issue_description, pickup_address, pickup_slot } = body;

    // 1. Create a draft booking in Supabase
    const { data: booking, error } = await (supabaseAdmin
      .from('bookings')
      .insert({
        customer_name,
        customer_phone,
        device_brand,
        device_model,
        issue_description,
        pickup_address,
        pickup_slot,
        status: 'PENDING_PAYMENT',
        booking_fee_paid: false
      } as any)
      .select()
      .single() as any);

    if (error) throw error;

    // 2. Create Razorpay Order
    const amount = 99 * 100; // ₹99 in paise
    const options = {
      amount,
      currency: 'INR',
      receipt: booking.id,
      notes: {
        booking_id: booking.id,
        customer_name
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      booking_id: booking.id
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

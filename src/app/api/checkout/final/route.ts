// @ts-nocheck
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { bookingId, amount } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: bookingId,
    });

    return NextResponse.json({ order_id: order.id, amount: order.amount });
  } catch (error: any) {
    console.error('Final Payment API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

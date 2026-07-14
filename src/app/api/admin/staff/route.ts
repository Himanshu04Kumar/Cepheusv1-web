// @ts-nocheck
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { action, email, password, userId } = await req.json();

    if (action === 'CREATE_EMPLOYEE') {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      if (error) throw error;
      return NextResponse.json({ success: true, user: data.user });
    }

    if (action === 'DELETE_EMPLOYEE') {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // NEW: Security Reset Protocol
    if (action === 'RESET_PASSWORD') {
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: password }
      );
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Staff API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

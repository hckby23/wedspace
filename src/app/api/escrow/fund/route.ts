import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const fundEscrowSchema = z.object({
  escrow_id: z.string().uuid(),
  razorpay_payment_id: z.string()
});

/**
 * POST /api/escrow/fund
 * Mark escrow as funded after successful payment
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const fundData = fundEscrowSchema.parse(body);

    // Get escrow account
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_accounts')
      .select('*')
      .eq('id', fundData.escrow_id)
      .single();

    if (escrowError || !escrow) {
      return NextResponse.json({ error: 'Escrow account not found' }, { status: 404 });
    }

    // Verify user owns the escrow
    if (escrow.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to fund this escrow' }, { status: 403 });
    }

    // Verify escrow is in pending status
    if (escrow.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Escrow is not in pending status',
        current_status: escrow.status 
      }, { status: 400 });
    }

    // Update escrow to funded
    const { data: updatedEscrow, error: updateError } = await supabase
      .from('escrow_accounts')
      .update({
        status: 'funded',
        razorpay_payment_id: fundData.razorpay_payment_id,
        funded_at: new Date().toISOString()
      })
      .eq('id', fundData.escrow_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Create deposit transaction
    await supabase.from('escrow_transactions').insert({
      escrow_account_id: fundData.escrow_id,
      transaction_type: 'deposit',
      amount: escrow.advance_amount,
      currency: 'INR',
      from_user_id: escrow.user_id,
      to_user_id: null, // Held in escrow
      status: 'completed',
      description: 'Advance payment deposited to escrow',
      razorpay_payment_id: fundData.razorpay_payment_id,
      created_by: user.id,
      processed_at: new Date().toISOString()
    });

    // Update booking status
    await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        advance_paid: true,
        advance_paid_at: new Date().toISOString()
      })
      .eq('id', escrow.booking_id);

    // Notify vendor
    await supabase.from('notifications').insert({
      user_id: escrow.vendor_id,
      type: 'payment',
      title: 'Payment Received',
      message: `Advance payment of ₹${escrow.advance_amount.toLocaleString()} has been received and held in escrow.`,
      data: {
        escrow_id: fundData.escrow_id,
        booking_id: escrow.booking_id,
        amount: escrow.advance_amount
      }
    });

    return NextResponse.json({ 
      success: true,
      escrow: updatedEscrow,
      message: 'Escrow funded successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid fund data', details: error.errors }, { status: 400 });
    }
    console.error('Escrow fund error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

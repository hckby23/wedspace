import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const refundEscrowSchema = z.object({
  escrow_id: z.string().uuid(),
  amount: z.number().positive(),
  reason: z.string().min(10),
  razorpay_refund_id: z.string().optional()
});

/**
 * POST /api/escrow/refund
 * Refund funds from escrow to customer
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const refundData = refundEscrowSchema.parse(body);

    // Get escrow account
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_accounts')
      .select('*')
      .eq('id', refundData.escrow_id)
      .single();

    if (escrowError || !escrow) {
      return NextResponse.json({ error: 'Escrow account not found' }, { status: 404 });
    }

    // Check authorization - vendor, customer, or admin can initiate refund
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isVendor = escrow.vendor_id === user.id;
    const isCustomer = escrow.user_id === user.id;

    if (!isAdmin && !isVendor && !isCustomer) {
      return NextResponse.json({ error: 'Unauthorized to refund' }, { status: 403 });
    }

    // Verify escrow has funds to refund
    if (escrow.status !== 'funded' && escrow.status !== 'partial_released' && escrow.status !== 'disputed') {
      return NextResponse.json({ error: 'Escrow must be funded to refund' }, { status: 400 });
    }

    // Calculate available amount for refund
    const available_amount = escrow.total_amount - escrow.released_amount - escrow.refunded_amount;

    if (refundData.amount > available_amount) {
      return NextResponse.json({ 
        error: 'Insufficient funds available for refund',
        available: available_amount 
      }, { status: 400 });
    }

    // Update escrow account
    const new_refunded_amount = escrow.refunded_amount + refundData.amount;
    const new_status = new_refunded_amount >= (escrow.total_amount - escrow.released_amount) 
      ? 'refunded' 
      : escrow.status;

    const { data: updatedEscrow, error: updateError } = await supabase
      .from('escrow_accounts')
      .update({
        refunded_amount: new_refunded_amount,
        status: new_status,
        notes: escrow.notes 
          ? `${escrow.notes}\n${new Date().toISOString()}: Refunded ₹${refundData.amount} - ${refundData.reason}`
          : `${new Date().toISOString()}: Refunded ₹${refundData.amount} - ${refundData.reason}`
      })
      .eq('id', refundData.escrow_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('escrow_transactions')
      .insert({
        escrow_account_id: refundData.escrow_id,
        transaction_type: 'refund',
        amount: refundData.amount,
        from_user_id: escrow.vendor_id,
        to_user_id: escrow.user_id,
        status: 'completed',
        description: refundData.reason,
        razorpay_refund_id: refundData.razorpay_refund_id,
        created_by: user.id,
        processed_at: new Date().toISOString()
      });

    if (transactionError) {
      console.error('Failed to create transaction record:', transactionError);
    }

    // Create notifications
    await Promise.all([
      // Notify customer
      supabase.from('notifications').insert({
        user_id: escrow.user_id,
        type: 'payment',
        title: 'Refund Processed',
        message: `₹${refundData.amount.toLocaleString()} has been refunded to your account.`,
        data: {
          escrow_id: refundData.escrow_id,
          amount: refundData.amount,
          transaction_type: 'refund',
          reason: refundData.reason
        }
      }),
      // Notify vendor
      supabase.from('notifications').insert({
        user_id: escrow.vendor_id,
        type: 'payment',
        title: 'Refund Issued',
        message: `₹${refundData.amount.toLocaleString()} has been refunded to the customer.`,
        data: {
          escrow_id: refundData.escrow_id,
          amount: refundData.amount,
          transaction_type: 'refund',
          reason: refundData.reason
        }
      })
    ]);

    // Update booking status if fully refunded
    if (new_status === 'refunded') {
      await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancellation_reason: refundData.reason,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', escrow.booking_id);
    }

    return NextResponse.json({ 
      success: true,
      escrow: updatedEscrow,
      message: `Successfully refunded ₹${refundData.amount.toLocaleString()} to customer`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid refund data', details: error.errors }, { status: 400 });
    }
    console.error('Escrow refund error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

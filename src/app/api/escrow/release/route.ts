import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const releaseEscrowSchema = z.object({
  escrow_id: z.string().uuid(),
  amount: z.number().positive(),
  notes: z.string().optional(),
  razorpay_transfer_id: z.string().optional()
});

/**
 * POST /api/escrow/release
 * Release funds from escrow to vendor
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const releaseData = releaseEscrowSchema.parse(body);

    // Get escrow account
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_accounts')
      .select('*')
      .eq('id', releaseData.escrow_id)
      .single();

    if (escrowError || !escrow) {
      return NextResponse.json({ error: 'Escrow account not found' }, { status: 404 });
    }

    // Check authorization - only customer or admin can release funds
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isCustomer = escrow.user_id === user.id;

    if (!isAdmin && !isCustomer) {
      return NextResponse.json({ error: 'Unauthorized to release funds' }, { status: 403 });
    }

    // Verify escrow is funded
    if (escrow.status !== 'funded' && escrow.status !== 'partial_released') {
      return NextResponse.json({ error: 'Escrow must be funded to release' }, { status: 400 });
    }

    // Calculate available amount
    const available_amount = escrow.total_amount - escrow.released_amount - escrow.refunded_amount;

    if (releaseData.amount > available_amount) {
      return NextResponse.json({ 
        error: 'Insufficient funds in escrow',
        available: available_amount 
      }, { status: 400 });
    }

    // Update escrow account
    const new_released_amount = escrow.released_amount + releaseData.amount;
    const new_status = new_released_amount >= escrow.total_amount ? 'released' : 'partial_released';

    const { data: updatedEscrow, error: updateError } = await supabase
      .from('escrow_accounts')
      .update({
        released_amount: new_released_amount,
        status: new_status,
        release_approved_by: user.id,
        release_approved_at: new Date().toISOString(),
        released_at: new_status === 'released' ? new Date().toISOString() : escrow.released_at,
        razorpay_transfer_id: releaseData.razorpay_transfer_id || escrow.razorpay_transfer_id,
        notes: escrow.notes 
          ? `${escrow.notes}\n${new Date().toISOString()}: Released ₹${releaseData.amount} - ${releaseData.notes || 'No notes'}`
          : `${new Date().toISOString()}: Released ₹${releaseData.amount} - ${releaseData.notes || 'No notes'}`
      })
      .eq('id', releaseData.escrow_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('escrow_transactions')
      .insert({
        escrow_account_id: releaseData.escrow_id,
        transaction_type: 'release',
        amount: releaseData.amount,
        from_user_id: escrow.user_id,
        to_user_id: escrow.vendor_id,
        status: 'completed',
        description: releaseData.notes || 'Funds released to vendor',
        razorpay_transfer_id: releaseData.razorpay_transfer_id,
        created_by: user.id,
        processed_at: new Date().toISOString()
      });

    if (transactionError) {
      console.error('Failed to create transaction record:', transactionError);
    }

    // Create notifications
    await Promise.all([
      // Notify vendor
      supabase.from('notifications').insert({
        user_id: escrow.vendor_id,
        type: 'payment',
        title: 'Funds Released',
        message: `₹${releaseData.amount.toLocaleString()} has been released from escrow to your account.`,
        data: {
          escrow_id: releaseData.escrow_id,
          amount: releaseData.amount,
          transaction_type: 'release'
        }
      }),
      // Notify customer
      supabase.from('notifications').insert({
        user_id: escrow.user_id,
        type: 'payment',
        title: 'Funds Released',
        message: `₹${releaseData.amount.toLocaleString()} has been released from escrow to the vendor.`,
        data: {
          escrow_id: releaseData.escrow_id,
          amount: releaseData.amount,
          transaction_type: 'release'
        }
      })
    ]);

    // Update booking status if fully released
    if (new_status === 'released') {
      await supabase
        .from('bookings')
        .update({ 
          status: 'completed',
          fully_paid: true,
          fully_paid_at: new Date().toISOString()
        })
        .eq('id', escrow.booking_id);
    }

    return NextResponse.json({ 
      success: true,
      escrow: updatedEscrow,
      message: `Successfully released ₹${releaseData.amount.toLocaleString()} to vendor`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid release data', details: error.errors }, { status: 400 });
    }
    console.error('Escrow release error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

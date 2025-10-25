import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { APP_CONTEXT } from '@/config/app-context';
import { z } from 'zod';
import crypto from 'crypto';

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentSchema.parse(body);

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', APP_CONTEXT.PAYMENTS.RAZORPAY.KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Find payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        bookings (
          id,
          status,
          total_amount,
          advance_amount,
          remaining_amount
        )
      `)
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // Update payment status
    const { data: updatedPayment, error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        status: 'completed',
        verified_at: new Date().toISOString(),
        metadata: {
          ...payment.metadata,
          razorpay_signature: razorpay_signature,
          verified: true,
        },
      })
      .eq('id', payment.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update booking status based on payment type
    let bookingUpdate: any = {};
    
    if (payment.payment_type === 'advance') {
      bookingUpdate = {
        status: 'confirmed',
        advance_paid: true,
        advance_paid_at: new Date().toISOString(),
      };
    } else if (payment.payment_type === 'full') {
      bookingUpdate = {
        status: 'confirmed',
        advance_paid: true,
        fully_paid: true,
        advance_paid_at: new Date().toISOString(),
        fully_paid_at: new Date().toISOString(),
      };
    } else if (payment.payment_type === 'remaining') {
      bookingUpdate = {
        fully_paid: true,
        fully_paid_at: new Date().toISOString(),
      };
    }

    await supabase
      .from('bookings')
      .update(bookingUpdate)
      .eq('id', payment.booking_id);

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'payment',
      title: 'Payment Successful',
      message: `Your payment of ₹${payment.amount} has been processed successfully.`,
      data: { 
        payment_id: payment.id, 
        booking_id: payment.booking_id,
        amount: payment.amount 
      },
    });

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: 'Payment verified successfully',
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

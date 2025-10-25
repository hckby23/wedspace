import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { APP_CONTEXT } from '@/config/app-context';
import { z } from 'zod';
import Razorpay from 'razorpay';

const createOrderSchema = z.object({
  booking_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('INR'),
  payment_type: z.enum(['advance', 'full', 'remaining']),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { booking_id, amount, currency, payment_type } = createOrderSchema.parse(body);

    // Verify booking exists and user owns it
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        listings (
          id,
          title,
          owner_id,
          venues (name),
          vendors (name)
        )
      `)
      .eq('id', booking_id)
      .eq('user_id', user.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: APP_CONTEXT.PAYMENTS.RAZORPAY.KEY_ID,
      key_secret: APP_CONTEXT.PAYMENTS.RAZORPAY.KEY_SECRET,
    });

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: `booking_${booking_id}_${Date.now()}`,
      notes: {
        booking_id: booking_id,
        user_id: user.id,
        payment_type: payment_type,
        listing_title: booking.listings.title,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: booking_id,
        user_id: user.id,
        razorpay_order_id: razorpayOrder.id,
        amount: amount,
        currency: currency,
        payment_type: payment_type,
        status: 'pending',
        metadata: {
          razorpay_order: razorpayOrder,
          booking_title: booking.listings.title,
        },
      })
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    return NextResponse.json({
      payment_id: payment.id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: APP_CONTEXT.PAYMENTS.RAZORPAY.KEY_ID,
    });

  } catch (error) {
    console.error('Payment order creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

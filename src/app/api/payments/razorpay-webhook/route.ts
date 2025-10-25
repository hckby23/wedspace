import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Razorpay webhook event:', event.event);

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(supabase, event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(supabase, event.payload.payment.entity);
        break;
      
      case 'order.paid':
        await handleOrderPaid(supabase, event.payload.order.entity);
        break;
      
      case 'refund.created':
        await handleRefundCreated(supabase, event.payload.refund.entity);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentCaptured(supabase: any, payment: any) {
  try {
    // Update payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        razorpay_payment_id: payment.id,
        payment_method: payment.method,
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', payment.order_id);

    if (paymentError) {
      console.error('Error updating payment:', paymentError);
      return;
    }

    // Get the booking associated with this payment
    const { data: paymentRecord } = await supabase
      .from('payments')
      .select('booking_id, user_id, amount')
      .eq('razorpay_order_id', payment.order_id)
      .single();

    if (paymentRecord?.booking_id) {
      // Update booking status
      await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentRecord.booking_id);

      // Create notification for user
      await supabase.from('notifications').insert({
        user_id: paymentRecord.user_id,
        type: 'payment_success',
        title: 'Payment Successful',
        message: `Your payment of ₹${(payment.amount / 100).toLocaleString()} has been processed successfully. Your booking is now confirmed!`,
        data: {
          payment_id: payment.id,
          booking_id: paymentRecord.booking_id,
          amount: payment.amount / 100,
        },
      });

      // Log analytics event
      await supabase.from('events').insert({
        user_id: paymentRecord.user_id,
        event_type: 'payment_completed',
        event_data: {
          payment_id: payment.id,
          booking_id: paymentRecord.booking_id,
          amount: payment.amount / 100,
          method: payment.method,
        },
      });
    }

    console.log('Payment captured successfully:', payment.id);
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(supabase: any, payment: any) {
  try {
    // Update payment record
    await supabase
      .from('payments')
      .update({
        status: 'failed',
        razorpay_payment_id: payment.id,
        failure_reason: payment.error_description,
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', payment.order_id);

    // Get user for notification
    const { data: paymentRecord } = await supabase
      .from('payments')
      .select('user_id, booking_id')
      .eq('razorpay_order_id', payment.order_id)
      .single();

    if (paymentRecord) {
      // Create notification for user
      await supabase.from('notifications').insert({
        user_id: paymentRecord.user_id,
        type: 'payment_failed',
        title: 'Payment Failed',
        message: `Your payment could not be processed. Please try again or contact support if the issue persists.`,
        data: {
          payment_id: payment.id,
          booking_id: paymentRecord.booking_id,
          error: payment.error_description,
        },
      });

      // Log analytics event
      await supabase.from('events').insert({
        user_id: paymentRecord.user_id,
        event_type: 'payment_failed',
        event_data: {
          payment_id: payment.id,
          booking_id: paymentRecord.booking_id,
          error: payment.error_description,
          error_code: payment.error_code,
        },
      });
    }

    console.log('Payment failed:', payment.id, payment.error_description);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleOrderPaid(supabase: any, order: any) {
  try {
    console.log('Order paid:', order.id);
    
    // Additional order-level processing if needed
    await supabase.from('events').insert({
      event_type: 'order_paid',
      event_data: {
        order_id: order.id,
        amount: order.amount / 100,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}

async function handleRefundCreated(supabase: any, refund: any) {
  try {
    // Create refund record
    await supabase.from('payments').insert({
      razorpay_payment_id: refund.payment_id,
      razorpay_refund_id: refund.id,
      amount: -(refund.amount / 100), // Negative amount for refund
      currency: 'INR',
      status: 'refunded',
      type: 'refund',
      created_at: new Date().toISOString(),
    });

    // Get original payment for user notification
    const { data: originalPayment } = await supabase
      .from('payments')
      .select('user_id, booking_id')
      .eq('razorpay_payment_id', refund.payment_id)
      .single();

    if (originalPayment) {
      // Create notification
      await supabase.from('notifications').insert({
        user_id: originalPayment.user_id,
        type: 'refund_processed',
        title: 'Refund Processed',
        message: `Your refund of ₹${(refund.amount / 100).toLocaleString()} has been processed and will reflect in your account within 5-7 business days.`,
        data: {
          refund_id: refund.id,
          booking_id: originalPayment.booking_id,
          amount: refund.amount / 100,
        },
      });

      // Log analytics event
      await supabase.from('events').insert({
        user_id: originalPayment.user_id,
        event_type: 'refund_processed',
        event_data: {
          refund_id: refund.id,
          payment_id: refund.payment_id,
          amount: refund.amount / 100,
        },
      });
    }

    console.log('Refund processed:', refund.id);
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}

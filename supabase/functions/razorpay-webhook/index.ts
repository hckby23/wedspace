import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
}

interface RazorpayWebhookPayload {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment: {
      entity: {
        id: string
        entity: string
        amount: number
        currency: string
        status: string
        order_id: string
        invoice_id?: string
        international: boolean
        method: string
        amount_refunded: number
        refund_status?: string
        captured: boolean
        description?: string
        card_id?: string
        bank?: string
        wallet?: string
        vpa?: string
        email: string
        contact: string
        notes: Record<string, any>
        fee?: number
        tax?: number
        error_code?: string
        error_description?: string
        error_source?: string
        error_step?: string
        error_reason?: string
        acquirer_data?: Record<string, any>
        created_at: number
      }
    }
  }
  created_at: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or webhook secret' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.text()
    
    // Verify webhook signature
    const expectedSignature = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(key => 
      crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
    ).then(signature => 
      Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    )

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature')
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const payload: RazorpayWebhookPayload = JSON.parse(body)
    console.log('Webhook event:', payload.event)

    // Handle different webhook events
    switch (payload.event) {
      case 'payment.captured':
        await handlePaymentCaptured(supabase, payload)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(supabase, payload)
        break
      
      case 'order.paid':
        await handleOrderPaid(supabase, payload)
        break
      
      default:
        console.log('Unhandled webhook event:', payload.event)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handlePaymentCaptured(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity
  
  try {
    // Find payment record by Razorpay payment ID
    const { data: paymentRecord, error: findError } = await supabase
      .from('payments')
      .select(`
        *,
        bookings (
          id,
          user_id,
          listing_id,
          status
        )
      `)
      .eq('razorpay_payment_id', payment.id)
      .single()

    if (findError || !paymentRecord) {
      console.error('Payment record not found:', payment.id)
      return
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        captured_at: new Date().toISOString(),
        metadata: {
          ...paymentRecord.metadata,
          webhook_data: payment,
          captured_amount: payment.amount,
        }
      })
      .eq('id', paymentRecord.id)

    if (updateError) {
      console.error('Failed to update payment:', updateError)
      return
    }

    // Update booking status based on payment type
    let bookingUpdate: any = {}
    
    if (paymentRecord.payment_type === 'advance') {
      bookingUpdate = {
        status: 'confirmed',
        advance_paid: true,
        advance_paid_at: new Date().toISOString(),
      }
    } else if (paymentRecord.payment_type === 'full') {
      bookingUpdate = {
        status: 'confirmed',
        advance_paid: true,
        fully_paid: true,
        advance_paid_at: new Date().toISOString(),
        fully_paid_at: new Date().toISOString(),
      }
    } else if (paymentRecord.payment_type === 'remaining') {
      bookingUpdate = {
        fully_paid: true,
        fully_paid_at: new Date().toISOString(),
      }
    }

    await supabase
      .from('bookings')
      .update(bookingUpdate)
      .eq('id', paymentRecord.booking_id)

    // Create success notification
    await supabase.from('notifications').insert({
      user_id: paymentRecord.bookings.user_id,
      type: 'payment',
      title: 'Payment Confirmed',
      message: `Your payment of ₹${payment.amount / 100} has been successfully processed.`,
      data: { 
        payment_id: paymentRecord.id,
        booking_id: paymentRecord.booking_id,
        razorpay_payment_id: payment.id
      },
    })

    console.log('Payment captured successfully:', payment.id)

  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

async function handlePaymentFailed(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity
  
  try {
    // Update payment status to failed
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        metadata: {
          webhook_data: payment,
          error_code: payment.error_code,
          error_description: payment.error_description,
        }
      })
      .eq('razorpay_payment_id', payment.id)

    if (error) {
      console.error('Failed to update payment status:', error)
      return
    }

    // Get payment record to send notification
    const { data: paymentRecord } = await supabase
      .from('payments')
      .select(`
        *,
        bookings (user_id)
      `)
      .eq('razorpay_payment_id', payment.id)
      .single()

    if (paymentRecord) {
      // Create failure notification
      await supabase.from('notifications').insert({
        user_id: paymentRecord.bookings.user_id,
        type: 'payment',
        title: 'Payment Failed',
        message: `Your payment of ₹${payment.amount / 100} could not be processed. Please try again.`,
        data: { 
          payment_id: paymentRecord.id,
          error_code: payment.error_code,
          error_description: payment.error_description
        },
      })
    }

    console.log('Payment failed:', payment.id, payment.error_description)

  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleOrderPaid(supabase: any, payload: RazorpayWebhookPayload) {
  // Handle order paid event if needed
  console.log('Order paid event received')
}

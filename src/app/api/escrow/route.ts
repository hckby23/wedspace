import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const createEscrowSchema = z.object({
  booking_id: z.string().uuid(),
  user_id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  total_amount: z.number().positive(),
  advance_percentage: z.number().min(10).max(100).optional(),
  commission_percentage: z.number().min(0).max(30).optional(),
  auto_release_days: z.number().min(1).max(90).optional()
});

/**
 * GET /api/escrow
 * Get user's escrow accounts
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const booking_id = searchParams.get('booking_id');
    const escrow_id = searchParams.get('escrow_id');

    let query = supabase
      .from('escrow_accounts')
      .select(`
        *,
        bookings (
          id,
          event_date,
          status,
          listings (
            title,
            listing_type
          )
        )
      `)
      .or(`user_id.eq.${user.id},vendor_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (booking_id) {
      query = query.eq('booking_id', booking_id);
    }

    if (escrow_id) {
      query = query.eq('id', escrow_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ escrows: data });
  } catch (error) {
    console.error('Escrow GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/escrow
 * Create a new escrow account
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const escrowData = createEscrowSchema.parse(body);

    // Verify user owns the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('user_id, listing_id, total_amount')
      .eq('id', escrowData.booking_id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to create escrow for this booking' }, { status: 403 });
    }

    // Check if escrow already exists for this booking
    const { data: existingEscrow } = await supabase
      .from('escrow_accounts')
      .select('id')
      .eq('booking_id', escrowData.booking_id)
      .single();

    if (existingEscrow) {
      return NextResponse.json({ error: 'Escrow already exists for this booking' }, { status: 400 });
    }

    // Calculate amounts
    const advance_percentage = escrowData.advance_percentage || 30;
    const commission_percentage = escrowData.commission_percentage || 10;
    const auto_release_days = escrowData.auto_release_days || 7;

    const advance_amount = escrowData.total_amount * (advance_percentage / 100);
    const balance_amount = escrowData.total_amount - advance_amount;
    const commission_amount = escrowData.total_amount * (commission_percentage / 100);

    // Calculate auto-release date
    const auto_release_date = new Date();
    auto_release_date.setDate(auto_release_date.getDate() + auto_release_days);

    // Create escrow account
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_accounts')
      .insert({
        booking_id: escrowData.booking_id,
        user_id: escrowData.user_id,
        vendor_id: escrowData.vendor_id,
        total_amount: escrowData.total_amount,
        advance_amount,
        balance_amount,
        commission_amount,
        commission_percentage,
        auto_release_date: auto_release_date.toISOString(),
        status: 'pending',
        currency: 'INR'
      })
      .select()
      .single();

    if (escrowError) {
      return NextResponse.json({ error: escrowError.message }, { status: 500 });
    }

    // Create notification for vendor
    await supabase.from('notifications').insert({
      user_id: escrowData.vendor_id,
      type: 'payment',
      title: 'Escrow Created',
      message: `An escrow account has been created for your booking. Amount: ₹${escrowData.total_amount.toLocaleString()}`,
      data: {
        escrow_id: escrow.id,
        booking_id: escrowData.booking_id,
        amount: escrowData.total_amount
      }
    });

    return NextResponse.json({ escrow }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid escrow data', details: error.errors }, { status: 400 });
    }
    console.error('Escrow POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

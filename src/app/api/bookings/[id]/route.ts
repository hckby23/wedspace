import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const updateBookingSchema = z.object({
  guest_count: z.number().optional(),
  total_amount: z.number().optional(),
  final_price: z.number().optional(),
  advance_amount: z.number().optional(),
  balance_amount: z.number().optional(),
  booking_status: z.enum(['pending', 'confirmed', 'paid', 'completed', 'cancelled']).optional(),
  payment_status: z.string().optional(),
  special_requests: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        listings (
          id,
          title,
          listing_type,
          owner_id,
          venues (name, address, city, images),
          vendors (name, category, city, images)
        ),
        payments (
          id,
          amount,
          status,
          payment_method,
          razorpay_order_id,
          razorpay_payment_id,
          created_at
        ),
        profiles!bookings_user_id_fkey (
          full_name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if user has access to this booking
    const hasAccess = booking.user_id === user.id || booking.listings?.owner_id === user.id;
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ booking });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if booking exists and user has access
    const { data: existingBooking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        listings (owner_id)
      `)
      .eq('id', id)
      .single();

    if (bookingError || !existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const hasAccess = existingBooking.user_id === user.id || existingBooking.listings?.owner_id === user.id;
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const bookingData = updateBookingSchema.parse(body);

    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        ...bookingData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        listings (
          id,
          title,
          listing_type,
          venues (name, address),
          vendors (name, category)
        )
      `)
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Send notification for status changes
    if (bookingData.booking_status && bookingData.booking_status !== existingBooking.booking_status) {
      const notificationData = {
        user_id: existingBooking.user_id,
        type: 'booking' as const,
        title: 'Booking Status Updated',
        message: `Your booking status has been updated to ${bookingData.booking_status}`,
        data: { booking_id: id, status: bookingData.booking_status },
      };

      await supabase.from('notifications').insert(notificationData);
    }

    return NextResponse.json({ booking: updatedBooking });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid booking data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if booking exists and user has access
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('user_id, booking_status, event_date')
      .eq('id', id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if booking can be cancelled
    const eventDate = new Date(booking.event_date);
    const today = new Date();
    const daysDifference = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysDifference < 7) {
      return NextResponse.json({ 
        error: 'Cannot cancel booking less than 7 days before event date' 
      }, { status: 400 });
    }

    if (booking.booking_status === 'completed' || booking.booking_status === 'cancelled') {
      return NextResponse.json({ 
        error: 'Cannot cancel completed or already cancelled booking' 
      }, { status: 400 });
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        booking_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Create notification
    const notificationData = {
      user_id: booking.user_id,
      type: 'booking' as const,
      title: 'Booking Cancelled',
      message: 'Your booking has been successfully cancelled',
      data: { booking_id: id },
    };

    await supabase.from('notifications').insert(notificationData);

    return NextResponse.json({ message: 'Booking cancelled successfully' });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const createBookingSchema = z.object({
  listing_id: z.string().uuid(),
  venue_id: z.string().uuid().optional(),
  vendor_id: z.string().uuid().optional(),
  negotiation_id: z.string().uuid().optional(),
  event_date: z.string(),
  guest_count: z.number().optional(),
  total_amount: z.number(),
  final_price: z.number().optional(),
  advance_amount: z.number().optional(),
  balance_amount: z.number().optional(),
  special_requests: z.string().optional(),
  contact_name: z.string().min(1),
  contact_email: z.string().email(),
  contact_phone: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const bookingData = createBookingSchema.parse(body);

    // Verify listing exists and is available
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        listing_type,
        base_price,
        owner_id,
        status,
        inquiry_count,
        venues (id, name, capacity_max, advance_booking_days),
        vendors (id, name, category)
      `)
      .eq('id', bookingData.listing_id)
      .eq('status', 'active')
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found or inactive' }, { status: 404 });
    }

    // Check if user is trying to book their own listing
    if (listing.owner_id === user.id) {
      return NextResponse.json({ error: 'Cannot book your own listing' }, { status: 400 });
    }

    // Check venue capacity if applicable
    if (listing.listing_type === 'venue' && listing.venues?.[0]?.capacity_max) {
      if (bookingData.guest_count && bookingData.guest_count > listing.venues[0].capacity_max) {
        return NextResponse.json({ 
          error: `Guest count exceeds venue capacity of ${listing.venues[0].capacity_max}` 
        }, { status: 400 });
      }
    }

    // Check advance booking limit
    const eventDate = new Date(bookingData.event_date);
    const today = new Date();
    const daysDifference = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (listing.listing_type === 'venue' && listing.venues?.[0]?.advance_booking_days) {
      if (daysDifference > listing.venues[0].advance_booking_days) {
        return NextResponse.json({ 
          error: `Cannot book more than ${listing.venues[0].advance_booking_days} days in advance` 
        }, { status: 400 });
      }
    }

    // Check for existing bookings on the same date
    const { data: existingBookings, error: bookingCheckError } = await supabase
      .from('bookings')
      .select('id')
      .eq('listing_id', bookingData.listing_id)
      .eq('event_date', bookingData.event_date)
      .in('booking_status', ['confirmed', 'paid']);

    if (bookingCheckError) {
      return NextResponse.json({ error: bookingCheckError.message }, { status: 500 });
    }

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ 
        error: 'This date is already booked' 
      }, { status: 409 });
    }

    // Calculate commission (assuming 10% commission)
    const commissionRate = 0.10;
    const commissionAmount = bookingData.total_amount * commissionRate;

    // Create booking
    const { data: booking, error: createError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        listing_id: bookingData.listing_id,
        venue_id: bookingData.venue_id,
        vendor_id: bookingData.vendor_id,
        negotiation_id: bookingData.negotiation_id,
        booking_date: new Date().toISOString(),
        event_date: bookingData.event_date,
        guest_count: bookingData.guest_count,
        total_amount: bookingData.total_amount,
        final_price: bookingData.final_price || bookingData.total_amount,
        advance_amount: bookingData.advance_amount || bookingData.total_amount * 0.3, // 30% advance
        balance_amount: bookingData.balance_amount || bookingData.total_amount * 0.7, // 70% balance
        commission_amount: commissionAmount,
        booking_status: 'pending',
        payment_status: 'pending',
        special_requests: bookingData.special_requests,
      })
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

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    // Update user profile with contact info if provided
    if (bookingData.contact_name || bookingData.contact_phone) {
      await supabase
        .from('profiles')
        .update({
          full_name: bookingData.contact_name,
          phone: bookingData.contact_phone,
        })
        .eq('id', user.id);
    }

    // Update listing inquiry count
    await supabase
      .from('listings')
      .update({ 
        inquiry_count: (listing.inquiry_count || 0) + 1 
      })
      .eq('id', bookingData.listing_id);

    // Create notifications
    const notifications = [
      // Notification for the customer
      {
        user_id: user.id,
        type: 'booking' as const,
        title: 'Booking Created',
        message: `Your booking request for ${listing.title} has been submitted`,
        data: { booking_id: booking.id, listing_id: bookingData.listing_id },
      },
      // Notification for the vendor/venue owner
      {
        user_id: listing.owner_id,
        type: 'booking' as const,
        title: 'New Booking Request',
        message: `You have a new booking request for ${listing.title}`,
        data: { booking_id: booking.id, listing_id: bookingData.listing_id },
      }
    ];

    await supabase.from('notifications').insert(notifications);

    return NextResponse.json({ booking }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid booking data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

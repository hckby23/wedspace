import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const availabilityQuerySchema = z.object({
  date: z.string().optional(),
  month: z.string().optional(),
  year: z.coerce.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    const query = availabilityQuerySchema.parse(Object.fromEntries(searchParams));

    // Check if venue exists
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('id, name, advance_booking_days, base_price')
      .eq('id', id)
      .single();

    if (venueError || !venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Get existing bookings for the venue
    let bookingsQuery = supabase
      .from('bookings')
      .select('event_date, booking_status')
      .eq('venue_id', id)
      .in('booking_status', ['confirmed', 'paid']);

    if (query.date) {
      bookingsQuery = bookingsQuery.eq('event_date', query.date);
    } else if (query.month && query.year) {
      const startDate = `${query.year}-${query.month.padStart(2, '0')}-01`;
      const endDate = `${query.year}-${query.month.padStart(2, '0')}-31`;
      bookingsQuery = bookingsQuery.gte('event_date', startDate).lte('event_date', endDate);
    }

    const { data: bookings, error: bookingsError } = await bookingsQuery;

    if (bookingsError) {
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    // Generate availability data
    const bookedDates = new Set(bookings?.map(b => b.event_date) || []);
    const today = new Date();
    const maxBookingDate = new Date();
    maxBookingDate.setDate(today.getDate() + (venue.advance_booking_days || 365));

    if (query.date) {
      const requestedDate = new Date(query.date);
      const isAvailable = !bookedDates.has(query.date) && 
                         requestedDate >= today && 
                         requestedDate <= maxBookingDate;
      
      return NextResponse.json({
        date: query.date,
        available: isAvailable,
        reason: !isAvailable ? 
          (bookedDates.has(query.date) ? 'booked' : 
           requestedDate < today ? 'past' : 'advance_limit') : null
      });
    }

    // Return monthly availability
    const year = query.year || today.getFullYear();
    const month = query.month ? parseInt(query.month) : today.getMonth() + 1;
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const availability = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const date = new Date(dateStr);
      
      availability.push({
        date: dateStr,
        available: !bookedDates.has(dateStr) && date >= today && date <= maxBookingDate,
        price: venue.base_price || null,
        timeSlots: [
          { time: '10:00', available: !bookedDates.has(dateStr), price: venue.base_price },
          { time: '14:00', available: !bookedDates.has(dateStr), price: venue.base_price },
          { time: '18:00', available: !bookedDates.has(dateStr), price: venue.base_price },
        ]
      });
    }

    return NextResponse.json({
      venue_id: id,
      month: month,
      year: year,
      availability
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const checkAvailabilitySchema = z.object({
  listing_id: z.string().uuid(),
  date: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional()
});

const setAvailabilitySchema = z.object({
  listing_id: z.string().uuid(),
  date: z.string(),
  status: z.enum(['available', 'booked', 'blocked', 'tentative', 'maintenance']),
  base_price: z.number().positive().optional(),
  special_price: z.number().positive().optional(),
  max_capacity: z.number().int().positive().optional(),
  notes: z.string().optional()
});

/**
 * GET /api/availability
 * Check availability or get available dates
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    
    const listing_id = searchParams.get('listing_id');
    const date = searchParams.get('date');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    if (!listing_id) {
      return NextResponse.json({ error: 'listing_id is required' }, { status: 400 });
    }

    // Check single date availability
    if (date) {
      const { data, error } = await supabase.rpc('check_date_availability', {
        p_listing_id: listing_id,
        p_date: date,
        p_start_time: searchParams.get('start_time'),
        p_end_time: searchParams.get('end_time')
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ availability: data[0] });
    }

    // Get available dates in range
    if (start_date && end_date) {
      const { data, error } = await supabase.rpc('get_available_dates', {
        p_listing_id: listing_id,
        p_start_date: start_date,
        p_end_date: end_date
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ dates: data });
    }

    // Get all availability for listing
    const { data, error } = await supabase
      .from('availability_calendar')
      .select('*')
      .eq('listing_id', listing_id)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ availability: data });
  } catch (error) {
    console.error('Availability GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/availability
 * Set availability for a date
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const availabilityData = setAvailabilitySchema.parse(body);

    // Verify user owns the listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', availabilityData.listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to manage this listing' }, { status: 403 });
    }

    // Set availability
    const { data: availability, error: availError } = await supabase
      .from('availability_calendar')
      .upsert({
        listing_id: availabilityData.listing_id,
        owner_id: user.id,
        date: availabilityData.date,
        status: availabilityData.status,
        base_price: availabilityData.base_price,
        special_price: availabilityData.special_price,
        max_capacity: availabilityData.max_capacity,
        notes: availabilityData.notes,
        is_all_day: true,
        current_bookings: 0
      }, {
        onConflict: 'listing_id,date,start_time'
      })
      .select()
      .single();

    if (availError) {
      return NextResponse.json({ error: availError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      availability,
      message: 'Availability updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid availability data', details: error.errors }, { status: 400 });
    }
    console.error('Availability POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/availability
 * Bulk update availability
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listing_id, dates, status, base_price } = body;

    if (!listing_id || !dates || !Array.isArray(dates)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Verify ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', listing_id)
      .single();

    if (!listing || listing.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Bulk upsert
    const availabilityRecords = dates.map((date: string) => ({
      listing_id,
      owner_id: user.id,
      date,
      status: status || 'available',
      base_price,
      is_all_day: true,
      current_bookings: 0
    }));

    const { data, error } = await supabase
      .from('availability_calendar')
      .upsert(availabilityRecords, {
        onConflict: 'listing_id,date,start_time'
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      count: data.length,
      message: `Updated availability for ${data.length} dates`
    });
  } catch (error) {
    console.error('Availability PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

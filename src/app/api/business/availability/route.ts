import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const availabilitySchema = z.object({
  listing_id: z.string().uuid(),
  date: z.string(),
  is_available: z.boolean(),
  price: z.number().optional(),
  notes: z.string().optional(),
});

const bulkAvailabilitySchema = z.object({
  listing_id: z.string().uuid(),
  dates: z.array(z.object({
    date: z.string(),
    is_available: z.boolean(),
    price: z.number().optional(),
    notes: z.string().optional(),
  })),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listing_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 });
    }

    // Verify user owns the listing
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', listingId)
      .eq('owner_id', user.id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found or access denied' }, { status: 404 });
    }

    let availabilityQuery = supabase
      .from('availability')
      .select('*')
      .eq('listing_id', listingId)
      .order('date');

    if (startDate) {
      availabilityQuery = availabilityQuery.gte('date', startDate);
    }

    if (endDate) {
      availabilityQuery = availabilityQuery.lte('date', endDate);
    }

    const { data: availability, error } = await availabilityQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ availability });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Check if it's bulk update
    if (body.dates) {
      const validatedData = bulkAvailabilitySchema.parse(body);

      // Verify user owns the listing
      const { data: listing } = await supabase
        .from('listings')
        .select('owner_id')
        .eq('id', validatedData.listing_id)
        .eq('owner_id', user.id)
        .single();

      if (!listing) {
        return NextResponse.json({ error: 'Listing not found or access denied' }, { status: 404 });
      }

      // Upsert availability records
      const availabilityRecords = validatedData.dates.map(dateData => ({
        listing_id: validatedData.listing_id,
        ...dateData,
      }));

      const { data: availability, error } = await supabase
        .from('availability')
        .upsert(availabilityRecords, { 
          onConflict: 'listing_id,date',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ availability });

    } else {
      // Single availability update
      const validatedData = availabilitySchema.parse(body);

      // Verify user owns the listing
      const { data: listing } = await supabase
        .from('listings')
        .select('owner_id')
        .eq('id', validatedData.listing_id)
        .eq('owner_id', user.id)
        .single();

      if (!listing) {
        return NextResponse.json({ error: 'Listing not found or access denied' }, { status: 404 });
      }

      const { data: availability, error } = await supabase
        .from('availability')
        .upsert(validatedData, { 
          onConflict: 'listing_id,date',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ availability });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
